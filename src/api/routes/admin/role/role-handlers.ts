import { Request, Response, NextFunction } from "express";
import RoleService from "../../../../services/role";
import {
  RoleRename,
  RoleFind,
  RoleRemove,
  RoleRemovePermissions,
  RoleCreate,
  RoleAssociateRoleWithUser,
  RoleAssociateRoleWithPermission,
  RoleAddRolePermissions,
} from "../../../../types/role";

const rename = async (req: Request, res: Response) => {
  try {
    const { name, id }: RoleRename = req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;

    const data = await roleService.rename({ id, name });

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const find = async (req: Request, res: Response) => {
  try {
    const { search, role_id }: RoleFind = req.query;

    const roleService = req.scope.resolve("roleService") as RoleService;
    const data = await roleService.find({ role_id, search });

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const findUniqueRoles = async (req: Request, res: Response) => {
  try {
    const roleService = req.scope.resolve("roleService") as RoleService;
    const data = await roleService.findUniqueRoles();

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id }: RoleRemove = req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;

    await roleService.remove({ id });
    res.status(204).end();
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const removePermissions = async (req: Request, res: Response) => {
  try {
    const { role_id, permissions_ids }: RoleRemovePermissions = req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;
    await roleService.removePermissions({
      role_id,
      permissions_ids,
    });

    res.status(204).end();
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { name, store_id }: RoleCreate = req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;

    const data = await roleService.create({ name, store_id });

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const associateRoleWithUser = async (req: Request, res: Response) => {
  try {
    const { id, user_id }: RoleAssociateRoleWithUser = req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;
    const data = await roleService.associateRoleWithUser({ id, user_id });

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const associateRoleWithPermission = async (req: Request, res: Response) => {
  try {
    const { role_id, permissions_ids }: RoleAssociateRoleWithPermission =
      req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;
    const data = await roleService.associateRole({ role_id, permissions_ids });

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const addRolePermissions = async (req: Request, res: Response) => {
  try {
    const { role_id, permissions_ids }: RoleAddRolePermissions = req.body;

    const roleService = req.scope.resolve("roleService") as RoleService;
    const data = await roleService.addRolePermissions({
      role_id,
      permissions_ids,
    });

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

export {
  rename,
  find,
  findUniqueRoles,
  remove,
  removePermissions,
  create,
  associateRoleWithUser,
  associateRoleWithPermission,
  addRolePermissions,
};
