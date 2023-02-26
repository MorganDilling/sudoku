import Cell from './Cell';
import SudokuBoard from './Board';
import { BOARD_SIZE } from './Board';

const validateSection = (section: Cell[]) => {
  const values = section.map((cell) => cell.value);
  const uniqueValues = new Set(values);
  return values.length === uniqueValues.size;
};

export default (board: SudokuBoard) => {
  let valid = true;

  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = board.row(i);
    const col = board.col(i);
    const square = board.fetchCellsInSquare(i, i);

    if (
      !validateSection(row) ||
      !validateSection(col) ||
      !validateSection(square)
    ) {
      valid = false;
      break;
    }
  }

  return valid;
};
