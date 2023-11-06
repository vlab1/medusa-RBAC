import { Permission } from "../models";

export type RoleRename = {
  id: string;
  name: string;
};

export type RoleFind = {
  search?: string;
  role_id?: string;
};

export type RoleRemove = {
  id: string;
};

export type PermissionsIds = {
  id: string;
};

export type RoleRemovePermissions = {
  role_id: string;
  permissions_ids: PermissionsIds[];
};

export type RoleCreate = {
  name: string;
  store_id: string;
};

export type RoleAssociateRoleWithUser = {
  id?: string | null;
  user_id: string;
};

export type RoleAssociateRoleWithPermission = {
  role_id: string;
  permissions_ids: PermissionsIds[];
};

export type RoleAddRolePermissions = {
  role_id: string;
  permissions_ids: PermissionsIds[];
};

export type RoleRetrieve = {
  id: string;
};

export type RoleFindResponse = {
  count: number;
  data: Permission[];
};
