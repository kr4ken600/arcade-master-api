import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Arcade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'varchar', length: 100, unique: true})
  businessName: string;

  @Column({ type: 'varchar', length: 50, default: 'free' })
  subscriptionPlan: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.arcade)
  users: User[];
}
