'use strict';

import 'normalize.css';
import '../public/css/style.css';

import Pomodoro from './Pomodoro';

const pomodoro = new Pomodoro();

const btnRun = document.querySelector('[data-run]');
const btnPause = document.querySelector('[data-pause]');
const btnPlay = document.querySelector('[data-play]');
const btnDestroy = document.querySelector('[data-destroy]');
const label = document.querySelector('[data-label]');
const progress = document.querySelector('[data-progress]');

btnRun.addEventListener('click', () => {
  pomodoro.run();
});

btnPause.addEventListener('click', () => {
  pomodoro.pause();
});

pomodoro.on('start', () => {
  btnRun.disabled = true;
  btnPause.disabled = false;
  btnDestroy.disabled = false;

  label.innerHTML = getLabelText();
});

btnPlay.addEventListener('click', () => {
  pomodoro.rePause();
});

pomodoro.on('pause', () => {
  btnPause.disabled = true;
  btnPlay.disabled = false;
});

pomodoro.on('time', (info) => {
  progress.value = info.secondsPassed;
});

pomodoro.on('modeChanged', (modeName) => {
  label.innerHTML = getLabelText();
});

pomodoro.on('rePause', () => {
  btnPause.disabled = false;
  btnPlay.disabled = true;
});

btnDestroy.addEventListener('click', () => {
  pomodoro.destroy();
});

pomodoro.on('isFinished', () => {
  btnRun.disabled = false;
  btnPause.disabled = true;
  btnPlay.disabled = true;
  btnDestroy.disabled = true;
  progress.value = 0;
});

function getLabelText() {
  const modeOptionNameByName = pomodoro.modeOptionNameByName;
  let labelText = '';

  switch (modeOptionNameByName) {
    case 'pomodoro':
      labelText = 'Pomodoro time!'
      break;
    case 'shortBreak':
      labelText = 'do BREAK!!';
      break;
    case 'longBreak':
      labelText = 'Uh..looong break';
      break;
  }

  return labelText;
}
