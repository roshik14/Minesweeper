import Component from '../../components/base';
import Cell from './cell/cell';
import Level from '../../enums/level';
import EventType from '../../enums/event-type';
import EndGameState from '../../enums/end-state';
import Helper from '../../helper';
import MineGenerator from './mine-generator';

import './index.scss';

const STORAGE_KEY = 'roshik14-gameboardSavedData';
const MINES_DEFAULT = 10;

const Html = {
  DIV: 'div',
  BUTTON: 'button',
};

const Css = {
  BOARD: 'board',
  BOARD_DISABLED: 'board__disabled',
  BOARD_ROW: 'board-row',
  BOARD_EASY: 'board__easy',
  BOARD_MEDIUM: 'board__medium',
  BOARD_HARD: 'board__hard',
};

const BoardSizes = Object.fromEntries([
  [Level.Easy, 10],
  [Level.Medium, 15],
  [Level.Hard, 25],
]);

const LevelSizes = Object.fromEntries([
  [Level.Easy, Css.BOARD_EASY],
  [Level.Medium, Css.BOARD_MEDIUM],
  [Level.Hard, Css.BOARD_HARD],
]);

class Gameboard extends Component {
  /**
   * @field
   * @type {number}
   */
  #size;

  /**
   * @filed
   * @type {Level}
   */
  #level;

  get level() {
    return this.#level;
  }

  /**
   * @field
   * @type {number}
   */
  #minesCount;

  get minesCount() {
    return this.#minesCount;
  }

  /**
   * @field
   * @type {Cell[][]}
   */
  #board;

  #isGenerated = false;

  #isDisabled = false;

  #isDark = true;

  /**
   * Construct gameboard and render content
   * @param {Level} level
   */
  constructor(level, minesCount = MINES_DEFAULT) {
    super(Html.DIV, [Css.BOARD]);
    Component.onUnload(() => Helper.serialize(STORAGE_KEY, this));
    if (this.#load()) {
      return;
    }
    this.render(level, minesCount);
  }

  /**
   * Render content of gameboard with passed level
   * @param {Level} level
   */
  render = (level, minesCount) => {
    this.#level = level;
    this.#size = BoardSizes[level];
    this.#minesCount = minesCount;
    this.removeClassList(...Object.values(LevelSizes));
    this.addClassList(LevelSizes[level]);
    this.removeClassList(Css.BOARD_DISABLED);
    this.#createBoard();
    this.#renderBoard();
    this.#updateListeners();
    return this;
  };

  /**
   * Render content of gameboard updating mines count
   * @param {number} minesCount
   */
  renderWithMines = (minesCount) => {
    this.#minesCount = minesCount;
    this.#createBoard();
    this.#renderBoard();
    this.#updateListeners();
    return this;
  };

  switchTheme = (isFirstTime) => {
    this.#board.forEach((row) => row.forEach((cell) => cell.switchTheme()));
    if (isFirstTime) {
      return;
    }
    this.#isDark = !this.#isDark;
  };

  toJSON = () => ({
    board: this.#board,
    level: this.#level,
    size: this.#size,
    minesCount: this.#minesCount,
    isGenerated: this.#isGenerated,
    isDisabled: this.#isDisabled,
    isDark: this.#isDark,
  });

