"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/contact";
import { acknowledgementEmail, internalNotificationEmail, sendEmail } from "@/lib/email";

async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

export async function submitContactForm(values: ContactFormValues) {
  const parsed = contactFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  if (parsed.data.website) {
    // honeypot tripped — pretend success, do nothing
    return { ok: true as const };
  }

  const ip = await getClientIp();
  const supabase = await createClient();

  const { data: recent } = await supabase
    .from("contact_messages")
    .select("id, created_at")
    .eq("ip_address", ip)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent && Date.now() - new Date(recent.created_at).getTime() < 30_000) {
    return { ok: false as const, error: "Please wait a moment before submitting again." };
  }

  const { full_name, company, email, phone, subject, enquiry_type, message, consent } = parsed.data;

  const { error } = await supabase.from("contact_messages").insert({
    full_name,
    company: company || null,
    email,
    phone: phone || null,
    subject: subject || null,
    enquiry_type,
    message,
    consent,
    ip_address: ip,
  });

  if (error) {
    console.error("[contact] insert failed", error);
    return { ok: false as const, error: "Something went wrong. Please try again." };
  }

  const admin = createAdminClient();
  const { data: recipient } = await admin
    .from("company_contacts")
    .select("value")
    .eq("key", "general_email")
    .maybeSingle();
  const notifyTo = recipient?.value;

  await Promise.all([
    sendEmail({ to: email, subject: "We've received your enquiry — Sikamine Gold Trading Ltd", html: acknowledgementEmail(full_name, "enquiry") }),
    notifyTo
      ? sendEmail({
          to: notifyTo,
          subject: `New contact enquiry: ${subject || enquiry_type}`,
          html: internalNotificationEmail("New Contact Enquiry", {
            Name: full_name,
            Company: company,
            Email: email,
            Phone: phone,
            "Enquiry Type": enquiry_type,
            Message: message,
          }),
        })
      : Promise.resolve(),
  ]);

  return { ok: true as const };
}
