import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { DbAwareColumn, generateEntityId } from "@medusajs/medusa/dist/utils";
import { Role } from "./role";

@Entity()
export class Permission extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, boolean>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "perm");
  }

  @OneToMany(() => Role, (role) => role.permissions, { onDelete: "CASCADE" }) 
  roles: Role[];
}