  #load = () => {
    const obj = Helper.deserialize(STORAGE_KEY);
    if (!obj) {
      return false;
    }
    this.#isGenerated = obj.isGenerated;
    if (!this.#isGenerated) {
      this.render(obj.level, obj.minesCount);
      return true;
    }
    this.#size = obj.size;
    this.#level = obj.level;
    this.#minesCount = obj.minesCount;
    this.#isDisabled = obj.isDisabled;
    this.#isDark = obj.isDark;
    this.removeClassList(...Object.values(LevelSizes));
    this.addClassList(LevelSizes[this.#level]);
    this.#createBoard();
    obj.board.forEach((row, x) =>
      row.forEach((cellObj, y) => {
        this.#board[x][y].load(cellObj, this.#isDisabled);
      })
    );
    this.#renderBoard();
    this.addEventListener(EventType.RIGHT_CLICK, this.#handleMarkCell);
    if (this.#isDisabled) {
      this.addClassList(Css.BOARD_DISABLED);
      return true;
    }
    const startGame = () => this.dispatchCustomEvent(EventType.GAME_START);
    this.addEventListener(EventType.LEFT_CLICK, this.#handleOpenCell)
      .addEventListener(EventType.LEFT_CLICK, startGame, { once: true })
      .addEventListener(EventType.RIGHT_CLICK, startGame, { once: true });
    return true;
  };

  #createBoard = () => {
    const arrayLike = { length: this.#size };
    this.#board = Array.from(arrayLike).map((row, x) =>
      Array.from(arrayLike).map((col, y) => new Cell(x, y, this.#isDark))
    );
  };

  #renderBoard = () => {
    const rows = this.#board.map((row) => {
      const css = `cell__${this.#level.toLowerCase()}`;
      return new Component(Html.DIV, [Css.BOARD_ROW]).appendChildren(
        ...row.map((cell) => cell.addClassList(css))
      );
    });
    this.replaceChildren(...rows);
  };

  #updateListeners = () => {
    this.#isGenerated = false;
    this.#isDisabled = false;
    this.removeEventListener(EventType.LEFT_CLICK, this.#handleOpenCell)
      .removeEventListener(EventType.RIGHT_CLICK, this.#handleMarkCell)
      .addEventListener(EventType.LEFT_CLICK, this.#generateBoard, { once: true })
      .addEventListener(EventType.LEFT_CLICK, this.#handleOpenCell)
      .addEventListener(EventType.RIGHT_CLICK, this.#handleMarkCell);
  };

  #generateBoard = (event) => {
    if (!Helper.isCellClicked(event) || this.#isGenerated) {
      return;
    }
    const { target } = event;
    const { cell } = this.#getCellWithCoordinates(target);
    this.#generate(cell);
    this.#renderBoard();
    this.dispatchCustomEvent(EventType.GAME_START);
    this.#isGenerated = true;
  };

  #generate = (exceptX, exceptY) => {
    const generator = new MineGenerator(this.#board, this.#minesCount);
    this.#board = generator.generate(exceptX, exceptY);
  };

  #handleMarkCell = (event) => {
    event.preventDefault();
    if (!Helper.isCellClicked(event)) {
      return;
    }
    const { cell } = this.#getCellWithCoordinates(event.target);
    cell.mark();
  };

  #handleOpenCell = (event) => {
    if (!Helper.isCellClicked(event)) {
      return;
    }
    const { target } = event;
    const { cell, x, y } = this.#getCellWithCoordinates(target);

    if (cell.isOpened() || cell.isMarked()) {
      return;
    }
    this.dispatchCustomEvent(EventType.OPEN_CELL);
    if (cell.isMine()) {
      cell.showMine();
      this.#openAllMines();
      this.#disableBoard(EndGameState.LOSE);
      return;
    }
    if (cell.isEmpty()) {
      const visited = new Set();
      this.#openCell(x, y, visited);
    }
    cell.open();
    this.#checkEndGame();
  };

  #openCell = (x, y, visited) => {
    for (let i = x - 1; i <= x + 1; i += 1) {
      for (let j = y - 1; j <= y + 1; j += 1) {
        if (Helper.isInRange(this.#board, i, j)) {
          const cell = this.#board[i][j];
          this.#openCurrentCell(cell, i, j, visited);
        }
      }
    }
  };

  #openCurrentCell = (cell, x, y, visited) => {
    if (visited.has(cell)) {
      return;
    }
    if (cell.isMine() || cell.isMarked()) {
      return;
    }
    visited.add(cell);
    cell.open();
    if (cell.isEmpty()) {
      this.#openCell(x, y, visited);
    }
  };

  #openAllMines = () => {
    Helper.convertMatrixToArray(this.#board)
      .filter((cell) => cell.isMine())
      .forEach((cell) => cell.open(true));
  };

  #checkEndGame = () => {
    const res = this.#board.some((row) => row.some((cell) => !cell.isMine() && !cell.isOpened()));
    if (!res) {
      this.#disableBoard(EndGameState.WIN);
    }
  };

  #disableBoard = (endGameState) => {
    this.#isDisabled = true;
    this.removeEventListener(EventType.LEFT_CLICK, this.#handleOpenCell);
    this.#board.forEach((row) => row.forEach((cell) => cell.disable()));
    this.dispatchCustomEvent(EventType.GAME_END, { detail: { result: endGameState } });
  };

  /**
   * Return Cell with x,y coordinates
   * @param {Element} htmlCell
   * @returns {{cell: Cell, x: number, y: number}}
   */
  #getCellWithCoordinates = (htmlCell) => {
    const x = +htmlCell.getAttribute(Cell.Attributes.DATA_X);
    const y = +htmlCell.getAttribute(Cell.Attributes.DATA_Y);
    const cell = this.#board[x][y];
    return { cell, x, y };
  };
}

export default Gameboard;
