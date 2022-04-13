# Reteller.js

A simple, lightweight library to record and replay interactions on a web page, targeting a specific element. Reteller aims to make data capture and data replay as accurate and reproducible as possible while maintaining simplicity and extensibility.

The primary use case of Reteller is JavaScript-based behavioural or cognitive experiments that require input from participants. It allows researchers to view, in real time, exactly what participants observed and how they responded.

## Features

### Data capture 🎥

Reteller will capture basic input from the user as they interact with the web page. Reteller uses a coordinate-based system to capture the following data points:

- Mouse movements, storing `x` and `y` coordinates
- Mouse clicks, storing `x` and `y` coordinates

Additionally, Reteller captures all keyboard input. Reteller stores all this information in real-time, meaning that all actions can be replayed in real-time.

Reteller stores data in JSON format, exported when data capture is terminated.

### Data replay 🔁

Aside from capturing data, Reteller can replay existing data. Using the `Player` class, Reteller can replicate all actions stored in exsting data in real-time at the exact resolution and appearance that the user experienced.

## Usage

It is strongly advised to use a tool such as [Parcel](https://parceljs.org) to bundle and serve the tool alongside another .

### Installation

Reteller is still in early development stages and is not yet available on package managers.

<!-- Use NPM or Yarn:

```bash
$ npm install --save reteller.js
...
```

```bash
$ yarn add reteller.js
...
``` -->

### `Capture`

Import the `Capture` class and create a new instance:

```JavaScript
import { Capture } from 'reteller.js';

const capture = new Capture();
```

Start and end the capture as required:

```JavaScript
capture.start();
// ...
capture.stop();
```

A JSON file containing the captured data will be automatically downloaded.

### `Player`

Import the `Player` class and import JSON data to be replayed:

```JavaScript
import { Player } from 'reteller.js';
import * as data from './data.json';
```

Create an instance of the `Player` class with the JSON data:

```JavaScript
const player = new Player(data);

player.start(); // Start the player
```
