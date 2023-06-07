import Helper from '../../helper';

class MineGenerator {
  /**
   * @field
   * @type {Helper.Matrix}
   */
  #board;

  /**
   * @field
   * @type {number}
   */
  #minesCount;

  constructor(board, minesCount) {
    this.#board = board;
    this.#minesCount = minesCount;
  }

  /**
   * @param {Cell} cell
   * @returns {Cell[][]} board with mines
   */
  generate(cell) {
    this.#board = this.#generateMines(cell);
    this.#updateFieldCells();
    return this.#board;
  }

  #generateMines = (cell) => {
    const newBoard = Helper.initMatrix(this.#board.length, this.#board.length);
    const cells = this.#getArrayWithMines(cell);
    const shuffled = this.#shuffleCells(cells, cell);
    shuffled.forEach((value, index) => {
      const x = Math.floor(index / newBoard.length);
      const y = Math.floor(index % newBoard.length);
      newBoard[x][y] = value.updateCoordinates(x, y).activate();
    });
    return newBoard;
  };

  #shuffleCells = (cells, cell) => {
    const shuffled = Helper.shuffleArray(cells);
    const exceptCell = cell.clone();
    const index = cell.x * this.#board.length + cell.y;
    shuffled.splice(index, 0, exceptCell);
    return shuffled;
  };

  #getArrayWithMines = (exceptCell) => {
    let minesCount = this.#minesCount;
    return Helper.convertMatrixToArray(this.#board)
      .filter((cell) => cell !== exceptCell)
      .map((cell) => {
        if (minesCount) {
          minesCount -= 1;
          return cell.toMine();
        }
        return cell.clone();
      });
  };

  #updateFieldCells = () => {
    const board = this.#board;
    for (let x = 0; x < board.length; x += 1) {
      for (let y = 0; y < board.length; y += 1) {
        if (!board[x][y].isMine()) {
          board[x][y].minesAround = this.#calculateMinesAround(x, y);
        }
      }
    }
  };

  /**
   * Returns mines count around the Cell
   * @param {number} x x-coordinate of Cell
   * @param {number} y y-coordinate of Cell
   * @returns {number} mines count
   */
  #calculateMinesAround = (x, y) => {
    let count = 0;
    for (let i = x - 1; i <= x + 1; i += 1) {
      for (let j = y - 1; j <= y + 1; j += 1) {
        if (Helper.isInRange(this.#board, i, j) && this.#board[i][j].isMine()) {
          count += 1;
        }
      }
    }
    return count;
  };
}

export default MineGenerator;
