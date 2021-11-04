// Import the Player class
import {Player} from '../src/main';

// Import the test JSON data
import * as data from './data.json';

document.body.addEventListener('keydown', () => {
  console.debug(`[Experiment] Keydown event @ ${Date.now()}`);
});

document.body.addEventListener('click', (e) => {
  console.debug(`[Experiment] Click event @ ${Date.now()}: ` +
    `${e.clientX},${e.clientY}`);
  console.debug(e);
});

// Configure the Player class and feed it the JSON data
const player = new Player(data, '.jspsych-display-element', 100);

window.onload = () => {
  player.start();
};

