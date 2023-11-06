import { TransactionBaseService } from "@medusajs/medusa";
import { Role } from "../models";
import RoleRepository from "../repositories/role";
import PermissionService from "./permission";
import UserService from "./user";
import { User } from "@medusajs/medusa";
import { ILike, In } from "typeorm";
import PermissionRepository from "../repositories/permission";
import {
  RoleRename,
  RoleFind,
  RoleRemove,
  RoleRemovePermissions,
  RoleCreate,
  RoleAssociateRoleWithUser,
  RoleAssociateRoleWithPermission,
  RoleAddRolePermissions,
  RoleRetrieve,
  RoleFindResponse,
} from "../types/role";
import { EventBusService } from "@medusajs/medusa";

type InjectedDependencies = {
  roleRepository: typeof RoleRepository;
  permissionService: PermissionService;
  userService: UserService;
  permissionRepository: typeof PermissionRepository;
  eventBusService: EventBusService;
};

class RoleService extends TransactionBaseService {
  protected readonly roleRpository_: typeof RoleRepository;
  protected readonly permissionRpository_: typeof PermissionRepository;
  protected readonly permissionService_: PermissionService;
  protected readonly userService_: UserService;
  protected readonly eventBus_: EventBusService;

  static readonly Events = {
    UPDATED: "role.updated",
    CREATED: "role.created",
    DELETED: "role.deleted",
  };

  constructor(container: InjectedDependencies) {
    super(container);
    this.permissionRpository_ = container.permissionRepository;
    this.roleRpository_ = container.roleRepository;
    this.permissionService_ = container.permissionService;
    this.userService_ = container.userService;
    this.eventBus_ = container.eventBusService;
  }

  async retrieve(inputData: RoleRetrieve): Promise<Role> {
    try {
      const id = inputData.id;
      const roleRepo = this.manager_.withRepository(this.roleRpository_);

      return await roleRepo.findOne({
        where: {
          id,
        },
        relations: ["permissions", "store", "users"],
      });
    } catch (error) {
      throw new Error(`Error in retrieve: ${error.message}`);
    }
  }

  async create(inputData: RoleCreate): Promise<Role> {
    try {
      const name = inputData.name;
      const store_id = inputData.store_id;

      return this.atomicPhase_(async (manager) => {
        const roleRepo = manager.withRepository(this.roleRpository_);

        const role = roleRepo.create({
          name,
          store_id,
        });

        const savedRole = await roleRepo.save(role);
        await this.eventBus_
          .withTransaction(manager)
          .emit(RoleService.Events.CREATED, {
            id: savedRole.id,
          });
        return await this.retrieve({ id: savedRole.id });
      });
    } catch (error) {
      throw new Error(`Error in create: ${error.message}`);
    }
  }

  async associateRoleWithUser(
    inputData: RoleAssociateRoleWithUser
  ): Promise<Role> {
    try {
      const user_id = inputData.user_id;
      const role_id = inputData.id;

      return this.atomicPhase_(async (manager) => {
        await this.userService_.update(user_id, {
          role_id,
        });

        await this.eventBus_
          .withTransaction(manager)
          .emit(RoleService.Events.UPDATED, {
            id: inputData.user_id,
            fields: ["role_id"],
          });

        return await this.retrieve({ id: role_id });
      });
    } catch (error) {
      throw new Error(`Error in associateRoleWithUser: ${error.message}`);
    }
  }

  async findUniqueRoles(): Promise<Role[]> {
    try {
      const roleRepo = this.manager_.withRepository(this.roleRpository_);

      return await roleRepo
        .createQueryBuilder("role")
        .groupBy("role.name, role.id")
        .getMany();
    } catch (error) {
      throw new Error(`Error in findUniqueRoles: ${error.message}`);
    }
  }

  async rename(inputData: RoleRename): Promise<Role> {
    try {
      const id = inputData.id;
      const name = inputData.name;

      return this.atomicPhase_(async (manager) => {
        const roleRepo = manager.withRepository(this.roleRpository_);
        const role = await roleRepo.findOne({
          where: {
            id,
          },
        });

        if (!role) {
          throw new Error(`Role with id ${id} not found`);
        }

        role.name = name;

        await this.eventBus_
          .withTransaction(manager)
          .emit(RoleService.Events.UPDATED, {
            id: inputData.id,
            fields: ["name"],
          });

        return await roleRepo.save(role);
      });
    } catch (error) {
      throw new Error(`Error in rename: ${error.message}`);
    }
  }

