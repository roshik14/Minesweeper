import './index.scss';

import Component from '../components/base';
import Gameboard from './gameboard';
import Controls from './controls';
import Display from './display';
import Level from '../enums/level';
import Wrapper from '../components/wrapper';

const Html = {
  MAIN: 'main',
  DIV: 'div',
  PRE: 'pre',
};

const Css = {
  MAIN: 'main',
  MAIN_WRAPPER: 'main-wrapper',
};

class Main extends Component {
  constructor() {
    super(Html.MAIN, Css.MAIN);
    this.gameboard = new Gameboard(Level.Easy);
    this.display = new Display(this.gameboard.minesCount);
    this.controls = new Controls();
    const wrapper = Wrapper().appendChildren(this.controls, this.display, this.gameboard);
    const mainWrapper = new Component(Html.DIV, Css.MAIN_WRAPPER).appendChild(wrapper);
    this.appendChild(mainWrapper);
  }
}

export default Main;
