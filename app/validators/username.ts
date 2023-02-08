import { z } from "zod";

export const usernameSchema = z
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
    message: "Include a non-number character.",
  })
  .regex(/^[a-z0-9_]*$/, {
    message: "Your username can only contain letters, numbers and '_'",
  })
  .regex(
    /^(?!(?:app|post|tag|login|api|join|login|logout|healthcheck|index)$).*$/,
    {
      message: "That username is not available.",
    }
  );
