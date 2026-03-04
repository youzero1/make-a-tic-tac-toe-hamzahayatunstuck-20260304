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

  if (req.method === 'PUT') {
    try {
      if (typeof id !== 'string') {
        return res.status(400).json({ message: 'Invalid game ID' });
      }
      const { position } = req.body;
      if (typeof position !== 'number' || position % 1 !== 0) {
        return res.status(400).json({ message: 'Position must be an integer' });
      }
      const result = await gameService.makeMove(id, position);
      if (result.error) {
        return res.status(400).json({ message: result.error });
      }
      res.status(200).json(result.game);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
