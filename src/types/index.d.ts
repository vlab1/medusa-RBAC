import { Role } from "../models";

export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    role_id: string | null;
    teamRole: Role | null;
  }

  declare interface Store {
    roles: Role[];
  }
}

