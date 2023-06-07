const BUTTON = 'button';
const CELL = 'cell';

/**
 * Determines if button was clicked or not
 * @param {Event} event
 * @returns {boolean}
 */
const isButtonClicked = (event) => event.target.closest(BUTTON);

const isCellClicked = (event) => event.target.classList.contains(CELL);

/**
 * Determines x and y are inside board range or not
 * @param {Cell[]} board
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isInRange = (board, x, y) => board[x] && board[x][y];

/**
 * Shuffle array using Fisher–Yates shuffle method
 * @param {...any} array
 * @returns {...any} Shuffled array
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const k = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[k]] = [newArray[k], newArray[i]];
  }
  return newArray;
};

/**
 * Create empty matrix width * height
 * @param {number} width
 * @param {height} height
 * @returns {Array[]}
 */
const initMatrix = (width, height) => {
  const matrix = new Array(width);
  for (let i = 0; i < width; i += 1) {
    matrix[i] = new Array(height);
  }
  return matrix;
};

/**
 * Converts 2D array to one dimensional array
 * @param {Array[]} matrix
 * @returns {any[]} array
 */
const convertMatrixToArray = (matrix) => matrix.reduce((prev, current) => prev.concat(current));

/**
 * Serializes object and save to localStorage
 * @param {string} key
 * @param {{}} obj
 */
const serialize = async (key, obj) => {
  const str = JSON.stringify(obj);
  localStorage.setItem(key, str);
};

/**
 * Deserializes object from localStorage
 * @param {string} key
 * @returns {{}}
 */
const deserialize = (key) => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  return JSON.parse(item);
};

const Helper = {
  isButtonClicked,
  isCellClicked,
  shuffleArray,
  initMatrix,
  isInRange,
  convertMatrixToArray,
  serialize,
  deserialize,
};

export default Helper;
