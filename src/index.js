'use strict';

import 'normalize.css';
import '../public/css/style.css';

import dayjs from 'dayjs';
import Pomodoro from './Pomodoro';

import tomatoIcon from '../public/images/tomato.svg';
import clockIcon from '../public/images/clock.svg';
import siestaIcon from '../public/images/siesta.svg';

const pomodoro = new Pomodoro();

const btnRun = document.querySelector('[data-run]');
const btnPause = document.querySelector('[data-pause]');
const btnPlay = document.querySelector('[data-play]');
const btnDestroy = document.querySelector('[data-destroy]');
const label = document.querySelector('[data-label]');
const progress = document.querySelector('[data-progress]');
const pomodoroIcon = document.querySelector('[data-icon]');
const autoplay = document.querySelector('[data-autoplay]');

setIcon();

let d = dayjs('2000-07-08 00:00:00');
d = d.add(pomodoro.state.secondsPassed, 'second');

label.innerHTML = `
  ${getTimeFormated()}
`;

progress.max = pomodoro.state.secondsGoal;
progress.value = pomodoro.state.secondsPassed;

autoplay.checked = pomodoro.state.autoplay;

btnRun.addEventListener('click', () => {
  pomodoro.run();
});

btnPause.addEventListener('click', () => {
  pomodoro.pause();
});

btnPlay.addEventListener('click', () => {
  pomodoro.rePause();
});

btnDestroy.addEventListener('click', () => {
  pomodoro.destroy();
});

autoplay.addEventListener('input', () => {
  pomodoro.changeAutoplay(autoplay.checked);
});

const changeDurationBtn = document.querySelector('[data-changeDurationBtn]');
const namePomodoro = document.querySelector('[name="pomodoro"]');
const nameShortBreak = document.querySelector('[name="short-break"]');
const nameLongBreak = document.querySelector('[name="long-break"]');

namePomodoro.value = pomodoro.options.pomodoro.duration / 60;
nameShortBreak.value = pomodoro.options.shortBreak.duration / 60;
nameLongBreak.value = pomodoro.options.longBreak.duration / 60;

changeDurationBtn.addEventListener('click', (e) => {
  e.preventDefault();

  pomodoro.changeDuration('pomodoro', namePomodoro.value);
  pomodoro.changeDuration('short-break', nameShortBreak.value);
  pomodoro.changeDuration('long-break', nameLongBreak.value);
});

pomodoro.on('start', () => {
  btnRun.disabled = true;
  btnPause.disabled = false;
  btnDestroy.disabled = false;
  progress.max = pomodoro.state.secondsGoal;

  setIcon();

  label.innerHTML = `
    ${getTimeFormated()}
  `;
});

pomodoro.on('pause', () => {
  btnPause.disabled = true;
  btnPlay.disabled = false;
});

pomodoro.on('time', (info) => {
  progress.value = info.secondsPassed;
  if (info.secondsPassed !== 0) {
    d = d.add(1, 'second');
  }

  label.innerHTML = `
    ${getTimeFormated()}
  `;
});

pomodoro.on('modeChanged', () => {
  label.innerHTML = '';

  progress.max = pomodoro.state.secondsGoal;
  d = dayjs('2000-07-08 00:00:00');

  setIcon();

  label.innerHTML = `
    ${getTimeFormated()}
  `;
});

pomodoro.on('rePause', () => {
  btnPause.disabled = false;
  btnPlay.disabled = true;
});

pomodoro.on('isFinished', () => {
  btnRun.disabled = false;
  btnPause.disabled = true;
  btnPlay.disabled = true;
  btnDestroy.disabled = true;

  progress.value = 0;
  pomodoroIcon.src = tomatoIcon;
  d = dayjs('2000-07-08 00:00:00');
  label.innerHTML = getTimeFormated();
});

pomodoro.on('changedDuration', () => {
  progress.max = pomodoro.state.secondsGoal;
});

function setIcon() {
  let iconSrc = '';

  switch (pomodoro.state.activeMode) {
    case 'short-break':
      iconSrc = clockIcon;
      break;
    case 'long-break':
      iconSrc = siestaIcon;
      break;
    default:
      iconSrc = tomatoIcon;
      break;
  }

  pomodoroIcon.src = iconSrc;
}

function getTimeFormated() {
  const formatedTime = d.format('mm:ss');

  return formatedTime;
}
