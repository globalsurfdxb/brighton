import { z } from "zod";

export const catalogueFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  role: z.string().optional(),
});

export type CatalogueFormValues = z.infer<typeof catalogueFormSchema>;