import Cell from './Cell';
import SudokuBoard from './Board';

const validateSection = (section: Cell[]) => {
  const values = section.map((cell) => cell.value);
  const uniqueValues = new Set(values);
  return values.length === uniqueValues.size;
};

export default (board: SudokuBoard) => {
  let valid = true;

  for (let i = 0; i < SudokuBoard.BOARD_SIZE; i++) {
    const row = board.row(i);
    const col = board.col(i);
    const square = board.fetchCellsInSquare(i, i);

    if (
      [row, col, square].filter((item) => !validateSection(item)).length !== 0
    ) {
      valid = false;
      break;
    }
  }

  return valid;
};
