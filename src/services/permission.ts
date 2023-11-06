import { TransactionBaseService } from "@medusajs/medusa";
import { Permission } from "../models";
import PermissionRepository from "../repositories/permission";
import { ILike } from "typeorm";
import { EventBusService } from "@medusajs/medusa";
import {
  CreatePermissionInput,
  UpdatePermissionInput,
  PermissionResponseAllPermissionsAsOptions,
  PermissionResponseFindPermissions,
  PermissionFindFilter,
} from "../types/permission";

type InjectedDependencies = {
  permissionRepository: typeof PermissionRepository;
  eventBusService: EventBusService;
};

class PermissionService extends TransactionBaseService {
  protected readonly permissionRepository_: typeof PermissionRepository;
  protected readonly eventBus_: EventBusService;

  static readonly Events = {
    UPDATED: "role.updated",
    CREATED: "role.created",
    DELETED: "role.deleted",
  };

  constructor(container: InjectedDependencies) {
    super(container);
    this.permissionRepository_ = container.permissionRepository;
    this.eventBus_ = container.eventBusService;
  }

  async create(data: CreatePermissionInput): Promise<Permission> {
    return this.atomicPhase_(async (manager) => {
      const permissionRepo = manager.withRepository(this.permissionRepository_);
      const permission = permissionRepo.create(data);
      const result = await permissionRepo.save(permission);

      await this.eventBus_
        .withTransaction(manager)
        .emit(PermissionService.Events.CREATED, {
          id: result.id,
        });

      return result;
    });
  }

  async update(
    permissionId: string,
    data: UpdatePermissionInput
  ): Promise<Permission | null> {
    const id = permissionId;
    const name = data.name;
    const metadata = data.metadata;
    return this.atomicPhase_(async (manager) => {
      const permissionRepo = manager.withRepository(this.permissionRepository_);

      const existingPermission = await permissionRepo.findOneBy({ id });

      if (!existingPermission) {
        throw new Error(`Permission with ID ${id} not found.`);
      }

      existingPermission.name = name;
      existingPermission.metadata = metadata;

      const result = await permissionRepo.save(existingPermission);

      await this.eventBus_
        .withTransaction(manager)
        .emit(PermissionService.Events.UPDATED, {
          id: result.id,
          fields: Object.keys(data),
        });

      return result;
    });
  }

  async getAllPermissionsAsOptions(): Promise<PermissionResponseAllPermissionsAsOptions> {
    return this.atomicPhase_(async (manager) => {
      const permissionRepo = manager.withRepository(this.permissionRepository_);
      const permissions = await permissionRepo.find();

      return permissions.map((permission) => ({
        value: permission.id,
        label: permission.name,
      }));
    });
  }

  async findPermissions(
    data: PermissionFindFilter
  ): Promise<PermissionResponseFindPermissions> {
    return this.atomicPhase_(async (manager) => {
      const search = data.search;
      const limit = data.limit;
      const offset = data.offset;

      const permissionRepo = manager.getRepository(Permission);

      const filter: any = {};

      if (search) {
        filter.name = ILike(`%${search}%`);
      }

      const permissions = await permissionRepo.find({
        where: filter,
        take: limit,
        skip: offset,
      });

      return { data: permissions, count: permissions.length };
    });
  }

  async allPermissions(): Promise<Permission[]> {
    return this.atomicPhase_(async (manager) => {
      const permissionRepo = manager.getRepository(Permission);

      const data = await permissionRepo.find({});

      return data;
    });
  }

  async findOne(permissionId: string): Promise<Permission | undefined> {
    return this.atomicPhase_(async (manager) => {
      const permissionRepo = manager.withRepository(this.permissionRepository_);
      return await permissionRepo.findOneBy({ id: permissionId });
    });
  }

  async deletePermissionAndRolePermissions(
    permissionId: string
  ): Promise<void> {
    const id = permissionId;
    await this.atomicPhase_(async (manager) => {
      const permissionRepo = manager.withRepository(this.permissionRepository_);
      await permissionRepo.delete(id);
      await this.eventBus_
      .withTransaction(manager)
      .emit(PermissionService.Events.DELETED, {
        id: permissionId,
      });
      return Promise.resolve();
    });
  }
}

export default PermissionService;
