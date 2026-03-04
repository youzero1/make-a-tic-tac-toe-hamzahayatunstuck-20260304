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
  const gameService = new GameService();

  if (req.method === 'POST') {
    try {
      const game = await gameService.createGame();
      res.status(201).json(game);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
