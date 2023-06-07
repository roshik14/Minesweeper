import Component from '../components/base';
import Wrapper from '../components/wrapper';

import './index.scss';

const TITLE_TEXT = 'Minesweeper (Attack on Titan setting)';

const Html = {
  HEADER: 'header',
  DIV: 'div',
  TITLE: 'h1',
};

const Css = {
  HEADER: 'header',
  TITLE: 'header-title',
  WRAPPER: 'header-wrapper',
  LIGHT: 'header-title__light',
};

class Header extends Component {
  #title;

  constructor() {
    super(Html.HEADER, Css.HEADER);
    this.#title = new Component(Html.TITLE, Css.TITLE, Css.LIGHT).setTextContent(TITLE_TEXT);
    const wrapper = Wrapper().appendChild(this.#title);
    this.appendChild(wrapper);
  }

  switchTheme = () => {
    this.#title.toggleClass(Css.LIGHT);
  };
}

export default Header;
