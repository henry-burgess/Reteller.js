// Import the Player class
import {Player, Capture} from '../src/Main';

// Import the test JSON data
import * as data from './data.json';

// Configure the Player class and feed it the JSON data
const player = new Player(data, '.jspsych-display-element', 100);
const capture = new Capture();

window.onload = () => {
  player.start();
  // capture.start();

  // setTimeout(() => {
  //   capture.stop();
  // }, 5000);
};

