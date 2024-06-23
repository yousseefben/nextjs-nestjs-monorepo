import { z } from "zod";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES: string[] = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type LoginFormType = z.infer<typeof loginSchema>;
