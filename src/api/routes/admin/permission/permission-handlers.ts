import { Request, Response } from "express";
import PermissionService from "../../../../services/permission";

import {
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionFindFilter,
  PermissionResponseOptions,
  PermissionResponseAllPermissionsAsOptions,
  PermissionResponseFindPermissions,
} from "../../../../types/permission";

const findAllPermissionsAsOptions = async (req: Request, res: Response) => {
  try {
    const permissionService = req.scope.resolve(
      "permissionService"
    ) as PermissionService;
    const data = await permissionService.getAllPermissionsAsOptions();

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const findPermissions = async (req: Request, res: Response) => {
  try {
    const { search, limit, offset }: PermissionFindFilter = req.query;

    const permissionService = req.scope.resolve(
      "permissionService"
    ) as PermissionService;

    const data = await permissionService.findPermissions({
      search,
      limit,
      offset,
    });

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const allPermissions = async (req: Request, res: Response) => {
  try {
    const permissionService = req.scope.resolve(
      "permissionService"
    ) as PermissionService;

    const data = await permissionService.allPermissions();

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const deletePermissionAndRolePermissions = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.body;

    const permissionService = req.scope.resolve(
      "permissionService"
    ) as PermissionService;

    const data = await permissionService.deletePermissionAndRolePermissions(id);

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
    const { name, metadata }: CreatePermissionInput = req.body;

    const permissionService = req.scope.resolve(
      "permissionService"
    ) as PermissionService;

    const data = await permissionService.create({ name, metadata });

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id, name, metadata } = req.body;

    const permissionService = req.scope.resolve(
      "permissionService"
    ) as PermissionService;

    const data = await permissionService.update(id, { name, metadata });

    res.status(201).json({ data });
  } catch (error: any) {
    res.status(400).send({
      status: 400,
      message: error.message,
    });
  }
};

export {
  findAllPermissionsAsOptions,
  findPermissions,
  allPermissions,
  deletePermissionAndRolePermissions,
  create,
  update,
};
