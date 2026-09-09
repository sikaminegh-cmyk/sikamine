import { z } from "zod";

export const enquiryTypes = [
  "General Enquiry",
  "Gold Supply",
  "Gold Purchase",
  "Partnership",
  "Off-Take",
  "Compliance",
  "Corporate",
  "Media",
  "Other",
] as const;

export const contactFormSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(200),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  enquiry_type: z.enum(enquiryTypes),
  message: z.string().trim().min(10, "Please add a short message").max(5000),
  consent: z.boolean().refine((v) => v === true, { message: "Please confirm you agree to be contacted" }),
  // honeypot — must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
