import Component from '../../../components/base';

import './index.scss';

const Html = {
  PRE: 'pre',
};

const Css = {
  MESSAGE: 'message',
  LIGHT: 'message__light',
  SHOW: 'message__show',
};

class EndMessage extends Component {
  constructor() {
    super(Html.PRE, Css.MESSAGE);
  }

  switchTheme = () => {
    this.toggleClass(Css.LIGHT);
  };

  show = () => {
    this.addClassList(Css.SHOW);
  };

  hide = () => {
    this.removeClassList(Css.SHOW);
  };
}

export default EndMessage;
