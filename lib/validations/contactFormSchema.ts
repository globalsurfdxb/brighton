import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9+\-\s()]{7,20}$/.test(val),
      "Enter a valid phone number"
    ),
  company: z.string().optional(),
  role: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;