import { AppDataSource } from '@/lib/data-source';
import { Game } from '@/entities/Game';

export class GameService {
  private gameRepository = AppDataSource.getRepository(Game);

  async createGame(): Promise<Game> {
    const game = new Game();
    game.boardState = '         ';
    game.currentPlayer = 'X';
    game.winner = null;
    return await this.gameRepository.save(game);
  }

  async getGame(id: string): Promise<Game | null> {
    return await this.gameRepository.findOneBy({ id });
  }

  async makeMove(id: string, position: number): Promise<{ game: Game; error?: string }> {
    const game = await this.getGame(id);
    if (!game) {
      return { game: null as any, error: 'Game not found' };
    }

    if (game.winner) {
      return { game, error: 'Game is already over' };
    }

    if (position < 0 || position > 8) {
      return { game, error: 'Invalid position' };
    }

    const boardArray = game.boardState.split('');
    if (boardArray[position] !== ' ') {
      return { game, error: 'Cell is already occupied' };
    }

    boardArray[position] = game.currentPlayer;
    game.boardState = boardArray.join('');

    const winner = this.checkWinner(game.boardState);
    if (winner) {
      game.winner = winner;
    } else if (!game.boardState.includes(' ')) {
      game.winner = 'Draw';
    } else {
      game.currentPlayer = game.currentPlayer === 'X' ? 'O' : 'X';
    }

    const updatedGame = await this.gameRepository.save(game);
    return { game: updatedGame };
  }

  private checkWinner(board: string): 'X' | 'O' | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
        return board[a] as 'X' | 'O';
      }
    }
    return null;
  }
}
