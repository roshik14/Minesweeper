/**
 * Event type
 * @readonly
 * @enum {String}
 */
const EventType = {
  LEFT_CLICK: 'click',
  RIGHT_CLICK: 'contextmenu',
  CHANGE: 'change',
  GAME_START: 'game-start',
  GAME_END: 'game-end',
  CHANGE_LEVEL: 'change-level',
  RESTART_LEVEL: 'restart-level',
  MARK_CELL: 'mark-cell',
  OPEN_CELL: 'open-cell',
  UNLOAD: 'unload',
  SHOW_SCORE: 'show-score',
  SWITCH_SOUND: 'switch-sound',
  SWITCH_THEME: 'change-theme',
};

export default EventType;
