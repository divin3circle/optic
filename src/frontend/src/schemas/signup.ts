import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().min(2, "Username required"),
  country: z.string().min(1, "Country required"),
  profileImage: z.string().url("Must be a valid URL"),
  phoneNumber: z.string().min(9, "Phone number must be 9 digits"),
});

export type SignupSchema = z.infer<typeof signupSchema>;
