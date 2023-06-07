const DEFAULT_TIME = 0;
const MAX_TIME = 60;
const INTERVAL = 1000;

const getTime = (number) => (number < 10 ? `0${number}` : number);

const time = {
  hours: 0,
  minutes: 0,
  seconds: 0,

  reset() {
    this.hours = DEFAULT_TIME;
    this.minutes = DEFAULT_TIME;
    this.seconds = DEFAULT_TIME;
  },

  toString() {
    return `${getTime(this.hours)}:${getTime(this.minutes)}:${getTime(this.seconds)}`;
  },
};

const timer = {
  id: 0,
};

const increaseTime = () => {
  time.seconds += 1;
  if (time.seconds === MAX_TIME) {
    time.seconds = DEFAULT_TIME;
    time.minutes += 1;
  }
  if (time.minutes === MAX_TIME) {
    time.minutes = DEFAULT_TIME;
    time.hours += 1;
  }
};

const start = () => {
  timer.id = setInterval(increaseTime, INTERVAL);
};

const stop = () => {
  clearInterval(timer.id);
};

const reset = () => {
  clearInterval(timer.id);
  time.reset();
};

const load = (timeObj) => {
  time.hours = timeObj.hours;
  time.minutes = timeObj.minutes;
  time.seconds = timeObj.seconds;
};

const seconds = () => time.hours * 3600 + time.minutes * 60 + time.seconds;

const Timer = {
  start,
  stop,
  reset,
  data: () => time.toString(),
  seconds,
  load,
  getTime: () => time,
  INTERVAL,
};

export default Timer;
