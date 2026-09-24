// lib/validation/lead.ts — shared zod schema (client + server)
import { z } from "zod";
import { isFreeDomain } from "./free-domains";

export const leadSchema = z.object({
  firstName: z.string().trim().min(1,"Please enter your name.").max(50).regex(/^[a-zA-Z .'-]+$/,"Name can only contain letters, spaces, and . ' -"),
  contactNo: z.string().trim().min(1,"Please enter your contact number.").max(20),
  email: z.string().trim()
    .min(1,"Please enter your work email.")
    .email("That doesn't look like a valid email address.")
    .refine((v) => !isFreeDomain(v),"Please use your work email — personal addresses like @gmail.com aren't accepted."),
  solutionRequired: z.string().min(1,"Please select your solution."),
  noOfDocuments: z.string().min(1,"Please select number of documents."),
  painPoint: z.string().trim().max(1000).optional(),
  // spam fields
  company_website: z.string().optional(),
  startedAt: z.number().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
