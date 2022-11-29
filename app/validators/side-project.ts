import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const sideProjectSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Project title is required",
  }),
  year: z.string().trim().min(1, {
    message: "Year is required",
  }),
  company: z
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

export const sideProjectValidator = withZod(sideProjectSchema);
