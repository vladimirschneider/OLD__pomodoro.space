export default class Pomodoro {
  constructor() {
    this.options = {
      pomodoro: {
        modeName: 'pomodoro',
        duration: 1500
      },
      shortBreak: {
        modeName: 'short-break',
        duration: 300
      },
      longBreak: {
        modeName: 'long-break',
        duration: 1800
      },
      timerOrder: ['pomodoro', 'short-break', 'pomodoro', 'short-break', 'pomodoro', 'short-break', 'pomodoro', 'long-break', 'pomodoro', 'short-break', 'pomodoro', 'short-break', 'pomodoro', 'short-break', 'pomodoro'],
      events: {
        timer: () => {},
        isFinished: () => {},
        modeChanged: () => {},
        start: () => {},
        pause: () => {},
        rePause: () => {},
        changedDuration: () => {}
      }
    }

    this.info = {
      activeMode: '',
      secondsPassed: 0,
      secondsGoal: 0,
      isPause: true,
      timerFinished: [],
      autoplay: false
    };

    this.initLocalOptions();
  }

  run() {
    this.info.activeMode = this.options.timerOrder[0];
    this.info.isPause = false;
    this.info.secondsGoal = this.getModeOptionByName().duration;

    this.options.events.start();

    setTimeout(this.doPomodoro.bind(this), 1000);
  }

  initLocalOptions() {
    const activeMode = localStorage.getItem('activeMode');
    const secondsPassed = localStorage.getItem('secondsPassed');
    const secondsGoal = localStorage.getItem('secondsGoal');
    const isPause = localStorage.getItem('isPause');
    const timerFinished = localStorage.getItem('timerFinished');
    const autoplay = localStorage.getItem('autoplay');

    if (activeMode) {
      this.info.activeMode = activeMode;
    } else {
      localStorage.setItem('activeMode', this.info.activeMode);
    }

    if (secondsPassed) {
      this.info.secondsPassed = Number(secondsPassed);
    } else {
      localStorage.setItem('secondsPassed', this.info.secondsPassed);
    }

    if (secondsGoal) {
      this.info.secondsGoal = Number(secondsGoal);
    } else {
      localStorage.setItem('secondsGoal', this.info.secondsGoal);
    }

    if (isPause) {
      this.info.isPause = isPause === 'true' ? true : false;
    } else {
      localStorage.setItem('isPause', this.info.isPause);
    }

    if (timerFinished) {
      this.info.timerFinished = JSON.parse(timerFinished);
    } else {
      localStorage.setItem('timerFinished', JSON.stringify(this.info.timerFinished));
    }

    if (autoplay) {
      this.info.autoplay = autoplay === 'true' ? true : false;
    } else {
      localStorage.setItem('autoplay', this.info.autoplay);
    }
  }

  updateLocalOptions() {
    localStorage.setItem('activeMode', this.info.activeMode);
    localStorage.setItem('secondsPassed', this.info.secondsPassed);
    localStorage.setItem('secondsGoal', this.info.secondsGoal);
    localStorage.setItem('isPause', this.info.isPause);
    localStorage.setItem('timerFinished', JSON.stringify(this.info.timerFinished));
    localStorage.setItem('autoplay', this.info.autoplay);
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
        this.updateLocalOptions();
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

    if (!this.info.autoplay) {
      this.info.isPause = true;

      this.options.events.pause();
    }

    this.updateLocalOptions();
  }

  destroy() {
    this.info.secondsPassed = 0;
    this.info.isPause = true;
    this.info.activeMode = this.options.timerOrder[0];
    this.info.timerFinished.length = 0;

    this.updateLocalOptions();

    clearTimeout(this.timer);

    this.options.events.isFinished();
  }

  pause() {
    this.info.isPause = true;
    this.options.events.pause();
    this.updateLocalOptions();
  }

  rePause() {
    this.info.isPause = false;
    this.options.events.rePause();
    this.updateLocalOptions();
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
    this.getModeOptionByName(modeName).duration = duration * 60;

    if (modeName === this.info.activeMode) {
      this.info.secondsGoal = this.getModeOptionByName(modeName).duration;
    }

    this.updateLocalOptions();

    this.options.events.changedDuration(modeName);
  }

  changeAutoplay(autoplay) {
    this.info.autoplay = autoplay;
    this.updateLocalOptions();
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
