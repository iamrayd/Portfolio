import { normalizeWord, rawPrefixLength } from "./matcher";

const ACCENT = "#ff2d2d";
const TEXT = "#ededed";
const MAX_DEVICE_PIXEL_RATIO = 2;
/** Frame delta cap (seconds) so a backgrounded tab doesn't teleport words. */
const MAX_FRAME_DELTA = 0.1;
/** Viewport width at which words render at full size. */
const REFERENCE_WIDTH = 1440;
const PIXELS_PER_WORD = 42000;
const MIN_WORDS = 12;
const MAX_WORDS = 44;

interface FallingWord {
  text: string;
  key: string;
  x: number;
  y: number;
  /** 0 = far away (small, dim, slow), 1 = close (large, bright, fast). */
  depth: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  /** 1 → 0 while the word flashes after being caught (reduced motion). */
  flash: number;
}

interface Particle {
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  spin: number;
  size: number;
  life: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  life: number;
}

export interface EngineOptions {
  words: readonly string[];
  fontFamily: string;
  reducedMotion: boolean;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Canvas renderer for the falling-words background.
 * Owns its animation loop; React only feeds it the current query and catches.
 */
export class FallingWordsEngine {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly options: EngineOptions;

  private words: FallingWord[] = [];
  private particles: Particle[] = [];
  private shockwaves: Shockwave[] = [];
  private query = "";
  private width = 0;
  private height = 0;
  /** Rotates through every word so small screens still show the full list over time. */
  private nextWordIndex = 0;
  private frameId = 0;
  private lastTime = 0;
  private running = false;

  constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
    const context = canvas.getContext("2d");
    if (!context) throw new Error("2D canvas context is not available");
    this.canvas = canvas;
    this.context = context;
    this.options = options;
  }

  start(): void {
    this.resize();
    this.resume();
  }

