import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { isEmailAvailable, verifyLogin } from "~/models/user.server";

export const loginSchema = z.object({
  email: z.string().trim().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().trim().min(8, {
    message:
      "Your password needs to be at least 8 characters. Please enter a longer one.",
  }),
  remember: z.literal("on").optional(),
  redirectTo: z.string().trim().nullish(),
});

export const loginServerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email({
        message: "Please enter a valid email.",
      })
      .superRefine(async (email, ctx) => {
        if (await isEmailAvailable(email)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Sorry, we could not find your account.",
            fatal: true,
          });
          return z.NEVER;
        }
      }),
    password: z.string().trim().min(8, {
      message:
        "Your password needs to be at least 8 characters. Please enter a longer one.",
    }),
    remember: z.literal("on").optional(),
    redirectTo: z.string().trim().nullish(),
  })
  .refine(
    async ({ email, password }) => {
      return await verifyLogin(email, password);
    },
    {
      message: "Wrong password!",
      path: ["password"],
    }
  );

export const loginClientValidator = withZod(loginSchema);
export const loginServerValidator = withZod(loginServerSchema);
