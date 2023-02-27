import { validateBoard } from '@lib/ValidateBoard';
// import SudokuBoard from '@lib/Board';
import { SudokuGenerator, Difficulty } from '@lib/SudokuGenerator';

const generator = new SudokuGenerator();

// const boardString =
// '123678945584239761967145328372461589691583274458792613836924157219857436745316892';

// const boardString =
//   '586312497792548613314697258137286945259174836468953172971865324825439761643721589';

// const board = generator.generateFromString(boardString);

// console.log(board.display);

// console.log(ValidateBoard(board)); // true

const board = generator.generate(Difficulty.Completed);

console.log(board.display);

console.log(validateBoard(board)); // true
