import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "min 8" })
      .max(25, { message: "max 25" }),
    lastName: z
      .string()
      .min(2, { message: "min 8" })
      .max(25, { message: "max 25" }),

    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password is too short" })
      .max(50, { message: "Password is too long" })
      .regex(/\d/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    photos: z
      .any()
      .refine(
        (files) => {
          return files.length >= 4;
        },
        {
          message: "At least 4 files are required.",
        }
      )
      .refine(
        (files: FileList) =>
          Array.from(files).every((file: File) => file.size <= MAX_FILE_SIZE),
        {
          message: `Each file must be at most 5MB.`,
        }
      )
      .refine(
        (files: FileList) =>
          Array.from(files).every((file: File) =>
            ACCEPTED_IMAGE_TYPES.includes(file.type)
          ),
        {
          message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormType = z.infer<typeof registerSchema>;
