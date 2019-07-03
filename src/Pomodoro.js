export default class Pomodoro {
  constructor() {
    this.options = {
      pomodoro: {
        modeName: 'pomodoro',
        duration: 5
      },
      shortBreak: {
        modeName: 'short-break',
        duration: 1
      },
      longBreak: {
        modeName: 'long-break',
        duration: 6
      },
      timerOrder: ['pomodoro', 'short-break', 'pomodoro', 'long-break'],
      events: {
        timer: () => {},
        isFinished: () => {},
        modeChanged: () => {},
        start: () => {},
        pause: () => {},
        rePause: () => {},
        changedDuration: () => {}
      },
      autoplay: false
    }

    this.info = {
      activeMode: '',
      secondsPassed: 0,
      secondsGoal: 0,
      isPause: true,
      timerFinished: []
    };
  }

  run() {
    this.info.activeMode = this.options.timerOrder[0];
    this.info.isPause = false;
    this.info.secondsGoal = this.getModeOptionByName().duration;

    this.options.events.start();

    setTimeout(this.doPomodoro.bind(this), 1000);
  }

  doPomodoro() {
    if (!this.info.isPause) {
      if (this.isSecondEnded) {
        if (!this.isTimerFinished) {
          this.nextMode();

          this.options.events.modeChanged();
        } else {
          this.destroy();
          this.options.events.isFinished();
          return;
        }
      } else {
        this.info.secondsPassed++;
      }

      this.options.events.timer(this.state);
    }

    this.timer = setTimeout(this.doPomodoro.bind(this), 1000);
  }

  nextMode() {
    this.info.secondsPassed = 0;
    this.info.timerFinished.push(this.options.timerOrder[this.info.timerFinished.length]);
    this.info.activeMode = this.options.timerOrder[this.info.timerFinished.length];
    this.info.secondsGoal = this.getModeOptionByName().duration;

    if (!this.options.autoplay) {
      this.info.isPause = true;

      this.options.events.pause();
    }
  }

  destroy() {
    this.info.secondsPassed = 0;
    this.info.isPause = true;
    this.info.activeMode = this.options.timerOrder[0];
    this.info.timerFinished.length = 0;

    clearTimeout(this.timer);

    this.options.events.isFinished();
  }

  pause() {
    this.info.isPause = true;
    this.options.events.pause();
  }

  rePause() {
    this.info.isPause = false;
    this.options.events.rePause();
  }

  get isSecondEnded() {
    if (this.info.secondsPassed >= this.info.secondsGoal) {
      return true;
    }

    return false;
  }

  get isTimerFinished() {
    if (this.info.timerFinished.length + 1 >= this.options.timerOrder.length) {
      return true;
    }

    return false;
  }

  getModeOptionByName(modeName = this.info.activeMode) {
    const modeOptinoName = this.getModeOptionNameByName(modeName);

    return this.options[modeOptinoName];
  }

  getModeOptionNameByName(modeName = this.info.activeMode) {
    switch(modeName) {
      case 'pomodoro':
        return 'pomodoro';
      case 'short-break':
        return 'shortBreak';
      case 'long-break':
        return 'longBreak';
    }
  }

  get state() {
    return this.info;
  }

  changeDuration(modeName, duration) {
    this.getModeOptionByName(modeName).duration = duration;

    if (modeName === this.info.activeMode) {
      this.info.secondsGoal = duration;
    }

    this.options.events.changedDuration(modeName);
  }

  on(event, callback) {
    switch(event) {
      case 'time':
        this.options.events.timer = callback;
        break;
      case 'isFinished':
        this.options.events.isFinished = callback;
        break;
      case 'modeChanged':
        this.options.events.modeChanged = callback;
        break;
      case 'start':
        this.options.events.start = callback;
        break;
      case 'pause':
        this.options.events.pause = callback;
        break;
      case 'rePause':
        this.options.events.rePause = callback;
        break;
      case 'changedDuration':
        this.options.events.changedDuration = callback;
        break;
    }
  }
}
