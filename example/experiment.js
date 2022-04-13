// Import the Player class
import { Player, Capture } from "../src";

// Import the test JSON data
import * as data from "./data.json";

const replay = true;

// Configure the Player class and feed it the JSON data
const autoplayer = new Player(data, 1);
const capture = new Capture();

window.onload = () => {
  if (replay) {
    autoplayer.start();
  } else {
    capture.start();
    setTimeout(capture.stop.bind(capture), 15000);
  }
};
