# Reteller.js

A simple, lightweight library to record and replay interactions on a web page, targeting a specific element. Reteller aims to make data capture and data replay as accurate and reproducible as possible while maintaining simplicity and extensibility.

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

### Installation

Use NPM or Yarn:

```bash
$ npm install --save reteller.js
...
```

```bash
$ yarn add reteller.js
...
```

### `Capture`

Import the `Capture` class:

```JavaScript
import { Capture } from 'reteller.js';
```

### `Player`

Import the `Player` class:

```JavaScript
import { Player } from 'reteller.js';
```
