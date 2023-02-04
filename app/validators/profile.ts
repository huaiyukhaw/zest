import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isUsernameAvailable } from "~/models/profile.server";

export const usernameSchema = z
  .string({
    invalid_type_error:
      "Your username can only contain letters, numbers and '_'",
    required_error: "Username is required",
  })
  .trim()
  .min(4, {
    message: "Your username must be longer than 3 characters.",
  })
  .max(15, {
    message: "Your username must be shorter than 15 characters.",
  })
  .regex(/[a-z_]/, {
    message: "Include a non-number character.",
  })
  .regex(/^[a-z0-9_]*$/, {
    message: "Your username can only contain letters, numbers and '_'",
  })
  .regex(
    /^(?!(?:app|posts|login|api|join|login|logout|healthcheck|index)$).*$/,
    {
      message: "That username is not available.",
    }
  );

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
