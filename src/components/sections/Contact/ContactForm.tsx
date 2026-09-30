"use client";

import { Check, LoaderCircle, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState, useState, type FormEvent } from "react";

import { sendContactMessage } from "@/app/actions/contact";
import buttonStyles from "@/components/ui/Button.module.css";
import {
  contactSchema,
  HONEYPOT_FIELD,
  initialContactState,
  type ContactField,
} from "@/lib/contact/schema";

import styles from "./Contact.module.css";

type FieldErrors = Partial<Record<ContactField, string>>;

const fields: {
  name: ContactField;
  label: string;
  type: "text" | "email" | "textarea";
  autoComplete?: string;
}[] = [
  { name: "name", label: "Your name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email address", type: "email", autoComplete: "email" },
  { name: "message", label: "Tell me about your project", type: "textarea" },
];

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialContactState);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});

  const serverErrors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const errors: FieldErrors = { ...serverErrors, ...clientErrors };
  const values = state.status === "error" ? (state.values ?? {}) : {};

  // Validate in the browser first for instant feedback; the server re-validates regardless.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const result = contactSchema.safeParse(data);
    if (result.success) {
      setClientErrors({});
      return;
    }

    event.preventDefault();
    const next: FieldErrors = {};
    for (const issue of result.error.issues) {
      next[issue.path[0] as ContactField] ??= issue.message;
    }
    setClientErrors(next);
  };

  const clearError = (field: ContactField) => {
    if (!clientErrors[field]) return;
    setClientErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className={styles.form}>
      {fields.map((field) => {
        const errorId = `${field.name}-error`;
        const common = {
          id: `contact-${field.name}`,
          name: field.name,
          placeholder: " ",
          defaultValue: values[field.name],
          autoComplete: field.autoComplete,
          "aria-invalid": Boolean(errors[field.name]),
          "aria-describedby": errors[field.name] ? errorId : undefined,
          onChange: () => clearError(field.name),
        };

        return (
          <div key={field.name} className={styles.field}>
            {field.type === "textarea" ? (
              <textarea {...common} rows={5} maxLength={2000} />
            ) : (
              <input {...common} type={field.type} maxLength={field.type === "email" ? 254 : 100} />
            )}
            <label htmlFor={common.id}>{field.label}</label>
            {errors[field.name] && (
              <p id={errorId} className={styles.fieldError}>
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>

      <button
        type="submit"
        className={`${buttonStyles.button} ${buttonStyles.primary} ${styles.submit}`}
        disabled={pending}
      >
        {pending ? "Sending…" : "Send message"}
        {pending ? (
          <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />
        ) : (
          <Send size={16} aria-hidden="true" />
        )}
      </button>

      <AnimatePresence mode="wait">
        {state.status !== "idle" && (
          <motion.p
            key={state.status + state.message}
            role={state.status === "error" ? "alert" : "status"}
            className={styles.formStatus}
            data-status={state.status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {state.status === "success" && <Check size={16} aria-hidden="true" />}
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
