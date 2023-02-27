import SudokuBoard from './Board';
import Coordinate from './Coordinate';
import { validateSection } from './ValidateBoard';

export enum Difficulty {
  Completed = 'Completed',
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
}

export class SudokuGenerator {
  attempts: number;
  startTime: number;
  constructor() {
    this.attempts = 0;
    this.startTime = 0;
  }

  /**
   * @param boardString a string which is a stream of numbers
   * @returns SudokuBoard
   */
  generateFromString(boardString: string): SudokuBoard {
    const board = new SudokuBoard();
    const boardArray = boardString.split('');
    boardArray.forEach((value, index) => {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const cell = board.fetchCell(row, col).cell;
      if (cell) {
        board.modifyCell(row, col, parseInt(value));
      }
    });

    return board;
  }

  generate(difficulty: Difficulty): SudokuBoard {
    this.attempts = 0;
    this.startTime = Date.now();
    const board = new SudokuBoard();

    for (let i = 0; i < 9; i += 3) {
      let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      numbers = this._shuffle(numbers);
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          const n = numbers.pop();
          if (n) board.modifyCell(i + j, i + k, n);
        }
      }
    }

    // now fill in the rest of the board using backtracking
    this._fillRemaining(board);

    // remove cells based on difficulty
    switch (difficulty) {
      case Difficulty.Completed:
        break;
      case Difficulty.Easy:
        // find 20 random cells and remove them
        for (let i = 0; i < 20; i++) {
          const randomIndex = Math.floor(Math.random() * 9);
          const cell = board.board[randomIndex];
          board.modifyCell(cell.coordinate.y, cell.coordinate.x, 0);
        }
        break;
      case Difficulty.Medium:
        // find 30 random cells and remove them
        for (let i = 0; i < 30; i++) {
          const randomIndex = Math.floor(Math.random() * 9);
          const cell = board.board[randomIndex];
          board.modifyCell(cell.coordinate.y, cell.coordinate.x, 0);
        }
        break;
      case Difficulty.Hard:
        // find 40 random cells and remove them
        for (let i = 0; i < 40; i++) {
          const randomIndex = Math.floor(Math.random() * 9);
          const cell = board.board[randomIndex];
          board.modifyCell(cell.coordinate.y, cell.coordinate.x, 0);
        }
        break;
    }

    return board;
  }

  private _shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  private _fillRemaining(board: SudokuBoard): boolean {
    console.clear();

    const timeTaken = Date.now() - this.startTime;
    console.log(
      `Attempts: ${this.attempts}, Time: ${new Date(timeTaken)
        .toISOString()
        .substr(11, 12)}`
    );

    const coord = this._findEmptyCell(board);
    if (!coord) {
      return false;
    }

    for (let num = 1; num <= 9; num++) {
      const cellValue = board.fetchCell(coord.y, coord.x).cell;
      board.modifyCell(coord.y, coord.x, num);

      const validChange = this._isValid(board, coord.y, coord.x);

      if (validChange) {
        const remainingRecursion = this._fillRemaining(board);

        if (remainingRecursion) {
          return true;
        }

        board.modifyCell(coord.y, coord.x, 0);
      } else {
        this.attempts++;
        board.modifyCell(coord.y, coord.x, cellValue ? cellValue.value : 0);
      }
    }

    return false;
  }

  private _findEmptyCell(board: SudokuBoard): Coordinate | null {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const cell = board.fetchCell(row, col).cell;
        if (cell && cell.value === 0) {
          return new Coordinate(col, row);
        }
      }
    }

    return null;
  }

  private _isValid(board: SudokuBoard, row: number, col: number): boolean {
    const rowArray = board.row(row).filter((cell) => cell.value !== 0);
    const colArray = board.col(col).filter((cell) => cell.value !== 0);
    const squareArray = board
      .fetchCellsInSquare(row, col)
      .filter((cell) => cell.value !== 0);

    if (
      [rowArray, colArray, squareArray].filter((item) => !validateSection(item))
        .length !== 0
    ) {
      return false;
    }

    return true;
  }
}
