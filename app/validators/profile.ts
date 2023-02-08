import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isUsernameAvailable } from "~/models/profile.server";
import { usernameSchema } from "~/validators/username";

export const profileSchema = z.object({
  username: usernameSchema,
  displayName: z
    .string({
      invalid_type_error: "Your display name can only be text.",
      required_error: "Display name is required.",
    })
    .trim()
    .min(1, {
      message: "Display name is required.",
    })
    .max(50, {
      message: "Your display name must be shorter than 50 characters.",
    }),
});

export const profileClientValidator = withZod(profileSchema);

export const profileServerValidator = withZod(
  profileSchema.refine(
    async ({ username }) => {
      const usernameAvailable = await isUsernameAvailable(username);
      return usernameAvailable;
    },
    {
      message: "That username has been taken. Please choose another.",
      path: ["username"],
    }
  )
);
