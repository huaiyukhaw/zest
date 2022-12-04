import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isUsernameAvailable } from "~/models/profile.server";

export const profileSchema = z.object({
  username: z
    .string({
      invalid_type_error:
        "Your username can only contain letters, numbers and '_'",
      required_error: "Username is required",
    })
    .min(4, {
      message: "Your username must be longer than 4 characters.",
    })
    .max(15, {
      message: "Your username must be shorter than 15 characters.",
    })
    .regex(/[a-z_]/, {
      message: "Include a non-number character",
    })
    .regex(/^[a-z0-9_]*$/, {
      message: "Your username can only contain letters, numbers and '_'",
    }),
  displayName: z
    .string({
      invalid_type_error: "Your display name can only be text.",
      required_error: "Display name is required.",
    })
    .min(1, {
      message: "Your display name must be longer than 1 character.",
    })
    .max(50, {
      message: "Your display name must be shorter than 50 characters.",
    }),
});

// export const profileClientValidator = withZod(
//   profileSchema.refine(
//     async ({ username }) => {
//       const { usernameTaken } = await (
//         await fetch(`/api/username-exists?username=${username}`)
//       ).json();
//       return !usernameTaken;
//     },
//     {
//       message: "That username has been taken. Please choose another.",
//       path: ["username"],
//     }
//   )
// );

export const profileClientValidator = withZod(profileSchema);

export const profileServerValidator = withZod(
  profileSchema.refine(
    async ({ username }) => {
      const usernameAvailable = await isUsernameAvailable(username);
      console.log("usernameAvailable:", usernameAvailable);
      return usernameAvailable;
    },
    {
      message: "That username has been taken. Please choose another.",
      path: ["username"],
    }
  )
);
