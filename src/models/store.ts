import { Entity, JoinColumn, OneToMany } from "typeorm";
import {
  Store as MedusaStore,
} from "@medusajs/medusa";
import { Role } from "./role";

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => Role, (role) => role.store)
  @JoinColumn({ name: "id", referencedColumnName: "store_id" })
  roles: Role[];
}
