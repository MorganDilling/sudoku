import Instance from './Instance';
import Coordinate from './Coordinate';
import Cell from './Cell';
import { clone, addItem, removeItem } from './ArrayEdit';

const BOARD_SIZE = 9;
export default class SudokuBoard extends Instance {
  static BOARD_SIZE = BOARD_SIZE;
  private _board: Cell[];
  private _displayCache: string | null;

  constructor() {
    super();
    this._board = [];
    this._displayCache = null;

    // Initialize the board with 0s
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        this._board.push(new Cell(new Coordinate(i, j)));
      }
    }
  }

  fetchCellsInSquare(row: number, col: number): Cell[] {
    const squareRow = Math.floor(row / 3);
    const squareCol = Math.floor(col / 3);

    const cells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = this.fetchCell(squareRow * 3 + i, squareCol * 3 + j).cell;
        if (cell) cells.push(cell);
      }
    }
    return cells;
  }

  fetchCell(row: number, col: number) {
    const cellCoordinate = new Coordinate(row, col);
    const cell = this._board.find((cell) =>
      cell.coordinate.equals(cellCoordinate)
    );

    let index;
    if (cell) {
      index = this._board.indexOf(cell);
    }
    return { cell, index };
  }

  get board() {
    return this._board;
  }

  row(row: number) {
    return this._board.filter((cell) => cell.coordinate.y === row);
  }

  col(column: number) {
    return this._board.filter((cell) => cell.coordinate.x === column);
  }

  get display() {
    if (this._displayCache) {
      return this._displayCache;
    }

    let display = '';

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = this.fetchCell(i, j).cell;

        if (cell) {
          display += (cell.value === 0 ? '_' : cell.value) + ' ';
        }
        if (j === 2 || j === 5) {
          display += '| ';
        }
      }
      display += '\n';
      if (i === 2 || i === 5) {
        display += '------+-------+------\n';
      }
    }

    this._displayCache = display;
    return display;
  }

  modifyCell(row: number, col: number, num: number): void {
    const { cell, index } = this.fetchCell(row, col);

    let tempBoard = clone(this._board);

    if (cell && index) {
      tempBoard = removeItem(tempBoard, index);
    }

    const newCell = new Cell(new Coordinate(row, col), num);

    tempBoard = addItem(tempBoard, index || 0, newCell);
    this._board = clone(tempBoard);

    this.onChanged.fire(new Coordinate(row, col), num);

    this._displayCache = null;
  }

  equals(board: SudokuBoard) {
    return this._board.every((cell, index) => {
      const otherCell = board.board[index];

      return (
        cell.coordinate.equals(otherCell.coordinate) &&
        cell.value === otherCell.value
      );
    });
  }
}
