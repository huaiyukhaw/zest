import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const educationSchema = z
  .object({
    from: z.string().trim().min(1, {
      message: "From field is required",
    }),
    to: z.string().trim().min(1, {
      message: "To field is required",
    }),
    degree: z.string().trim().min(1, {
      message: "Degree or certification is required",
    }),
    school: z.string().trim().min(1, {
      message: "School or institution is required",
    }),
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
  })
  .refine(
    ({ from, to }) => {
      const isAfterOrEqual = parseInt(from) <= parseInt(to) || !parseInt(to);
      return isAfterOrEqual;
    },
    ({ from }) => ({
      message: `Must be after or equal to ${from}`,
      path: ["to"],
    })
  );

export const educationValidator = withZod(educationSchema);
