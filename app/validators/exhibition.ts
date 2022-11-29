import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const exhibitionSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Exhibition title is required",
  }),
  year: z.string().trim().min(1, {
    message: "Year is required",
  }),
  venue: z
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

export const exhibitionValidator = withZod(exhibitionSchema);
