import Component from '../../../components/base';
import EventType from '../../../enums/event-type';
import CellState from './cell-state';
import CellType from './cell-type';

import './cell.scss';

const Html = {
  DIV: 'div',
};

const Css = {
  CELL: 'cell',
  LIGHT: 'cell__light',
  OPENED: 'cell__opened',
  MINE: 'cell__mine',
  MARKED: 'cell__marked',
  MINE_SHOW: 'cell__mine-show',
  COLOR: 'color',
};

class Cell extends Component {
  /**
   * @field
   * @type {CellState}
   */
  #state;

  /**
   * @field
   * @type {CellType}
   */
  #type;

  /**
   * @field
   * @type {number}
   */
  #minesAround;

  /**
   * @field
   * @type {number}
   */
  #x;

  /**
   * @field
   * @type {number}
   */
  #y;

  /**
   * @field
   * @type {boolean}
   */
  #markable;

  #hasShown = false;

  get minesAround() {
    return this.#minesAround;
  }

  set minesAround(value) {
    if (Number.isNaN(value)) {
      throw TypeError('Type of value is not Number');
    }
    this.#minesAround = value;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  /**
   * @field
   * @readonly
   * @type {{DATA_X: string, DATA_Y: string}}
   */
  static Attributes = {
    DATA_X: 'data-x',
    DATA_Y: 'data-y',
  };

  /**
   * Construct cell with default values
   * @param {number} x x coordinate
   * @param {number} y y coordinate
   */
  constructor(x, y, isDark) {
    super(Html.DIV, [Css.CELL]);
    this.#state = CellState.Closed;
    this.#type = CellType.Field;
    this.#minesAround = 0;
    if (!isDark) {
      this.switchTheme();
    }
    this.updateCoordinates(x, y);
  }

  /**
   * Open cell
   * @param {boolean} isGameOver
   */
  open = (isGameOver) => {
    if ((this.isOpened() || this.isMarked()) && !isGameOver) {
      return;
    }
    this.#state = CellState.Opened;
    if (this.isMine()) {
      this.addClassList(Css.MINE);
      return;
    }
    this.setTextContent(this.#minesAround);
    this.addClassList(Css.OPENED, `${Css.CELL}-${this.minesAround}`);
  };

  mark = () => {
    if (this.isOpened() || !this.#markable) {
      return;
    }
    this.#state = this.isMarked() ? CellState.Closed : CellState.Marked;
    this.toggleClass(Css.MARKED);
    const detail = { isMarked: this.isMarked() };
    this.dispatchCustomEvent(EventType.MARK_CELL, { detail, bubbles: true });
  };

  showMine = () => {
    this.#state = CellState.Opened;
    this.addClassList(Css.MINE, Css.MINE_SHOW);
    const intervalTimer = setInterval(() => {
      this.toggleClass(Css.MINE_SHOW);
    }, 500);
    const timeoutTimer = setTimeout(() => {
      clearInterval(intervalTimer);
      clearTimeout(timeoutTimer);
      this.addClassList(Css.MINE_SHOW);
    }, 3000);
    this.#hasShown = true;
  };

  /**
   * Update x, y coordinates of current Cell
   * @param {number} x
   * @param {number} y
   * @returns {Cell} this
   */
  updateCoordinates = (x, y) => {
    if (Number.isNaN(x) || Number.isNaN(y)) {
      throw TypeError('x or y coordinate is not a number');
    }
    this.#x = x;
    this.#y = y;
    this.setAttribute(Cell.Attributes.DATA_X, x);
    this.setAttribute(Cell.Attributes.DATA_Y, y);
    return this;
  };

  /**
   * Convert type of Cell from Field to Mine
   */
  toMine = () => {
    const cell = this.clone();
    cell.#type = CellType.Mine;
    cell.#minesAround = 0;
    return cell;
  };

  /**
   * Clone cell
   * @param {Cell} other
   */
  clone = () => {
    const cell = new Cell(this.#x, this.#y, !this.hasClassName(Css.LIGHT));
    cell.#state = this.#state;
    cell.#type = this.#type;
    cell.#minesAround = this.#minesAround;
    cell.#hasShown = this.#hasShown;
    return cell;
  };

  /**
   * Disable right click on Cell
   */
  disable = () => {
    this.#markable = false;
    return this;
  };

  /**
   * Make Cell markable (right click on)
   * @returns {Cell} this
   */
  activate = () => {
    this.#markable = true;
    return this;
  };

  /**
   * Check cell is empty
   * @returns {boolean}
   */
  isEmpty = () => this.#type === CellType.Field && this.#minesAround === 0;

  /**
   * Check cell is already opened
   * @returns {boolean}
   */
  isOpened = () => this.#state === CellState.Opened;

  /**
   * Check cell is marked
   * @returns {boolean}
   */
  isMarked = () => this.#state === CellState.Marked;

  /**
   * Check cell type is Mine
   * @returns {boolean}
   */
  isMine = () => this.#type === CellType.Mine;

  switchTheme = () => {
    this.toggleClass(Css.LIGHT);
  };

  toJSON = () => ({
    state: this.#state,
    type: this.#type,
    minesAround: this.#minesAround,
    x: this.#x,
    y: this.#y,
    markable: this.#markable,
    hasShown: this.#hasShown,
  });

  load = (cellObj) => {
    this.#markable = cellObj.markable;
    this.#minesAround = cellObj.minesAround;
    this.#state = cellObj.state;
    this.#type = cellObj.type;
    this.#hasShown = cellObj.hasShown;
    this.updateCoordinates(cellObj.x, cellObj.y);
    if (this.isMarked()) {
      this.toggleClass(Css.MARKED);
      return;
    }
    if (this.#hasShown) {
      this.addClassList(Css.MINE_SHOW);
    }
    if (this.isMine() && this.isOpened()) {
      this.addClassList(Css.MINE);
      return;
    }
    if (this.isOpened()) {
      this.setTextContent(this.minesAround);
      this.addClassList(Css.OPENED, `${Css.CELL}-${this.minesAround}`);
    }
  };
}

export default Cell;
