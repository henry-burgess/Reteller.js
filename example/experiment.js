// Import the Player class
import {Player, Capture} from '../src/Reenact';

// Import the test JSON data
import * as data from './data.json';

// Configure the Player class and feed it the JSON data
const autoplayer = new Player(data, '.jspsych-display-content', 1);

window.onload = () => {
  autoplayer.start();
};
