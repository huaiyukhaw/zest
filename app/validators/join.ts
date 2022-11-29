import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isEmailAvailable } from "~/models/user.server";

export const joinSchema = z.object({
  email: z.string().trim().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().trim().min(8, {
    message:
      "Your password needs to be at least 8 characters. Please enter a longer one.",
  }),
  redirectTo: z.string().trim().nullish(),
});

export const joinClientValidator = withZod(
  joinSchema.refine(
    async ({ email }) => {
      const { emailTaken } = await (
        await fetch(`/api/email-exists?email=${email}`)
      ).json();
      return !emailTaken;
    },
    { message: "Email has already been taken.", path: ["email"] }
  )
);

export const joinServerValidator = withZod(
  joinSchema.refine(
    async ({ email }) => {
      return await isEmailAvailable(email);
    },
    { message: "Email has already been taken.", path: ["email"] }
  )
);
