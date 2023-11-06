import { UserService } from "@medusajs/medusa";
import { NextFunction, Request, Response } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.userId) {
    next();
    return;
  }
  const userService = req.scope.resolve("userService") as UserService;
  const loggedInUser = await userService.retrieve(req.user.userId, {
    select: ["id"],
    relations: ["teamRole", "teamRole.permissions"],
  });

  if (!loggedInUser.teamRole) {
    next();
    return;
  }

  const isAllowed = loggedInUser.teamRole?.permissions.some((permission) => {
    const metadataKey = Object.keys(permission.metadata).find(
      (key) => key === req.path
    );
    if (!metadataKey) {
      return false;
    }

    return permission.metadata[metadataKey];
  });

  if (isAllowed) {
    next();
    return;
  }

  res.status(401).send({
    status: 401,
    message: "Access is denied",
  });
};
