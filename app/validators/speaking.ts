import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const speakingSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Talk title is required",
  }),
  year: z.string().trim().min(1, {
    message: "Year is required",
  }),
  event: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  location: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  url: z.union([
    z.string().trim().url({ message: "Url is not valid" }),
    z
      .string()
      .length(0)
      .transform((val) => (val.length == 0 ? null : val))
      .nullable(),
  ]),
  description: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  published: z.string().transform((val) => (val == "true" ? true : false)),
});

export const speakingValidator = withZod(speakingSchema);
