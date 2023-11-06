import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import {
  findPermissions,
  findAllPermissionsAsOptions,
  allPermissions,
  deletePermissionAndRolePermissions,
  create,
  update,
} from "./permission-handlers";
import validationMiddleware from "../../../middlewares/validation";
import validate from "./permission-validation";

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/permissions", router);

  router.get("/options", wrapHandler(findAllPermissionsAsOptions));
  router.get(
    "/find",
    validationMiddleware(validate.findFilter),
    wrapHandler(findPermissions)
  );
  router.get("/", wrapHandler(allPermissions));
  router.delete("/remove", wrapHandler(deletePermissionAndRolePermissions));
  router.post(
    "/create",
    validationMiddleware(validate.create),
    wrapHandler(create)
  );
  router.put(
    "/update",
    validationMiddleware(validate.update),
    wrapHandler(update)
  );
};
