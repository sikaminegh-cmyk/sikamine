"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { contactFormSchema, enquiryTypes, type ContactFormValues } from "@/lib/validation/contact";
import { submitContactForm } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-text placeholder:text-text-grey/60 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10";
const labelClass = "mb-1.5 block text-sm font-medium text-text";
const errorClass = "mt-1 text-xs text-red-600";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { enquiry_type: "General Enquiry" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("submitting");
    setServerError(null);
    const result = await submitContactForm(values);
    if (result.ok) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setServerError(result.error ?? "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-white p-10 text-center shadow-sm">
        <CheckCircle2 size={40} className="text-orange" />
        <h3 className="mt-4 font-heading text-xl font-bold">Message sent</h3>
        <p className="mt-2 text-sm opacity-70">Thank you for reaching out. Our team will respond shortly.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-sm" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="full_name">Full Name *</label>
          <input id="full_name" className={inputClass} {...register("full_name")} />
          {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="company">Company</label>
          <input id="company" className={inputClass} {...register("company")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email *</label>
          <input id="email" type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">Phone</label>
          <input id="phone" className={inputClass} {...register("phone")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="subject">Subject</label>
          <input id="subject" className={inputClass} {...register("subject")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="enquiry_type">Enquiry Type *</label>
          <select id="enquiry_type" className={inputClass} {...register("enquiry_type")}>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="message">Message *</label>
        <textarea id="message" rows={5} className={inputClass} {...register("message")} />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {/* honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

      <div className="mt-5 flex items-start gap-3">
        <input id="consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-black/20" {...register("consent")} />
        <label htmlFor="consent" className="text-sm opacity-80">
          I consent to Sikamine Gold Trading Ltd contacting me regarding this enquiry. *
        </label>
      </div>
      {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

      {serverError && <p className="mt-4 text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={status === "submitting"} className="mt-6 w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
