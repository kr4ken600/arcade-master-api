import { Game } from 'src/games/entities/game.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from 'src/sessions/entities/session.entity';

@Entity()
export class Arcade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
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

  @OneToMany(() => Game, (game) => game.arcade)
  games: Game[];

  @OneToMany(() => Session, (session) => session.arcade)
  sessions: Session[];
}
