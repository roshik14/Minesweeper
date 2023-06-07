import Component from '../../components/base';
import Button from '../../components/button';
import Switch from '../../components/switch';
import Level from '../../enums/level';
import EventType from '../../enums/event-type';
import Attributes from '../../enums/attributes';

import './index.scss';

const INPUT_DESCRIPTION = 'Titans count:';
const MINES_COUNT_DEFAULT = 10;

const Html = {
  DIV: 'div',
  INPUT: 'input',
  LABEL: 'label',
  CHECKBOX: 'checkbox',
  PARAGRAPH: 'p',
};

const Css = {
  CONTROLS: 'controls',
  LIGHT: 'controls__light',
  BUTTONS_CONTAINER: 'controls-buttons',
  BUTTON: 'controls-btn',
  BTN_ACTIVE: 'controls-btn__active',
  BNT_LIGHT: 'controls-btn__active--light',
  INPUT_CONTAINER: 'controls-input-container',
  INPUT: 'controls-input',
  LABEL: 'controls-input-description',
  INPUT_ITEM: 'controls-input-item',
  SOUND: 'switch-sound',
};

const Buttons = {
  Easy: Level.Easy,
  Medium: Level.Medium,
  Hard: Level.Hard,
  Restart: 'Restart',
  Score: 'Score',
};

const InputAttributes = Object.fromEntries([
  [Attributes.TYPE, 'number'],
  [Attributes.MIN, 10],
  [Attributes.MAX, 99],
  [Attributes.STEP, 1],
  [Attributes.ID, 'mines-input'],
]);

const getRestartOptions = (minesCount, shouldReset) => ({
  bubbles: true,
  detail: {
    minesCount,
    shouldReset,
  },
});

const normalizeValue = (target) => {
  const value = +target.value;
  const min = +target.getAttribute(Attributes.MIN);
  const max = +target.getAttribute(Attributes.MAX);
  if (Number.isNaN(value) || value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
};

const createSwitchComponent = (description, callback) => {
  const switchComponent = new Switch(description, callback, true);
  const name = new Component(Html.PARAGRAPH, Css.LABEL).setTextContent(description);
  return new Component(Html.DIV).appendChildren(switchComponent, name);
};

class Controls extends Component {
  #buttonsElement;

  #inputElement;

  #soundCheckbox;

  #themeCheckbox;

  constructor() {
    super(Html.DIV, Css.CONTROLS);
    this.#createButtons();
    const minesInput = this.#createMinesInput();
    const soundCallback = () => this.dispatchCustomEvent(EventType.SWITCH_SOUND);
    const themeCallback = () => this.dispatchCustomEvent(EventType.SWITCH_THEME);
    const sound = createSwitchComponent('Sound', soundCallback);
    const theme = createSwitchComponent('Dark', themeCallback);
    const inputContainer = new Component(Html.DIV, Css.INPUT_CONTAINER).appendChildren(
      minesInput,
      sound,
      theme
    );
    [this.#soundCheckbox] = sound.children;
    [this.#themeCheckbox] = theme.children;
    this.appendChild(inputContainer);
  }

  resetInput = (value) => {
    this.#inputElement.setProperty(Attributes.VALUE, value);
    return this;
  };

  toJSON = () => ({
    value: this.#inputElement.getProperty(Attributes.VALUE),
    activeButton: this.#buttonsElement.children
      .filter((btn) => btn.hasActiveClass(Css.BTN_ACTIVE))[0]
      .getTextContent(),
  });

  isThemeChecked = () => this.#themeCheckbox.isActive();

  isSoundChecked = () => this.#soundCheckbox.isActive();

  load = (value, level) => {
    this.resetInput(value);
    this.#buttonsElement.children.forEach((btn) => btn.removeClassList(Css.BTN_ACTIVE));
    this.#buttonsElement.children
      .filter((btn) => btn.getTextContent() === level)[0]
      .addClassList(Css.BTN_ACTIVE);
  };

  switchTheme = () => {
    this.#buttonsElement.children.forEach((btn) => {
      btn.switchTheme();
    });
    this.toggleClass(Css.LIGHT);
  };

  #createButtons = () => {
    const restartLevelBtn = new Button(Buttons.Restart, this.#handleRestartLevel, Css.BUTTON);
    const storyCallback = () => this.dispatchCustomEvent(EventType.SHOW_SCORE);
    const scoreBtn = new Button(Buttons.Score, storyCallback, Css.BUTTON);
    this.#buttonsElement = new Component(Html.DIV, Css.BUTTONS_CONTAINER)
      .appendChildren(...this.#createChangeLevelButtons())
      .appendChildren(restartLevelBtn, scoreBtn);
    this.appendChild(this.#buttonsElement);
  };

  #createMinesInput = () => {
    this.#inputElement = new Component(Html.INPUT, Css.INPUT)
      .setManyAttributes(InputAttributes)
      .setProperty(Attributes.VALUE, MINES_COUNT_DEFAULT)
      .addEventListener(EventType.CHANGE, this.#handleInputChange);
    const description = new Component(Html.LABEL, Css.LABEL)
      .setTextContent(INPUT_DESCRIPTION)
      .setAttribute(Attributes.FOR, InputAttributes[Attributes.ID]);
    const div = new Component(Html.DIV, Css.INPUT_ITEM).appendChildren(
      description,
      this.#inputElement
    );
    return div;
  };

  #createChangeLevelButtons = () => [
    new Button(Buttons.Easy, this.#handleChangeLevel, Css.BUTTON, Css.BTN_ACTIVE),
    new Button(Buttons.Medium, this.#handleChangeLevel, Css.BUTTON),
    new Button(Buttons.Hard, this.#handleChangeLevel, Css.BUTTON),
  ];

  #handleChangeLevel = (event) => {
    const { target } = event;
    const detail = {
      level: target.textContent,
      minesCount: this.#inputElement.getProperty(Attributes.VALUE),
    };
    this.#buttonsElement.children.forEach((btn) => btn.removeClassList(Css.BTN_ACTIVE));
    target.classList.add(Css.BTN_ACTIVE);
    this.dispatchCustomEvent(EventType.CHANGE_LEVEL, { detail });
  };

  #handleRestartLevel = () => {
    const value = this.#inputElement.getProperty(Attributes.VALUE);
    const options = getRestartOptions(value, false);
    this.dispatchCustomEvent(EventType.RESTART_LEVEL, options);
  };

  #handleInputChange = (event) => {
    const value = normalizeValue(event.target);
    const options = getRestartOptions(value, false);
    this.#inputElement.setProperty(Attributes.VALUE, value);
    this.dispatchCustomEvent(EventType.RESTART_LEVEL, options);
  };
}

export default Controls;
