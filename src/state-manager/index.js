import Component from '../components/base';
import EndGameState from '../enums/end-state';
import EventType from '../enums/event-type';
import Level from '../enums/level';
import Helper from '../helper';
import SoundManager from '../sound-manager';

const STORAGE_KEY = 'roshik14-stateManagerData';

const GameState = {
  NOT_STARTED: 'not-started',
  STARTED: 'started',
  ENDED: 'ended',
};

class StateManager {
  /**
   * @field
   * @type {Gameboard}
   */
  #gameboard;

  /**
   * @field
   * @type {LevelControls}
   */
  #controls;

  /**
   * @field
   * @type {Display}
   */
  #display;

  #header;

  #state = {
    level: Level.Easy,
    game: GameState.NOT_STARTED,
    minesCount: 10,
  };

  /**
   * Constructs state manager for controls state of components
   * @param {Gameboard} gameboard
   * @param {Controls} controls
   * @param {Display} display
   * @param {Header} header
   */
  constructor(gameboard, controls, display, header) {
    this.#gameboard = gameboard;
    this.#controls = controls;
    this.#display = display;
    this.#header = header;
    Component.onUnload(() => Helper.serialize(STORAGE_KEY, this));
    this.#load();
  }

  listenGameboardEvents = () => {
    this.#gameboard
      .addEventListener(EventType.GAME_END, this.#handleGameEnd)
      .addEventListener(EventType.MARK_CELL, this.#handleMarkCell)
      .addEventListener(EventType.OPEN_CELL, this.#handleOpenCell)
      .addEventListener(EventType.GAME_START, this.#handleGameStart);
  };

  listenControlsEvents = () => {
    this.#controls
      .addEventListener(EventType.CHANGE_LEVEL, this.#handleChangeLevel)
      .addEventListener(EventType.RESTART_LEVEL, this.#handleRestartLevel)
      .addEventListener(EventType.SHOW_SCORE, this.#display.showScore)
      .addEventListener(EventType.SWITCH_SOUND, SoundManager.turnVolume)
      .addEventListener(EventType.SWITCH_THEME, this.#changeTheme);
    if (!this.#controls.isThemeChecked()) {
      this.#changeTheme(true);
    }
    if (!this.#controls.isSoundChecked()) {
      SoundManager.turnVolume();
    }
  };

  toJSON = () => ({
    level: this.#state.level,
    minesCount: this.#state.minesCount,
  });

  #load = () => {
    const obj = Helper.deserialize(STORAGE_KEY);
    if (!obj) {
      return;
    }
    this.#state.level = obj.level;
    this.#state.minesCount = obj.minesCount || this.#state.minesCount;
    this.#controls.load(obj.minesCount, obj.level);
  };

  #handleGameEnd = (event) => {
    const { result } = event.detail;
    this.#state.game = GameState.ENDED;
    this.#display.showEndMessage(result);
    this.#display.stopTimer();
    SoundManager.playEndGameSound(result);
    if (result === EndGameState.WIN) {
      this.#display.updateScoreBoard(this.#state.level);
    }
  };

  #handleGameStart = () => {
    if (this.#state.game !== GameState.NOT_STARTED) {
      return;
    }
    this.#state.game = GameState.STARTED;
    this.#display.startTimer();
  };

  #handleMarkCell = (event) => {
    const { isMarked } = event.detail;
    if (isMarked) {
      this.#display.decreaseMinesCount();
    } else {
      this.#display.increaseMinesCount();
    }
    SoundManager.playMarkCellSound();
  };

  #handleOpenCell = () => {
    this.#display.updateTurnsCount();
    SoundManager.playOpenCellSound();
  };

  #handleChangeLevel = (event) => {
    const { level, minesCount } = event.detail;
    this.#state.level = level;
    this.#state.minesCount = minesCount;
    this.#gameboard.render(this.#state.level, minesCount);
    this.#reset(minesCount, true);
  };

  #handleRestartLevel = (event) => {
    const { minesCount, shouldReset } = event.detail;
    this.#gameboard.renderWithMines(minesCount);
    this.#state.minesCount = minesCount;
    this.#reset(minesCount, shouldReset);
  };

  #reset = (minesCount, isInputReset) => {
    this.#display.reset(minesCount);
    if (isInputReset) {
      this.#controls.resetInput(minesCount);
    }
    this.#state.game = GameState.NOT_STARTED;
  };

  #changeTheme = (isFirstTime) => {
    Component.switchTheme();
    this.#controls.switchTheme();
    this.#header.switchTheme();
    this.#display.switchTheme();
    this.#gameboard.switchTheme(isFirstTime);
  };
}

export default StateManager;
