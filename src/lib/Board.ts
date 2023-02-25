import Instance from './Instance';
import Coordinate from './Coordinate';
import Cell from './Cell';

const BOARD_SIZE = 9;

const clone = <T>(array: T[]): T[] => [...array];
const removeItem = <T>(array: T[], idx: number): T[] => [
  ...clone(array).splice(0, idx),
  ...clone(array).splice(idx + 1),
];
const addItem = <T>(array: T[], idx: number, item: T): T[] => [
  ...clone(array).splice(0, idx),
  item,
  ...clone(array).splice(idx),
];

export default class SudokuBoard extends Instance {
  private _board: Cell[];

  constructor() {
    super();
    this._board = [];

    // Initialize the board with 0s
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        this._board.push(new Cell(new Coordinate(i, j)));
      }
    }
  }

  fetchCellsInSquare(row: number, col: number) {
    const squareRow = Math.floor(row / 3);
    const squareCol = Math.floor(col / 3);

    const cells = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        cells.push(this.fetchCell(squareRow * 3 + i, squareCol * 3 + j).cell);
      }
    }
    return cells;
  }

  fetchCell(row: number, col: number) {
    const cell = this._board.find((cell) =>
      cell.coordinate.equals(new Coordinate(row, col))
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
    let display = '';

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = this.fetchCell(i, j).cell;

        if (cell) {
          display += cell.value + ' ';
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

    const { cell: newCellFetch } = this.fetchCell(row, col);

    this.onChanged.fire(new Coordinate(row, col), num);
  }
}
