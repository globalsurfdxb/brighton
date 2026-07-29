import { z } from "zod";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const careerApplicationFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  secondName: z.string().min(1, "Second name is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone number"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  currentLocation: z.string().min(1, "Current location is required"),
  cv: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "CV is required")
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      "File must be under 5MB",
    )
    .refine(
      (files) => ACCEPTED_TYPES.includes(files?.[0]?.type),
      "Only PDF or DOC files are allowed",
    ),
  message: z.string().optional(),
});

export type CareerApplicationFormValues = z.infer<
  typeof careerApplicationFormSchema
>;