  async remove(inputData: RoleRemove): Promise<void> {
    try {
      const id = inputData.id;
      return this.atomicPhase_(async (manager) => {
        const roleRepo = manager.withRepository(this.roleRpository_);
        const role = await roleRepo.findOne({
          where: {
            id,
          },
          relations: ["permissions", "users"],
        });

        if (!role) {
          throw new Error(`Role with id ${id} not found`);
        }

        const userRepository = manager.getRepository(User);
        for (const user of role.users) {
          user.role_id = null;
          await userRepository.save(user);
        }

        if (role.permissions.length > 0) {
          const queryBuilder = manager.createQueryBuilder();
          await queryBuilder
            .delete()
            .from("role_permissions")
            .where("role_id = :role_id", { role_id: role.id })
            .execute();
        }

        await roleRepo.remove(role);

        await this.eventBus_
          .withTransaction(manager)
          .emit(RoleService.Events.DELETED, {
            id: inputData.id,
          });
        return Promise.resolve();
      });
    } catch (error) {
      throw new Error(`Error in remove: ${error.message}`);
    }
  }

  async associateRole(
    inputData: RoleAssociateRoleWithPermission
  ): Promise<Role> {
    try {
      const role_id = inputData.role_id;
      const permissions_ids = inputData.permissions_ids;
      return await this.atomicPhase_(async (manager) => {
        const roleRepo = manager.withRepository(this.roleRpository_);

        const role = await roleRepo.findOne({
          where: { id: role_id },
          relations: ["permissions"],
        });

        if (!role) {
          throw new Error(`Role with id ${role_id} not found`);
        }

        role.permissions = [];

        for (const permission_id of permissions_ids) {
          const permission = await this.permissionService_.findOne(
            permission_id.id
          );

          if (!permission) {
            throw new Error(`Permission with id ${permission_id} not found`);
          }

          role.permissions.push(permission);
        }

        return await roleRepo.save(role);
      });
    } catch (error) {
      throw new Error(`Error in associateRole: ${error.message}`);
    }
  }

  async find(inputData: RoleFind): Promise<RoleFindResponse> {
    try {
      const role_id = inputData.role_id;
      const search = inputData.search;
      return await this.atomicPhase_(async (manager) => {
        const roleRepo = manager.withRepository(this.roleRpository_);
        const role = await roleRepo.findOne({
          where: { id: role_id },
          relations: ["permissions"],
        });

        if (!role) {
          throw new Error("Role not found");
        }

        const permissionIds = role.permissions.map(
          (permission) => permission.id
        );

        const permissionRepo = manager.withRepository(
          this.permissionRpository_
        );

        const filter: any = {
          id: In(permissionIds),
        };

        if (search) {
          filter.name = ILike(`%${search}%`);
        }

        const find = await permissionRepo.find({
          where: filter,
        });
        return { data: find, count: find.length };
      });
    } catch (error) {
      throw new Error(`Error in find: ${error.message}`);
    }
  }

  async removePermissions(inputData: RoleRemovePermissions): Promise<void> {
    try {
      const role_id = inputData.role_id;
      const permissions_ids = inputData.permissions_ids;
      const permissionIds = permissions_ids.map((permission) => permission.id);
      return await this.atomicPhase_(async (manager) => {
        const queryBuilder = manager.createQueryBuilder();
        await queryBuilder
          .delete()
          .from("role_permissions")
          .where(
            "role_id = :role_id AND permission_id IN (:...permissionIds)",
            {
              role_id: role_id,
              permissionIds: permissionIds,
            }
          )
          .execute();
      });
    } catch (error) {
      throw new Error(`Error in removePermissions: ${error.message}`);
    }
  }

  async addRolePermissions(inputData: RoleAddRolePermissions): Promise<void> {
    try {
      const role_id = inputData.role_id;
      const permission_ids = inputData.permissions_ids;

      const permissionIds = permission_ids.map((permission) => permission.id);

      return await this.atomicPhase_(async (manager) => {
        const queryBuilder = manager.createQueryBuilder();
        await queryBuilder
          .insert()
          .into("role_permissions")
          .values(
            permissionIds.map((permissionId) => ({
              role_id,
              permission_id: permissionId,
            }))
          )
          .onConflict(`("role_id", "permission_id") DO NOTHING`)
          .execute();
      });
    } catch (error) {
      throw new Error(`Error in addRolePermissions: ${error.message}`);
    }
  }
}

export default RoleService;
