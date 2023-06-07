import Component from '../base';

import './index.scss';

const TAG = 'div';
const CSS = 'wrapper';

const Wrapper = () => {
  const wrapper = new Component(TAG, CSS);
  return wrapper;
};

export default Wrapper;
