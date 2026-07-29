import { z } from "zod";

export const homeEnquiryFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),

  lastName: z.string().min(2, "Last name is required"),

  company: z.string().min(1, "Company name is required"),

  email: z.string().trim().min(1, "Email is required").email("Invalid email"),

  subject: z.string().min(1, "Please select a subject"),

  message: z.string().min(1, "Message is required"),
});

export type HomeEnquiryFormValues = z.infer<typeof homeEnquiryFormSchema>;
