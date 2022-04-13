// Classes
import { PlayerEvent } from "../PlayerEvent";

// Logging library
import consola from "consola";

/**
 * @summary Capture class that handles data capturing
 * and storage
 */
export class Capture {
  // Data storage target
  private data: PlayerEvent[];

  // Target
  private targetSelector: string;
  private target: HTMLElement | null;

  // Date information
  private startTime: number;
  private endTime: number;

  // Screen related variables
  private resolution: [number, number];

  /**
   * Default constructor
   * @param {string} _targetSelector optional CSS selector of target element
   * to observe
   * @class
   */
  constructor(_targetSelector = "body") {
    this.data = [];
    this.targetSelector = _targetSelector;

    // Store the target
    this.target = document.querySelector(this.targetSelector);
    if (this.target === null) {
      consola.warn(
        `Target '${this.targetSelector}' not found, ` +
          `defaulting to 'document.body'`
      );
      this.target = document.body;
    }

    // Initial timing values
    this.startTime = -1;
    this.endTime = -1;

    // Intitial resolution measurement
    this.resolution = [window.innerWidth, window.innerHeight];
  }

  // ---- Public methods for start and stop ----
  /**
   * Start the data capture
   */
  public start(): void {
    this._setup();

    // Record the start time
    this.startTime = performance.now();
    consola.info(`[Capture] Data capture started after ${this.startTime}ms`);

    // Record the screen area dimensions
    if (this.target !== null) {
      this.resolution = [this.target.clientWidth, this.target.clientHeight];
    }
  }

  /**
   * Stop the data capture
   */
  public stop(): void {
    this._teardown();

    // Record the end time
    this.endTime = performance.now();
    consola.info(`[Capture] Data capture finished after ${this.endTime}ms`);
  }

  /**
   * Return the capture window times
   * @return {[number, number]}
   */
  public captureTime(): [number, number] {
    return [this.startTime, this.endTime];
  }

  /**
   * Retrieve the resolution of the display
   * @return {[number, number]}
   */
  public getResolution(): [number, number] {
    return this.resolution;
  }

  /**
   * Log and store a new event
   * @param {number} _time event time
   * @param {Listeners} _type event type
   * @param {any} _data event data
   */
  private _logEvent(_time: number, _type: Listeners, _data: CoordinateData | KeyData) {
    this.data.push(
      new PlayerEvent({
        time: _time,
        type: _type,
        data: _data,
      })
    );
  }

  // ---- Setup and teardown methods ----
  /**
   * Setup the keypress and mouse handlers
   */
  private _setup(): void {
    // Setup the keypress and mouse handlers
    this._createHandler(Listeners.Click);
    this._createHandler(Listeners.Keyboard);
    this._createHandler(Listeners.Mouse);
  }

  /**
   * Teardown the keypress and mouse handlers
   */
  private _teardown(): void {
    // Remove the keypress and mouse event listeners
    document.body.removeEventListener("click", this._clickEvent.bind(this));

    document.body.removeEventListener(
      "keydown",
      this._keyboardEvent.bind(this)
    );

    document.body.removeEventListener(
      "mousemove",
      this._mouseLogger.bind(this)
    );

    // Save the data
    this._save();
  }

  /**
   * Save and download the data in JSON format
   */
  private _save() {
    // Assemble the Blob
    const blob = new Blob([
      JSON.stringify({
        configuration: {
          viewport: {
            width: this.getResolution()[0],
            height: this.getResolution()[1],
          },
          target: this.targetSelector,
        },
        events: this.data,
      }),
    ]);
    const blobURL = window.URL.createObjectURL(blob);

    // Create hidden link and click it
    const link = document.createElement("a");
    link.style.visibility = "hidden";
    link.download = `capture_${performance.now()}.json`;
    link.href = blobURL;
    link.click();
  }

  // ---- Handlers and configuration ----
  /**
   * Create a handler of a specific type of event
   * @param {Listeners} _type the type of handler
   */
  private _createHandler(_type: Listeners) {
    if (_type === Listeners.Click) {
      document.body.addEventListener("click", this._clickEvent.bind(this));
    } else if (_type === Listeners.Keyboard) {
      document.body.addEventListener("keydown", this._keyboardEvent.bind(this));
    } else if (_type === Listeners.Mouse) {
      document.body.addEventListener("mousemove", this._mouseLogger.bind(this));
    } else {
      consola.warn(`Unknown handler type '${_type}'`);
    }
  }

  /**
   * Create a new Keyboard event handler
   * @param {KeyboardEvent} _e the KeyboardEvent raised
   */
  private _keyboardEvent(_e: KeyboardEvent) {
    this._logEvent(performance.now() - this.startTime, Listeners.Keyboard, {
      key: _e.key,
    });
  }

  /**
   * Create a new Click event handler
   * @param {MouseEvent} _e the PointEvent raised
   */
  private _clickEvent(_e: MouseEvent) {
    this._logEvent(performance.now() - this.startTime, Listeners.Click, {
      x: _e.pageX,
      y: _e.pageY,
    });
  }

  /**
   * Create a new Mouse position logger
   * @param {MouseEvent} _e the MosueEvent raised
   */
  private _mouseLogger(_e: MouseEvent) {
    // Called on interval
    this._logEvent(performance.now() - this.startTime, Listeners.Mouse, {
      x: _e.pageX,
      y: _e.pageY,
    });
  }
}
