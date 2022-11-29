import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const linkSchema = z.object({
  name: z.string().trim().min(1, {
    message: "Name is required",
  }),
  username: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  url: z.string().trim().url({ message: "Url is not valid" }),
  published: z.string().transform((val) => (val == "true" ? true : false)),
});

export const linkValidator = withZod(linkSchema);
