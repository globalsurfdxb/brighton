import { z } from "zod";

export const letsConnectFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  secondName: z.string().min(1, "Second name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  contactNo: z
    .string()
    .min(1, "Contact number is required")
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid contact number"),
  message: z.string().min(1, "Message is required"),
});

export type LetsConnectFormValues = z.infer<typeof letsConnectFormSchema>;
