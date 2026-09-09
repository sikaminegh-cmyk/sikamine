import { z } from "zod";

export const partnershipTypes = [
  "Licensed Miner",
  "Supplier",
  "Buyer",
  "Off-Taker",
  "Institutional Partner",
  "Investor",
  "Strategic Partner",
  "Other",
] as const;

export const partnershipFormSchema = z.object({
  full_name: z.string().trim().min(2, "Please enter your full name").max(200),
  company_name: z.string().trim().max(200).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  country: z.string().trim().max(100).optional().or(z.literal("")),
  partnership_type: z.enum(partnershipTypes),
  message: z.string().trim().max(5000).optional().or(z.literal("")),
  consent: z.boolean().refine((v) => v === true, { message: "Please confirm you agree to be contacted" }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type PartnershipFormValues = z.infer<typeof partnershipFormSchema>;
