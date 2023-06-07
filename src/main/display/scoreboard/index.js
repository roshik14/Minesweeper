import Component from '../../../components/base';
import Button from '../../../components/button';
import EventType from '../../../enums/event-type';
import Helper from '../../../helper';

import './index.scss';

const Html = {
  DIV: 'div',
  TITLE: 'h2',
  LIST: 'ul',
  LIST_ITEM: 'li',
  PARAGRAPH: 'p',
};

const Css = {
  SCORE: 'score',
  WRAPPER: 'score-wrapper',
  SHOW: 'score__show',
  TITLE: 'score-title',
  BUTTON: 'score-button',
  CONTENT_WRAPPER: 'score-content-wrapper',
  SCORE_DATA: 'score-data',
  SCORE_ITEM: 'score-data-item',
  MESSAGE: 'score-message',
  HIDE: 'score-data__hide',
};

const TITLE = 'Scoreboard';
const CLOSE_BTN = 'Close';
const MESSAGE = 'List is empty';
const STORAGE_KEY = 'roshik14-scoreboardData';

const getScoreComponents = (list) => {
  const items = list.map((obj, index) => {
    const ul = new Component(Html.LIST, Css.SCORE_DATA);
    const values = Object.values(obj).map((value) =>
      new Component(Html.LIST_ITEM, Css.SCORE_ITEM).setTextContent(value)
    );
    values.unshift(new Component(Html.LIST_ITEM, Css.SCORE_ITEM).setTextContent(index + 1));
    return ul.appendChildren(...values);
  });
  return items;
};

const createContentHeader = () => {
  const list = new Component(Html.LIST, Css.SCORE_DATA, Css.HIDE);
  const items = ['N', 'Level', 'Titans', 'Turns', 'Time'];
  const listItems = items.map((item) =>
    new Component(Html.LIST_ITEM, Css.SCORE_ITEM).setTextContent(item)
  );
  list.appendChildren(...listItems);
  return list;
};

class ScoreBoard extends Component {
  #contentHeader;

  #content;

  #message;

  #list = [];

  constructor() {
    super(Html.DIV, Css.SCORE);
    const closeBtn = new Button(CLOSE_BTN, this.hide, Css.BUTTON);
    const title = new Component(Html.TITLE, Css.TITLE).setTextContent(TITLE);
    this.#content = new Component(Html.DIV, Css.HIDE);
    this.#contentHeader = createContentHeader();
    this.#message = new Component(Html.PARAGRAPH, Css.MESSAGE).setTextContent(MESSAGE);
    const contentWrapper = new Component(Html.DIV, Css.CONTENT_WRAPPER).appendChildren(
      title,
      this.#contentHeader,
      this.#content,
      this.#message,
      closeBtn
    );
    const wrapper = new Component(Html.DIV, Css.WRAPPER).appendChildren(contentWrapper);
    this.appendChild(wrapper);
    this.addEventListener(EventType.LEFT_CLICK, this.#closeHandler);
    Component.onUnload(() => Helper.serialize(STORAGE_KEY, this));
    this.#load();
  }

  /**
   * Adds item to list in scoreboard
   * @param {{
   *  level: Level,
   *  mines: number | string,
   *  turns: number | string,
   *  time: string,
   * }} item
   */
  addItem = (item) => {
    this.#list.push(item);
    if (this.#list.length > 10) {
      this.#list.shift();
    }
    this.#updateScore();
  };

  hide = () => {
    this.removeClassList(Css.SHOW);
  };

  show = () => {
    this.addClassList(Css.SHOW);
  };

  toJSON = () => ({ list: this.#list });

  #load = () => {
    const obj = Helper.deserialize(STORAGE_KEY);
    if (!obj) {
      return;
    }
    this.#list = obj.list;
    if (this.#list.length) {
      this.#updateScore();
    }
  };

  #updateScore = () => {
    this.#content.replaceChildren(...getScoreComponents(this.#list));
    this.#content.removeClassList(Css.HIDE);
    this.#contentHeader.removeClassList(Css.HIDE);
    this.#message.addClassList(Css.HIDE);
  };

  #closeHandler = (event) => {
    if (!event.target.classList.contains(Css.SCORE)) {
      return;
    }
    event.stopImmediatePropagation();
    this.hide();
  };
}

export default ScoreBoard;
