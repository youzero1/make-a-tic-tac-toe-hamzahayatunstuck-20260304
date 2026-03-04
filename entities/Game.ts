import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 9, default: '         ' })
  boardState: string;

  @Column({ type: 'varchar', length: 1, default: 'X' })
  currentPlayer: 'X' | 'O';

  @Column({ type: 'varchar', nullable: true })
  winner: 'X' | 'O' | 'Draw' | null;

  @CreateDateColumn()
  createdAt: Date;
}
