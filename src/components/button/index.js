import Component from '../base';
import EventType from '../../enums/event-type';

import './index.scss';

const Html = {
  BUTTON: 'button',
};

const Css = {
  BUTTON: 'button',
  LIGHT: 'button__light',
};

class Button extends Component {
  constructor(textContent, onClick, ...modifiers) {
    super(Html.BUTTON, Css.BUTTON, ...modifiers);
    this.setTextContent(textContent);
    this.addEventListener(EventType.LEFT_CLICK, onClick);
  }

  switchTheme = () => {
    this.toggleClass(Css.LIGHT);
  };
}

export default Button;
