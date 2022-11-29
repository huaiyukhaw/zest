import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const certificationSchema = z
  .object({
    issued: z.string().trim().min(1, {
      message: "Issued year is required",
    }),
    expires: z.string().trim().min(1, {
      message: "Expiry year field is required",
    }),
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    organization: z.string().trim().min(1, {
      message: "Organization is required",
    }),
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
    ({ issued, expires }) => {
      const isAfterOrEqual =
        parseInt(issued) <= parseInt(expires) ||
        expires === "Now" ||
        expires === "Ongoing" ||
        expires === "Does not expire";
      return isAfterOrEqual;
    },
    ({ issued }) => ({
      message: `Must be after or equal to ${issued}`,
      path: ["expires"],
    })
  );

export const certificationValidator = withZod(certificationSchema);
