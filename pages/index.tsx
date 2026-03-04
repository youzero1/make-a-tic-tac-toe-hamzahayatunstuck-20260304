import { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';

type Game = {
  id: string;
  boardState: string;
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | 'Draw' | null;
};

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNewGame = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/game', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to create game');
      const newGame = await response.json();
      setGame(newGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = async (position: number) => {
    if (!game || game.winner || game.boardState[position] !== ' ') return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/game/${game.id}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Move failed');
      }
      const updatedGame = await response.json();
      setGame(updatedGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    createNewGame();
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Tic Tac Toe</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
      <GameStatus game={game} loading={loading} />
      <GameBoard game={game} onCellClick={handleCellClick} />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={createNewGame}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
