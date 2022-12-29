import { withZod } from "@remix-validated-form/with-zod";
import invariant from "tiny-invariant";
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
  joinSchema
    .extend({
      cfTurnstileResponse: z.string().optional(),
    })
    .refine(
      async ({ cfTurnstileResponse }) => {
        invariant(
          process.env.CLOUDFLARE_TURNSTILE_SECRET,
          "CLOUDFLARE_TURNSTILE_SECRET must be set"
        );
        if (cfTurnstileResponse) {
          const body = `secret=${encodeURIComponent(
            process.env.CLOUDFLARE_TURNSTILE_SECRET
          )}&response=${encodeURIComponent(cfTurnstileResponse)}`;

          const res = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
              method: "POST",
              body,
              headers: {
                "content-type": "application/x-www-form-urlencoded",
              },
            }
          );

          const data = await res.json();
          return data.success ?? false;
        }

        return false;
      },
      {
        message:
          "Sorry, Cloudflare Turnstile has detected you as a bot and restricted access. Please contact the administrator via email in case you are not a bot - huaiyukhaw@gmail.com",
        path: ["cf-turnstile-response"],
      }
    )
    .refine(
      async ({ email }) => {
        return await isEmailAvailable(email);
      },
      { message: "Email has already been taken.", path: ["email"] }
    )
);
