import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  tags: z
    .union([
      z
        .string()
        .trim()
        .array()
        .transform((val) => (val.length == 0 ? null : val)),
      z
        .string()
        .trim()
        .transform((val) => (val.length == 0 ? null : val.split(","))),
    ])

    .nullable(),
  content: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  awardId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  certificationId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  educationId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  exhibitionId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  featureId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  projectId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  sideProjectId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  speakingId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  volunteeringId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  workExperienceId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  writingId: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? undefined : val))
    .optional(),
  by: z
    .string()
    .trim()
    .transform((val) => (val.length == 0 ? null : val))
    .nullable(),
  published: z.string().transform((val) => (val == "true" ? true : false)),
});

export const postValidator = withZod(postSchema);
