import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Game } from '@/entities/Game';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './games.db',
  synchronize: true,
  logging: false,
  entities: [Game],
  migrations: [],
  subscribers: [],
});
