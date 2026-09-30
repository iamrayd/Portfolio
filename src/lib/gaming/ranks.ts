/**
 * Ranking systems for the Hobbies section. Pure data and helpers,
 * shared by the animated cards.
 */

export interface ValorantRank {
  id: string;
  name: string;
  color: string;
  icon: string;
}

/** Division 1 of every Valorant rank, lowest to highest. Icons live in /public. */
export const valorantRanks = [
  { id: "iron-1", name: "Iron 1", color: "#868986" },
  { id: "bronze-1", name: "Bronze 1", color: "#a5855d" },
  { id: "silver-1", name: "Silver 1", color: "#bbc2c2" },
  { id: "gold-1", name: "Gold 1", color: "#eccf56" },
  { id: "platinum-1", name: "Platinum 1", color: "#59a9b6" },
  { id: "diamond-1", name: "Diamond 1", color: "#b489c4" },
  { id: "ascendant-1", name: "Ascendant 1", color: "#6ae2af" },
  { id: "immortal-1", name: "Immortal 1", color: "#bb3d65" },
  { id: "radiant", name: "Radiant", color: "#ffffaa" },
].map((rank): ValorantRank => ({ ...rank, icon: `/ranks/valorant/${rank.id}.png` }));

export function getValorantRank(id: string): ValorantRank {
  const rank = valorantRanks.find((item) => item.id === id);
  if (!rank) throw new Error(`Unknown Valorant rank: ${id}`);
  return rank;
}

/** Case-opening odds: low ranks are common, high ranks are rare. */
const REEL_WEIGHTS = [3, 3, 3, 3, 2, 1, 1, 1, 1];

/** Small deterministic PRNG so the server and client render the same reel. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Builds a reel of `length` ranks with `winner` placed at `winnerIndex`. */
export function buildReel(
  winner: ValorantRank,
  length: number,
  winnerIndex: number,
  seed: number,
): ValorantRank[] {
  const random = mulberry32(seed);
  const pool = valorantRanks.flatMap((rank, i) => Array(REEL_WEIGHTS[i]).fill(rank));
  return Array.from({ length }, (_, i) =>
    i === winnerIndex ? winner : pool[Math.floor(random() * pool.length)],
  );
}

export interface PremierTier {
  min: number;
  color: string;
  name: string;
}

/** CS2 Premier rating colour bands. */
export const premierTiers: PremierTier[] = [
  { min: 0, color: "#b0c3d9", name: "Grey" },
  { min: 5000, color: "#5e98d9", name: "Light blue" },
  { min: 10000, color: "#4b69ff", name: "Blue" },
  { min: 15000, color: "#8847ff", name: "Purple" },
  { min: 20000, color: "#d32ce6", name: "Pink" },
  { min: 25000, color: "#eb4b4b", name: "Red" },
  { min: 30000, color: "#e4ae39", name: "Gold" },
];

export function getPremierTier(rating: number): PremierTier {
  return premierTiers.reduce((current, tier) => (rating >= tier.min ? tier : current));
}

/** Splits a rating the way CS2 prints it: big thousands, small remainder ("19" + ",804"). */
export function splitPremierRating(rating: number): { thousands: string; rest: string } {
  const value = Math.max(0, Math.round(rating));
  return {
    thousands: String(Math.floor(value / 1000)),
    rest: `,${String(value % 1000).padStart(3, "0")}`,
  };
}

/** Elo at which each FACEIT CS2 level starts (index 0 = level 1). */
const FACEIT_LEVEL_FLOORS = [100, 501, 751, 901, 1051, 1201, 1351, 1531, 1751, 2001];

export function getFaceitLevel(elo: number): number {
  return FACEIT_LEVEL_FLOORS.reduce((level, floor, i) => (elo >= floor ? i + 1 : level), 1);
}

export function getFaceitColor(level: number): string {
  if (level <= 1) return "#eeeeee";
  if (level <= 3) return "#1ce400";
  if (level <= 7) return "#ffc800";
  if (level <= 9) return "#ff6309";
  return "#fe1f00";
}

export const FACEIT_MAX_LEVEL = FACEIT_LEVEL_FLOORS.length;
