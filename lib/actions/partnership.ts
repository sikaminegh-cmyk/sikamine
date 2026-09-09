"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { partnershipFormSchema, type PartnershipFormValues } from "@/lib/validation/partnership";
import { acknowledgementEmail, internalNotificationEmail, sendEmail } from "@/lib/email";

async function getClientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

export async function submitPartnershipForm(values: PartnershipFormValues) {
  const parsed = partnershipFormSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  }
  if (parsed.data.website) {
    return { ok: true as const };
  }

  const ip = await getClientIp();
  const supabase = await createClient();

  const { data: recent } = await supabase
    .from("partnership_enquiries")
    .select("id, created_at")
    .eq("ip_address", ip)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent && Date.now() - new Date(recent.created_at).getTime() < 30_000) {
    return { ok: false as const, error: "Please wait a moment before submitting again." };
  }

  const { full_name, company_name, email, phone, country, partnership_type, message, consent } = parsed.data;

  const { error } = await supabase.from("partnership_enquiries").insert({
    full_name,
    company_name: company_name || null,
    email,
    phone: phone || null,
    country: country || null,
    partnership_type,
    message: message || null,
    consent,
    ip_address: ip,
  });

  if (error) {
    console.error("[partnership] insert failed", error);
    return { ok: false as const, error: "Something went wrong. Please try again." };
  }

  const admin = createAdminClient();
  const { data: recipient } = await admin
    .from("company_contacts")
    .select("value")
    .eq("key", "partnerships_email")
    .maybeSingle();
  const { data: fallback } = await admin
    .from("company_contacts")
    .select("value")
    .eq("key", "general_email")
    .maybeSingle();
  const notifyTo = recipient?.value || fallback?.value;

  await Promise.all([
    sendEmail({ to: email, subject: "We've received your partnership enquiry — Sikamine Gold Trading Ltd", html: acknowledgementEmail(full_name, "partnership enquiry") }),
    notifyTo
      ? sendEmail({
          to: notifyTo,
          subject: `New partnership enquiry: ${partnership_type}`,
          html: internalNotificationEmail("New Partnership Enquiry", {
            Name: full_name,
            Company: company_name,
            Email: email,
            Phone: phone,
            Country: country,
            "Partnership Type": partnership_type,
            Message: message,
          }),
        })
      : Promise.resolve(),
  ]);

  return { ok: true as const };
}
