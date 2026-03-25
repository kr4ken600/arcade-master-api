import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}