  resume(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frameId);
  }

  resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    const widthChanged = window.innerWidth !== this.width;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Mobile browser bars change only the height while scrolling; keep words in place then.
    if (widthChanged || this.words.length === 0) this.populate();
  }

  setQuery(query: string): void {
    this.query = normalizeWord(query);
  }

  /** Shatters every on-screen instance of `word` and respawns it at the top. */
  catchWord(word: string): void {
    const key = normalizeWord(word);
    for (const item of this.words) {
      if (item.key !== key) continue;
      if (this.options.reducedMotion) {
        item.flash = 1;
        continue;
      }
      this.shatter(item);
      this.respawn(item, false);
    }
  }

  private populate(): void {
    const count = Math.round(
      Math.min(Math.max((this.width * this.height) / PIXELS_PER_WORD, MIN_WORDS), MAX_WORDS),
    );
    this.nextWordIndex = Math.floor(Math.random() * this.options.words.length);
    this.words = Array.from({ length: count }, () => this.createWord());
  }

  private createWord(): FallingWord {
    const word: FallingWord = {
      text: "",
      key: "",
      x: 0,
      y: 0,
      depth: 0,
      size: 0,
      speed: 0,
      sway: 0,
      phase: 0,
      flash: 0,
    };
    this.respawn(word, true);
    return word;
  }

  private respawn(word: FallingWord, anywhere: boolean): void {
    const { words } = this.options;
    word.text = words[this.nextWordIndex % words.length];
    word.key = normalizeWord(word.text);
    this.nextWordIndex++;

    const depth = Math.random() ** 1.6; // bias toward the background
    const scale = Math.min(Math.max(this.width / REFERENCE_WIDTH, 0.65), 1);
    word.depth = depth;
    word.size = (11 + depth * 15) * scale;
    word.speed = 14 + depth * 58;
    word.sway = random(4, 14);
    word.phase = random(0, Math.PI * 2);
    word.x = random(16, Math.max(24, this.width - word.size * word.text.length * 0.9));
    word.y = anywhere ? random(0, this.height) : random(-160, -30);
  }

  private shatter(word: FallingWord): void {
    const { context } = this;
    context.font = this.font(word.size);
    let offset = 0;

    for (const char of word.text) {
      const charWidth = context.measureText(char).width;
      const angle = random(-Math.PI, 0);
      const force = random(120, 380);
      this.particles.push({
        char,
        x: word.x + offset,
        y: word.y,
        vx: Math.cos(angle) * force,
        vy: Math.sin(angle) * force,
        rotation: 0,
        spin: random(-8, 8),
        size: word.size * 1.15,
        life: 1,
      });
      offset += charWidth;
    }

    this.shockwaves.push({ x: word.x + offset / 2, y: word.y - word.size / 3, radius: 4, life: 1 });
  }

  private tick = (time: number): void => {
    if (!this.running) return;
    const delta = Math.min((time - this.lastTime) / 1000, MAX_FRAME_DELTA);
    this.lastTime = time;

    this.update(delta, time / 1000);
    this.draw();
    this.frameId = requestAnimationFrame(this.tick);
  };

  private update(delta: number, seconds: number): void {
    const moving = !this.options.reducedMotion;

    for (const word of this.words) {
      if (word.flash > 0) {
        word.flash = Math.max(0, word.flash - delta * 1.4);
        if (word.flash === 0) this.respawn(word, true);
      }
      if (!moving) continue;
      word.y += word.speed * delta;
      word.x += Math.sin(seconds * 0.6 + word.phase) * word.sway * delta;
      if (word.y > this.height + 40) this.respawn(word, false);
    }

    for (const particle of this.particles) {
      particle.vy += 520 * delta; // gravity
      particle.vx *= 1 - 1.2 * delta;
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.rotation += particle.spin * delta;
      particle.life -= delta * 0.9;
    }
    this.particles = this.particles.filter((particle) => particle.life > 0);

    for (const wave of this.shockwaves) {
      wave.radius += 260 * delta;
      wave.life -= delta * 1.8;
    }
    this.shockwaves = this.shockwaves.filter((wave) => wave.life > 0);
  }

  private draw(): void {
    const { context } = this;
    context.clearRect(0, 0, this.width, this.height);
    context.textBaseline = "alphabetic";

    for (const word of this.words) this.drawWord(word);
    this.drawShockwaves();
    this.drawParticles();
  }

  private drawWord(word: FallingWord): void {
    const { context } = this;
    const baseAlpha = 0.06 + word.depth * 0.2;
    const matches = this.query.length > 0 && word.key.startsWith(this.query);

    context.font = this.font(word.size);

    if (word.flash > 0) {
      context.globalAlpha = word.flash;
      context.fillStyle = ACCENT;
      context.shadowColor = ACCENT;
      context.shadowBlur = 24;
      context.fillText(word.text, word.x, word.y);
      context.shadowBlur = 0;
      context.globalAlpha = 1;
      return;
    }

    if (!matches) {
      context.globalAlpha = baseAlpha;
      context.fillStyle = TEXT;
      context.fillText(word.text, word.x, word.y);
      context.globalAlpha = 1;
      return;
    }

    // Typed letters glow red, the remainder brightens so the target is obvious.
    const split = rawPrefixLength(word.text, this.query.length);
    const head = word.text.slice(0, split);
    const tail = word.text.slice(split);

    context.globalAlpha = 1;
    context.fillStyle = ACCENT;
    context.shadowColor = ACCENT;
    context.shadowBlur = 18;
    context.fillText(head, word.x, word.y);
    context.shadowBlur = 0;

    context.globalAlpha = 0.75;
    context.fillStyle = TEXT;
    context.fillText(tail, word.x + context.measureText(head).width, word.y);
    context.globalAlpha = 1;
  }

  private drawParticles(): void {
    const { context } = this;
    context.fillStyle = ACCENT;
    context.shadowColor = ACCENT;
    context.shadowBlur = 14;

    for (const particle of this.particles) {
      context.save();
      context.globalAlpha = Math.max(particle.life, 0);
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.font = this.font(particle.size);
      context.fillText(particle.char, 0, 0);
      context.restore();
    }

    context.shadowBlur = 0;
  }

  private drawShockwaves(): void {
    const { context } = this;
    context.strokeStyle = ACCENT;

    for (const wave of this.shockwaves) {
      context.globalAlpha = Math.max(wave.life, 0) * 0.5;
      context.lineWidth = 1 + wave.life * 1.5;
      context.beginPath();
      context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      context.stroke();
    }

    context.globalAlpha = 1;
  }

  private font(size: number): string {
    return `400 ${size.toFixed(1)}px ${this.options.fontFamily}`;
  }
}
