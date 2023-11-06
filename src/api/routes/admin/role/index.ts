import { wrapHandler } from "@medusajs/utils";
import { Router } from "express";
import {
  associateRoleWithUser,
  findUniqueRoles,
  rename,
  remove,
  create,
  associateRoleWithPermission,
  find,
  removePermissions,
  addRolePermissions,
} from "./role-handlers";
import validationMiddleware from "../../../middlewares/validation";
import validate from "./role-validation";

const router = Router();

export default (adminRouter: Router) => {
  adminRouter.use("/roles", router);

  router.post("/create", validationMiddleware(validate.create), wrapHandler(create));
  router.post(
    "/associate-permissions",
    validationMiddleware(validate.associateRoleWithPermission),
    wrapHandler(associateRoleWithPermission)
  );
  router.post(
    "/users",
    validationMiddleware(validate.associateRoleWithUser),
    wrapHandler(associateRoleWithUser)
  );
  router.put("/rename", validationMiddleware(validate.rename), wrapHandler(rename));
  router.post(
    "/add-permissions",
    validationMiddleware(validate.addRolePermissions),
    wrapHandler(addRolePermissions)
  );
  router.get("/unique-roles", wrapHandler(findUniqueRoles));
  router.get("/search", validationMiddleware(validate.find), wrapHandler(find));
  router.delete(
    "/",
    validationMiddleware(validate.remove),
    wrapHandler(remove)
  );
  router.delete(
    "/permissions",
    validationMiddleware(validate.removePermissions),
    wrapHandler(removePermissions)
  );
};
