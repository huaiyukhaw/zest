import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isUsernameAvailable } from "~/models/profile.server";

export const generalSchema = z.object({
  username: z
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
      message: "Include a non-number character",
    })
    .regex(/^[a-z0-9_]*$/, {
      message:
        "Your username can only contain lowercase letters, numbers and '_'",
    }),
  currentUsername: z.string(),
  displayName: z
    .string({
      invalid_type_error: "Your display name can only be text.",
      required_error: "Display name is required.",
    })
    .trim()
    .min(1, {
      message: "Display name is required.",
    })
    .max(48, {
      message: "Your display name must be shorter than 48 characters.",
    }),
  jobTitle: z
    .string()
    .trim()
    .max(24, {
      message: "Your display name must be shorter than 24 characters.",
    })
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  location: z
    .string()
    .trim()
    .max(24, {
      message: "Your location must be shorter than 24 characters.",
    })
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  pronouns: z
    .string()
    .trim()
    .max(12, {
      message: "Your pronouns must be shorter than 12 characters.",
    })
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  website: z.union([
    z
      .string()
      .trim()
      .max(96, {
        message: "Your website url must be shorter than 96 characters.",
      })
      .url({ message: "Url is not valid" }),
    z
      .string()
      .length(0)
      .transform((val) => (val.length == 0 ? null : val))
      .nullable(),
  ]),
  bio: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
});

export const generalClientValidator = withZod(generalSchema);
export const generalServerValidator = withZod(
  generalSchema.refine(
    async ({ username, currentUsername }) => {
      if (username === currentUsername) {
        return true;
      }
      const usernameAvailable = await isUsernameAvailable(username);
      return usernameAvailable;
    },
    {
      message: "That username has been taken. Please choose another.",
      path: ["username"],
    }
  )
);

export const avatarSchema = z.object({
  avatar: z.preprocess(
    (val) => JSON.parse(String(val)) ?? null,
    z
      .object({
        id: z.string().trim(),
        url: z.string().trim().url({ message: "Url is not valid" }),
      })
      .nullable()
  ),
});

export const avatarValidator = withZod(avatarSchema);
