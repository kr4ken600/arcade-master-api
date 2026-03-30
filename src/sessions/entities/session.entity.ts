import { Arcade } from 'src/arcades/entities/arcade.entity';
import { Game } from 'src/games/entities/game.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  controllerUsed: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => Game, (game) => game.sessions, { onDelete: 'CASCADE' })
  game: Game;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Arcade, (arcade) => arcade.sessions, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'arcadeId' })
  arcade: Arcade;

  @Column({ nullable: true })
  arcadeId: number;
}
