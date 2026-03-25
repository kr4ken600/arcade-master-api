import { Session } from 'src/sessions/entities/session.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  genre: string;

  @Column()
  year: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Session, (session) => session.game)
  sessions: Session[];
}
