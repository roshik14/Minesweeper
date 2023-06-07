import Component from '../base';
import Attributes from '../../enums/attributes';
import EventType from '../../enums/event-type';
import Helper from '../../helper';

import './index.scss';

const Html = {
  DIV: 'div',
  INPUT: 'input',
  LABEL: 'label',
  SPAN: 'span',
};

const Css = {
  SWITCH: 'switch',
  CONTAINER: 'switch-container',
  CHECKBOX: 'switch-checkbox',
  SLIDER: 'switch-slider',
};

const CHECKBOX = 'checkbox';
const STORAGE_KEY = 'roshik14-switchData';

class Switch extends Component {
  #isOn;

  /**
   * Constructs Switch-button component
   * @param {string} name
   * @param {{}} onChange
   * @param {boolean} isChecked
   */
  constructor(name, onChange, isChecked) {
    super(Html.DIV, Css.SWITCH);
    const checkbox = new Component(Html.INPUT, Css.CHECKBOX)
      .setAttribute(Attributes.TYPE, CHECKBOX)
      .addEventListener(EventType.CHANGE, (event) => {
        this.#isOn = !this.#isOn;
        onChange(event);
      });
    if (!this.#load(name)) {
      this.#isOn = isChecked;
    }
    checkbox.setProperty(Attributes.CHECKED, this.#isOn);
    const slider = new Component(Html.SPAN, Css.SLIDER);
    const label = new Component(Html.LABEL, Css.CONTAINER).appendChildren(checkbox, slider);
    this.appendChild(label);
    Component.onUnload(() => Helper.serialize(`${STORAGE_KEY}-${name}`, this));
  }

  isActive = () => this.#isOn;

  #load = (name) => {
    const obj = Helper.deserialize(`${STORAGE_KEY}-${name}`);
    if (!obj) {
      return false;
    }
    this.#isOn = obj.isOn;
    return true;
  };

  toJSON = () => ({ isOn: this.#isOn });
}

export default Switch;
