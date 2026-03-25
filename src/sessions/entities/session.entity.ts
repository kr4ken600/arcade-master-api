import { Game } from "src/games/entities/game.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}
