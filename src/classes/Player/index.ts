// Classes
import { PlayerEvent } from "../PlayerEvent";

// Logging library
import consola from "consola";

/**
 * @summary Player class for running the re-enactment
 */
export class Player {
  // Data
  private data: CaptureData;
  private configuration: CaptureData["configuration"];
  private events: CaptureData["events"];

  // Rescaling
  private captureDimensions: [number, number];
  private targetDimensions: [number, number];

  // Target HTMLElement
  private targetSelector: string;
  private target: HTMLElement;

  // Tick and rate
  private rate: number;
  private ticks: 0;
  private ticker: number;

  // Start times
  private startTime: number;

  // Store any visual playback features
  private mouseMarker: HTMLElement;
  private pathMarkers: HTMLElement[];
  private clickMarkers: HTMLElement[];
  private maxMarkers: 10;

  /**
   * Default constructor for the Player class.
   * @param {string} _data Object containing all the collected data
   * used to replay the participant actions
   * @param {number} _rate Tick rate to use for performing the actions.
   * Measured using milliseconds. Default is 1 millisecond tick
   * interval.
   * @class
   */
  constructor(_data: CaptureData, _rate = 1) {
    // Setup the tick rate
    this.rate = _rate;
    this.ticks = 0;

    // Load and cleanse the data
    this.data = _data;
    this.configuration = this.data["configuration"];
    this.events = this.data["events"];
    this.targetSelector = this.configuration["target"];
    this._cleanse();

    // General setup of screen and layout
    this._setup();
  }

  /**
   * Conduct any required setup
   */
  private _setup(): void {
    // Get the capture dimensions
    this.captureDimensions = [
      this.configuration["viewport"]["width"],
      this.configuration["viewport"]["height"],
    ];

    // Store the target
    this.target = document.querySelector(this.targetSelector);
    if (this.target === null) {
      consola.warn(
        `Target '${this.targetSelector}' not found, ` +
          `defaulting to 'document.body'`
      );
      this.target = document.body;
    }
  }

  /**
   * Data cleansing and normalizing method
   */
  private _cleanse(): void {
    // Perform important data cleaning
    // Normalise timing information to round down to nearest millisecond
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const timestamp = event["time"];
      event["time"] = Math.round(timestamp);
    }
  }

  /**
   * Method called each tick in the window interval.
   */
  private _tick(): void {
    this.ticks++;

    // Calculate the delta
    const delta = performance.now() - this.startTime;

    // Get and check the most recent event
    if (this.events.length > 0) {
      const eventTime = this.events[0]["time"];

      if (eventTime <= delta) {
        // Pop and perform the event if the time has elapsed
        const _event = new PlayerEvent(this.events.shift());
        this._perform(_event);

        // Clean up any extra markers if required
        if (this.clickMarkers.length > this.maxMarkers) {
          while (this.clickMarkers.length > this.maxMarkers) {
            const marker = this.clickMarkers.shift();
            marker.remove();
          }
        }
      }
    } else {
      // Stop playing the game
      this.stop();
    }
  }

  /**
   * Start the Player routine
   */
  public start(): void {
    this.startTime = performance.now();
    consola.info(`[Player] Playback started after ${this.startTime}ms`);

    // Instantiate the collection of mouse markers
    this.clickMarkers = [];
    this.pathMarkers = [];
    this.maxMarkers = 10;

    // Get the target dimensions
    this.targetDimensions = [this.target.clientWidth, this.target.clientHeight];

    if (this.targetDimensions[0] > this.captureDimensions[0]) {
      consola.warn(`[Setup] Target larger than original capture screen`);
    } else {
      consola.info(`[Setup] Target smaller than original capture screen`);
    }

    // Apply scaling
    this.target.style.width = `${this.captureDimensions[0]}px`;
    this.target.style.height = `${this.captureDimensions[1]}px`;

    // Apply border to target
    this.target.style.border = "solid";

    this.ticker = window.setInterval(this._tick.bind(this), this.rate);
  }

  /**
   * Remove markers from the screen
   */
  public clean(): void {
    // Click markers
    for (const marker of this.clickMarkers) {
      marker.remove();
    }

    // Path markers
    for (const marker of this.pathMarkers) {
      marker.remove();
    }
  }

  /**
   * Halt the Player routine
   */
  public stop() {
    consola.info(`[Player] Playback finished after ${performance.now()}ms`);

    window.clearInterval(this.ticker);
  }

  /**
   * Select the appropriate function to handle the
   * PlayerEvent retrieved from the data
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _perform(_event: PlayerEvent) {
    if (_event.getType() === "keyboard") {
      this._keyboardEvent(_event);
    } else if (_event.getType() === "mouse") {
      this._mouseEvent(_event);
    } else if (_event.getType() === "click") {
      this._clickEvent(_event);
    } else {
      consola.error(`[Player] Unknown event type '${_event.getType()}'`);
    }
  }

  /**
   * Dispatch a keyboard press
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _keyboardEvent(_event: PlayerEvent) {
    consola.info(`[Player] Keyboard event @ ${performance.now()}ms`);

    // Send the event
    this.target.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: _event.getData()["key"],
      })
    );

    this.target.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: _event.getData()["key"],
      })
    );
  }

  /**
   * Dispatch mouse movement
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _mouseEvent(_event: PlayerEvent) {
    // Check if the mouse cursor has been created yet
    if (this.mouseMarker) {
      // Update the position of the mouse marker
      this.mouseMarker.style.top = `${_event.getData()["y"]}px`;
      this.mouseMarker.style.left = `${_event.getData()["x"]}px`;

      // Add and store the click indicator
      const pathMarker = this._createDot(
        _event.getData()["x"] + 5,
        _event.getData()["y"] + 5,
        "black",
        5
      );
      document.body.appendChild(pathMarker);
      this.pathMarkers.push(pathMarker);
    } else {
      // Create and add the mouse marker
      this.mouseMarker = this._createDot(
        _event.getData()["x"],
        _event.getData()["y"],
        "red"
      );
      document.body.appendChild(this.mouseMarker);
    }
  }

  /**
   * Dispatch a mouse click
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _clickEvent(_event: PlayerEvent) {
    // Click the element at the specific point
    (
      document.elementFromPoint(
        _event.getData()["x"],
        _event.getData()["y"]
      ) as HTMLElement
    ).click();

    // Add and store the click indicator
    const clickMarker = this._createDot(
      _event.getData()["x"],
      _event.getData()["y"],
      "blue"
    );
    document.body.appendChild(clickMarker);
    this.clickMarkers.push(clickMarker);
  }

  /**
   * Create and return a colored dot
   * @param {number} _x location x
   * @param {number} _y location y
   * @param {string} _fill color
   * @param {number} _radius radius of the circle
   * @return {HTMLElement}
   */
  private _createDot(
    _x: number,
    _y: number,
    _fill: string,
    _radius = 15
  ): HTMLElement {
    // Create a dot to represent the click
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.width = `${_radius}px`;
    div.style.height = `${_radius}px`;
    div.style.top = `${_y}px`;
    div.style.left = `${_x}px`;
    div.style.borderRadius = "50% 50%";
    div.style.background = _fill;
    div.style.pointerEvents = "none";

    return div;
  }
}
