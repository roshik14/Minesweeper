import EndGameState from '../enums/end-state';

import win from '../../assets/sound/win.mp3';
import lose from '../../assets/sound/lose.mp3';
import click from '../../assets/sound/click.mp3';
import mark from '../../assets/sound/mark.mp3';

const GameEndSrcs = Object.fromEntries([
  [EndGameState.WIN, win],
  [EndGameState.LOSE, lose],
]);

const VOLUME_DEFAULT = 0.5;

const audio = new Audio();
audio.volume = VOLUME_DEFAULT;

const SoundManager = {
  playOpenCellSound: () => {
    audio.src = click;
    audio.play().catch(() => {});
  },

  playMarkCellSound: () => {
    audio.src = mark;
    audio.play().catch(() => {});
  },

  playEndGameSound: (endGameState) => {
    audio.src = GameEndSrcs[endGameState];
    audio.play().catch(() => {});
  },

  stopEndGameSound: () => {
    if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  },

  turnVolume: () => {
    audio.volume = !audio.volume ? VOLUME_DEFAULT : 0;
  },
};

export default SoundManager;
