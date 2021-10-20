// Import the Player class
import { Player } from '../src/main';

// Import the test JSON data
import * as data from './data.json';

// Configure the Player class and feed it the JSON data
const player = new Player(data, 100);
player.start();
