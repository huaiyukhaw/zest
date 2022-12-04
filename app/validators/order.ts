import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const orderSchema = z.object({
  items: z.preprocess(
    (val) => JSON.parse(String(val)),
    z.array(
      z.object({
        id: z.string(),
        order: z.number(),
      })
    )
  ),
});

export const orderValidator = withZod(orderSchema);
