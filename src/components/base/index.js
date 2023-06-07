import EventType from '../../enums/event-type';
import './index.scss';

const Html = {
  BODY: 'body',
};

const Css = {
  ROOT: 'root',
  LIGHT: 'root__light',
};

const getRoot = () => {
  const root = document.querySelector(Html.BODY);
  root.classList.add(Css.ROOT);
  return root;
};

/**
 * Represents base class for all components
 */
class Component {
  /**
   * @field
   * @type {HTMLElement}
   */
  static #root = getRoot();

  /**
   * @field
   * @type {HTMLElement}
   */
  #element;

  /**
   * @field
   * @type {Component[]}
   */
  #children = [];

  get children() {
    return this.#children;
  }

  get lastChild() {
    return this.#element.lastChild;
  }

  /**
   * Construct Component with passed HTML tag and CSS classes
   * @param {string} tag
   * @param  {...string} classList
   */
  constructor(tag, ...classList) {
    this.#element = document.createElement(tag);
    this.#element.classList.add(...classList);
  }

  /**
   * Return elements attribute's value with passed key
   *@param {string} key
   @returns {string} value
   */
  getAttribute = (key) => this.#element.getAttribute(key);

  /**
   * Sets attribute of passed key with passed value
   * @param {string} key
   * @param {string} value
   * @returns {Component} this
   */
  setAttribute = (key, value) => {
    this.#element.setAttribute(key, value);
    return this;
  };

  /**
   * Sets property 'key' to Component with passed value
   * @param {string} key
   * @param {any} value
   */
  setProperty = (key, value) => {
    this.#element[key] = value;
    return this;
  };

  /**
   * Returns property value of passed key
   * @param {string} key
   * @returns {any} value
   */
  getProperty = (key) => this.#element[key];

  /**
   * Remove attribute from component
   * @param {string} key
   */
  removeAttribute = (key) => {
    this.#element.removeAttribute(key);
    return this;
  };

  /**
   * Sets attributes from passed object key values
   * @param {{}} attributes Object with key-value attributes
   * @returns {Component} this
   */
  setManyAttributes = (attributes) => {
    Object.keys(attributes).forEach((key) => {
      this.setAttribute(key, attributes[key]);
    });
    return this;
  };

  /**
   * Get textContent of Component
   * @returns {string} this
   */
  getTextContent = () => this.#element.textContent;

  /**
   * Set textContent in Component
   * @param {string} value
   * @returns {Component} this
   */
  setTextContent = (value) => {
    this.#element.textContent = value;
    return this;
  };

  /**
   * Append child to component
   * @param {Component} child
   */
  appendChild = (child) => {
    this.#element.appendChild(child.#element);
    this.#children.push(child);
    return this;
  };

  /**
   * Append children to component
   * @param  {...Component} children
   */
  appendChildren = (...children) => {
    this.#element.append(...children.map((c) => c.#element));
    this.#children.push(...children);
    return this;
  };

  /**
   * Replace children in component
   * @param  {...Component} children
   */
  replaceChildren = (...children) => {
    this.#element.replaceChildren(...children.map((c) => c.#element));
    this.#children = [...children];
    return this;
  };

  /**
   * Add list of css classes to component
   * @param  {...string} classList
   */
  addClassList = (...classList) => {
    this.#element.classList.add(...classList);
    return this;
  };

  /**
   * Remove list of css classes from component
   * @param  {...string} classList
   */
  removeClassList = (...classList) => {
    this.#element.classList.remove(...classList);
    return this;
  };

  /**
   * Toggle css class on component
   * @param  {string} className
   */
  toggleClass = (className) => {
    this.#element.classList.toggle(className);
    return this;
  };

  /**
   * Add listener with passed type and options to Component
   * @param {string} type
   * @param {Event} listener
   * @param {{}} options
   * @returns {Component} Current component
   */
  addEventListener = (type, listener, options) => {
    this.#element.addEventListener(type, listener, options);
    return this;
  };

  /**
   * Remove listener with passed type and options from Component
   * @param {string} type
   * @param {Event} listener
   * @param {{}} options
   * @returns {Component} Current component
   */
  removeEventListener = (type, listener, options) => {
    this.#element.removeEventListener(type, listener, options);
    return this;
  };

  /**
   * Check current Component has className or not
   * @param {string} className
   * @returns {boolean}
   */
  hasClassName = (className) => this.#element.classList.contains(className);

  /**
   * @param {EventType} type
   * @param {{}} options
   */
  dispatchCustomEvent = (type, options) => {
    this.#element.dispatchEvent(new CustomEvent(type, options));
    return this;
  };

  /**
   * Switch theme on root component
   */
  static switchTheme = () => {
    this.#root.classList.toggle(Css.LIGHT);
  };

  /**
   * Append Component to root of DOM
   * @param {...Component} components
   */
  static appendToRoot = (...components) => {
    this.#root.append(...components.map((c) => c.#element));
  };

  /**
   * Add listener on unload event
   * @param {{}} listener
   * @param {{}} options
   */
  static onUnload = (listener, options) => {
    window.addEventListener(EventType.UNLOAD, listener, options);
  };
}

export default Component;
