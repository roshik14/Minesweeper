import Component from './components/base';
import Header from './header';
import Main from './main';
import StateManager from './state-manager';

const header = new Header();
const main = new Main();

const stateManager = new StateManager(main.gameboard, main.controls, main.display, header);
stateManager.listenGameboardEvents();
stateManager.listenControlsEvents();

Component.appendToRoot(header, main);
