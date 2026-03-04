import { Game } from '@/entities/Game';

interface GameBoardProps {
  game: Game | null;
  onCellClick: (position: number) => void;
}

export default function GameBoard({ game, onCellClick }: GameBoardProps) {
  const boardArray = game ? game.boardState.split('') : Array(9).fill(' ');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      maxWidth: '300px',
      margin: '0 auto',
    }}>
      {boardArray.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={!game || cell !== ' ' || game.winner !== null}
          style={{
            aspectRatio: '1',
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            border: '2px solid #333',
            cursor: (!game || cell !== ' ' || game.winner) ? 'not-allowed' : 'pointer',
          }}
        >
          {cell !== ' ' ? cell : ''}
        </button>
      ))}
    </div>
  );
}
