import Component from '../../components/base';
import ScoreBoard from './scoreboard';
import Timer from './timer';
import EndMessage from './end-message';
import EndGameState from '../../enums/end-state';
import Helper from '../../helper';

import './index.scss';

const TURNS_DEFAULT = 0;
const FLAGS_DEFAULT = 0;
const STORAGE_KEY = 'roshik14-displayData';

const Html = {
  DIV: 'div',
  PARAGRAPH: 'p',
};

const Css = {
  DISPLAY: 'displays',
  LIGHT: 'displays__light',
  CONTAINER: 'displays-container',
  SECTION: 'displays-section',
  DESCRIPTION: 'displays-description',
  DESCRIPTION__LIGHT: 'displays-description__light',
  VALUE: 'displays-value',
};

const WIN_MESSAGE = 'Hooray! You found all mines in ## seconds and N moves!';
const LOSE_MESSAGE = 'Game over. Try again';

const createDisplayElement = (descriptionText, valueText, parent) => {
  const description = new Component(Html.PARAGRAPH, Css.DESCRIPTION).setTextContent(
    descriptionText
  );
  const value = new Component(Html.PARAGRAPH, Css.VALUE).setTextContent(valueText);
  const div = new Component(Html.DIV, Css.SECTION);
  div.appendChildren(value, description);
  parent.appendChild(div);
  return value;
};

class Display extends Component {
  #minesCount;

  #minesElement;

  #flagsElement;

  #turnsElement;

  #timerElement;

  #timerId;

  #endMessage;

  #scoreBoard;

  #isGameOver = false;

  #descriptions;

  constructor(minesCount) {
    super(Html.DIV, Css.DISPLAY);
    this.#minesCount = minesCount;
    const container = new Component(Html.DIV, Css.CONTAINER);
    this.#minesElement = createDisplayElement('Titans', minesCount, container);
    this.#flagsElement = createDisplayElement('Flags', FLAGS_DEFAULT, container);
    this.#turnsElement = createDisplayElement('Turns', TURNS_DEFAULT, container);
    this.#timerElement = createDisplayElement('Time', Timer.data(), container);
    this.appendChild(container);
    this.#endMessage = new EndMessage();
    this.#scoreBoard = new ScoreBoard();
    this.appendChildren(this.#endMessage, this.#scoreBoard);
    Component.onUnload(() => Helper.serialize(STORAGE_KEY, this));
    this.#load();
  }

  reset = (minesCount) => {
    Timer.reset();
    this.#minesCount = minesCount;
    this.#minesElement.setTextContent(this.#minesCount);
    this.#flagsElement.setTextContent(FLAGS_DEFAULT);
    this.#turnsElement.setTextContent(TURNS_DEFAULT);
    this.#timerElement.setTextContent(Timer.data());
    this.#endMessage.hide();
    clearInterval(this.#timerId);
    this.#isGameOver = false;
  };

  startTimer = () => {
    Timer.start();
    this.#timerId = setInterval(() => {
      this.#timerElement.setTextContent(Timer.data());
    }, Timer.INTERVAL);
  };

  stopTimer = () => {
    Timer.stop();
    clearInterval(this.#timerId);
  };

  decreaseMinesCount = () => {
    const count = +this.#minesElement.getTextContent();
    this.#minesElement.setTextContent(count - 1);
    this.#flagsElement.setTextContent(+this.#flagsElement.getTextContent() + 1);
  };

  increaseMinesCount = () => {
    const count = +this.#minesElement.getTextContent();
    if (count === this.#minesCount) {
      return;
    }
    this.#minesElement.setTextContent(count + 1);
    this.#flagsElement.setTextContent(+this.#flagsElement.getTextContent() - 1);
  };

  updateTurnsCount = () => {
    this.#turnsElement.setTextContent(+this.#turnsElement.getTextContent() + 1);
  };

  updateScoreBoard = (level) => {
    const item = {
      level,
      mines: this.#minesCount,
      turns: this.#turnsElement.getTextContent(),
      time: this.#timerElement.getTextContent(),
    };
    this.#scoreBoard.addItem(item);
  };

  showEndMessage = (endGameState) => {
    const msg =
      endGameState === EndGameState.WIN
        ? WIN_MESSAGE.replace('##', Timer.seconds()).replace(
            'N',
            this.#turnsElement.getTextContent()
          )
        : LOSE_MESSAGE;
    this.#endMessage.setTextContent(msg).show();
    this.#isGameOver = true;
  };

  showScore = () => this.#scoreBoard.show();

  switchTheme = () => {
    this.toggleClass(Css.LIGHT);
    this.#endMessage.switchTheme();
  };

  toJSON = () => ({
    mines: this.#minesElement.getTextContent(),
    flags: this.#flagsElement.getTextContent(),
    turns: this.#turnsElement.getTextContent(),
    time: Timer.data(),
    timerData: Timer.getTime(),
    messageText: this.#endMessage.getTextContent(),
    isGameOver: this.#isGameOver,
  });

  #load = () => {
    const obj = Helper.deserialize(STORAGE_KEY);
    if (!obj) {
      return;
    }
    this.#minesElement.setTextContent(obj.mines);
    this.#flagsElement.setTextContent(obj.flags);
    this.#turnsElement.setTextContent(obj.turns);
    this.#timerElement.setTextContent(obj.time);
    Timer.load(obj.timerData);
    this.#endMessage.setTextContent(obj.messageText);
    this.#isGameOver = obj.isGameOver;
    if (this.#isGameOver) {
      this.#endMessage.show();
    }
  };
}

export default Display;
