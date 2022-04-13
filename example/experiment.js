// Import the Player class
import { Player, Capture } from "../src";

// Import the test JSON data
import * as data from "./data.json";

// Use this to toggle playing or capturing data
const replay = true;

// Configure the Player class and feed it the JSON data
const player = new Player(data, 1);
const capture = new Capture();

window.onload = () => {
  if (replay) {
    player.start();
  } else {
    capture.start();

    // End capture after 15 seconds
    setTimeout(capture.stop.bind(capture), 15000);
  }
};
