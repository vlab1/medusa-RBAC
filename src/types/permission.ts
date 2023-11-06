import { Permission } from "../models";

export type CreatePermissionInput = Pick<Permission, "name" | "metadata">;
export type UpdatePermissionInput = Pick<Permission, "name" | "metadata">;

export type PermissionFindFilter = {
  search?: string;
  limit?: number;
  offset?: number;
}

export type PermissionResponseOptions = {
  value: string;
  label: string;
}

export type PermissionResponseAllPermissionsAsOptions =
  PermissionResponseOptions[];

export type PermissionResponseFindPermissions = {
  data: Permission[];
  count: number;
}

