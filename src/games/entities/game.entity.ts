import { Arcade } from 'src/arcades/entities/arcade.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

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

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Session, (session) => session.game)
  sessions: Session[];

  @ManyToOne(() => Arcade, (arcade) => arcade.games, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'arcadeId' })
  arcade: Arcade;

  @Column({ nullable: true })
  arcadeId: number;
}
