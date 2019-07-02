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
      timerOrder: ['pomodoro', 'short-break', 'pomodoro'],
      timerFinished: [],
      events: {
        timer: () => {},
        isFinished: () => {},
        modeChanged: () => {},
        start: () => {},
        pause: () => {},
        rePause: () => {}
      }
    }

    this.info = {
      activeMode: '',
      secondsPassed: 0,
      isPause: true
    };
  }

  run() {
    this.info.activeMode = this.options.timerOrder[0];
    this.info.isPause = false;

    this.options.events.start();

    setTimeout(this.doPomodoro.bind(this), 1000);
  }

  doPomodoro() {
    if (!this.info.isPause) {
      if (this.isSecondEnded) {
        if (!this.isTimerFinished) {
          this.nextMode();

          this.options.events.modeChanged(this.info.activeMode);
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

    setTimeout(this.doPomodoro.bind(this), 1000);
  }

  nextMode() {
    this.info.secondsPassed = 0;
    this.options.timerFinished.push(this.options.timerOrder[this.options.timerFinished.length]);
    this.info.activeMode = this.options.timerOrder[this.options.timerFinished.length];
  }

  destroy() {
    this.info.secondsPassed = 0;
    this.info.isPause = true;
    this.info.activeMode = this.options.timerOrder[0];
    this.options.timerFinished.length = 0;

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
    if (this.info.secondsPassed >= this.modeOptionByName.duration) {
      return true;
    }

    return false;
  }

  get isTimerFinished() {
    if (this.options.timerFinished.length + 1 >= this.options.timerOrder.length) {
      return true;
    }

    return false;
  }

  get modeOptionByName() {
    const modeOptinoName = this.modeOptionNameByName;

    return this.options[modeOptinoName];
  }

  get modeOptionNameByName() {
    switch(this.info.activeMode) {
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
    }
  }
}
