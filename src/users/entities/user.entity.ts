import { Exclude } from 'class-transformer';
import { Arcade } from '../../arcades/entities/arcade.entity';
import { Role } from 'src/constants/role.enum';
import { Session } from 'src/sessions/entities/session.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.PLAYER,
  })
  role: Role;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @ManyToOne(() => Arcade, (arcade) => arcade.users)
  @JoinColumn({ name: 'arcadeId' })
  arcade: Arcade;

  @Column({ nullable: true })
  arcadeId: number;
}
