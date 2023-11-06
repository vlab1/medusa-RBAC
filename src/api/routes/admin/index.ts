import { Router } from "express";
import { wrapHandler } from "@medusajs/medusa";
import onboardingRoutes from "./onboarding";
import customRouteHandler from "./custom-route-handler";
import roleRouter from "./role";
import permissionRouter from "./permission";


// Initialize a custom router
const router = Router();

export function attachAdminRoutes(adminRouter: Router) {
  roleRouter(adminRouter);
  permissionRouter(adminRouter);
  // Attach our router to a custom path on the admin router
  adminRouter.use("/custom", router);

  // Define a GET endpoint on the root route of our custom path
  router.get("/", wrapHandler(customRouteHandler));

  // Attach routes for onboarding experience, defined separately
  onboardingRoutes(adminRouter);
}
