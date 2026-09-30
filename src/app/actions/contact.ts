"use server";

import { headers } from "next/headers";

import { isRateLimited } from "@/lib/contact/rate-limit";
import {
  contactSchema,
  HONEYPOT_FIELD,
  type ContactField,
  type ContactFormState,
} from "@/lib/contact/schema";
import { EmailNotConfiguredError, sendContactEmail } from "@/lib/contact/send-email";

const readField = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

export async function sendContactMessage(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const values = {
    name: readField(formData, "name"),
    email: readField(formData, "email"),
    message: readField(formData, "message"),
  };

  // Pretend success so bots don't learn to skip the trap.
  if (readField(formData, HONEYPOT_FIELD)) {
    return { status: "success", message: "Thanks! Your message is on its way." };
  }

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return {
      status: "error",
      message: "You've sent a few messages already. Please try again in a few minutes.",
      values,
    };
  }

  try {
    await sendContactEmail(parsed.data);
    return { status: "success", message: "Thanks! Your message is on its way. I'll reply soon." };
  } catch (error) {
    if (error instanceof EmailNotConfiguredError) {
      console.warn(error.message);
    } else {
      console.error("Failed to send contact email", error);
    }
    return {
      status: "error",
      message:
        "Something went wrong sending your message. Please try again or reach out on GitHub.",
      values,
    };
  }
}
