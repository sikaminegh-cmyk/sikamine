"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { partnershipFormSchema, partnershipTypes, type PartnershipFormValues } from "@/lib/validation/partnership";
import { submitPartnershipForm } from "@/lib/actions/partnership";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-text placeholder:text-text-grey/60 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/10";
const labelClass = "mb-1.5 block text-sm font-medium text-text";
const errorClass = "mt-1 text-xs text-red-600";

export function PartnershipForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipFormSchema),
    defaultValues: { partnership_type: "Licensed Miner" },
  });

  const onSubmit = async (values: PartnershipFormValues) => {
    setStatus("submitting");
    setServerError(null);
    const result = await submitPartnershipForm(values);
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
        <h3 className="mt-4 font-heading text-xl font-bold">Enquiry received</h3>
        <p className="mt-2 text-sm opacity-70">Thank you for your interest in partnering with Sikamine. Our team will be in touch.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-8 shadow-sm" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="p_full_name">Full Name *</label>
          <input id="p_full_name" className={inputClass} {...register("full_name")} />
          {errors.full_name && <p className={errorClass}>{errors.full_name.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="p_company_name">Company Name</label>
          <input id="p_company_name" className={inputClass} {...register("company_name")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p_email">Email *</label>
          <input id="p_email" type="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="p_phone">Phone</label>
          <input id="p_phone" className={inputClass} {...register("phone")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p_country">Country</label>
          <input id="p_country" className={inputClass} {...register("country")} />
        </div>
        <div>
          <label className={labelClass} htmlFor="p_partnership_type">Partnership Type *</label>
          <select id="p_partnership_type" className={inputClass} {...register("partnership_type")}>
            {partnershipTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className={labelClass} htmlFor="p_message">Message</label>
        <textarea id="p_message" rows={5} className={inputClass} {...register("message")} />
      </div>

      {/* honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("website")} />

      <div className="mt-5 flex items-start gap-3">
        <input id="p_consent" type="checkbox" className="mt-1 h-4 w-4 rounded border-black/20" {...register("consent")} />
        <label htmlFor="p_consent" className="text-sm opacity-80">
          I consent to Sikamine Gold Trading Ltd contacting me regarding this enquiry. *
        </label>
      </div>
      {errors.consent && <p className={errorClass}>{errors.consent.message}</p>}

      {serverError && <p className="mt-4 text-sm text-red-600">{serverError}</p>}

      <Button type="submit" disabled={status === "submitting"} className="mt-6 w-full sm:w-auto">
        {status === "submitting" ? "Submitting…" : "Submit Enquiry"}
      </Button>
    </form>
  );
}
