import { Game } from '@/entities/Game';

interface GameStatusProps {
  game: Game | null;
  loading: boolean;
}

export default function GameStatus({ game, loading }: GameStatusProps) {
  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  if (!game) {
    return <p style={{ textAlign: 'center' }}>No game active</p>;
  }

  let status = `Current Player: ${game.currentPlayer}`;
  if (game.winner === 'Draw') {
    status = 'Game ended in a draw!';
  } else if (game.winner) {
    status = `Winner: ${game.winner}!`;
  }

  return (
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{status}</p>
    </div>
  );
}
