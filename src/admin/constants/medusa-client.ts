import Medusa from "@medusajs/medusa-js";
import { MEDUSA_BACKEND_URL } from "./medusa-backend-url";

export const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
});
