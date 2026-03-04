import type { NextApiRequest, NextApiResponse } from 'next';
import { AppDataSource } from '@/lib/data-source';
import { GameService } from '@/services/gameService';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    initialized = true;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await ensureInitialized();
  const { id } = req.query;
  const gameService = new GameService();

  if (req.method === 'GET') {
    try {
      if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid game ID' });
      }
      const game = await gameService.getGame(id);
      if (!game) {
        return res.status(404).json({ message: 'Game not found' });
      }
      res.status(200).json(game);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
