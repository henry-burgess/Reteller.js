import {PlayerEvent} from './classes/PlayerEvent';
import {Component} from './interfaces/Component';

/**
 * Player class for running the re-enactment
 */
export class Player implements Component {
  // Data
  private data: JSON;
  private configuration: any;
  private events: any[];
  private location: string;

  // Rescaling
  private captureResolution: [number, number];
  private playerResolution: [number, number];
  private scalingWidth: number;
  private scalingHeight: number;

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
  private clickMarkers: HTMLElement[];
  private maxMarkers: 10;
  private mouseMarker: HTMLElement;

  /**
   * Default constructor for the Player class.
   * @param {any} _data Object containing all the collected data
   * used to replay the participant actions
   * @param {string} _targetSelector CSS selector of the target
   * @param {number} _rate Tick rate to use for performing the actions.
   * Measured using milliseconds. Default is 1 millisecond tick
   * interval.
   */
  constructor(_data: any, _targetSelector: string, _rate=1) {
    // Setup the tick rate
    this.rate = _rate;
    this.ticks = 0;

    // Store the target selector
    this.targetSelector = _targetSelector;

    // Load and cleanse the data
    this.data = _data;
    this.configuration = this.data['configuration'];
    this.events = this.data['events'];
    this._cleanse();

    // General setup of screen and layout
    this._setup();
  }

  /**
   * Conduct any required setup
   */
  private _setup(): void {
    // Get the capture dimensions
    this.captureResolution = [
      this.configuration['viewport']['width'],
      this.configuration['viewport']['height'],
    ];

    // Get the player dimensions
    this.playerResolution = [
      window.innerWidth,
      window.innerHeight,
    ];

    // Calculate and store the scaling width and height
    this.scalingWidth = this.playerResolution[0] / this.captureResolution[0];
    this.scalingHeight = this.playerResolution[1] / this.captureResolution[1];
  }

  /**
   * Data cleansing and normalizing method
   */
  private _cleanse(): void {
    // Perform important data cleaning
    // Normalise timing information to round down to nearest millisecond
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const timestamp = event['time'];
      event['time'] = Math.round(timestamp);
    }
  }

  /**
   * Method called each tick in the window interval.
   */
  private _tick(): void {
    this.ticks++;

    // Calculate the delta
    const delta = Date.now() - this.startTime;

    // Get and check the most recent event
    if (this.events.length > 0) {
      const eventTime = this.events[0]['time'];

      if (eventTime <= delta) {
        // Pop and perform the event if the time has elapsed
        const _event = new PlayerEvent(this.events.shift());
        this._perform(_event);

        // Clean up any extra markers if required
        if (this.clickMarkers.length > this.maxMarkers) {
          while (this.clickMarkers.length > this.maxMarkers) {
            const marker = this.clickMarkers.shift();
            document.body.removeChild(marker);
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
    this.startTime = Date.now();
    console.info(`[Player] Playback started @ ${this.startTime}`);

    // Instantiate the collection of click markers
    this.clickMarkers = [];
    this.maxMarkers = 10;

    // Store the target
    this.target = document.querySelector(this.targetSelector);
    if (this.target === null) {
      console.warn(`Target '${this.targetSelector}' not found, ` +
                    `defaulting to 'document.body'`);
      this.target = document.body;
    }

    this.ticker = window.setInterval(
        this._tick.bind(this),
        this.rate,
    );
  }

  /**
   * Halt the Player routine
   */
  public stop() {
    console.info(`[Player] Playback finished @ ${Date.now()}`);

    window.clearInterval(
        this.ticker,
    );
  }

  /**
   * Select the appropriate function to handle the
   * PlayerEvent retrieved from the data
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _perform(_event: PlayerEvent) {
    if (_event.getType() === 'keyboard') {
      this._keyboardEvent(_event);
    } else if (_event.getType() === 'mouse') {
      this._mouseEvent(_event);
    } else if (_event.getType() === 'click') {
      this._clickEvent(_event);
    } else {
      console.error(`[Event] Unknown event type '${_event.getType()}'`);
    }
  }

  /**
   * Dispatch a keyboard press
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _keyboardEvent(_event: PlayerEvent) {
    console.debug(`[Event] Keyboard event @ ${Date.now()}`);

    // Send the event
    this.target.dispatchEvent(new KeyboardEvent('keydown', {
      key: _event.getData()['key'],
    }));

    this.target.dispatchEvent(new KeyboardEvent('keyup', {
      key: _event.getData()['key'],
    }));
  }

  /**
   * Dispatch mouse movement
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _mouseEvent(_event: PlayerEvent) {
    // Check if the mouse cursor has been created yet
    if (this.mouseMarker) {
      // Update the position of the mouse marker
      this.mouseMarker.style.top =
          `${_event.getData()['y'] * this.scalingHeight}px`;
      this.mouseMarker.style.left =
          `${_event.getData()['x'] * this.scalingWidth}px`;
    } else {
      // Create and add the mouse marker
      this.mouseMarker = this._createDot(
          _event.getData()['x'] * this.scalingWidth,
          _event.getData()['y'] * this.scalingHeight,
          'red'
      );
      document.body.appendChild(this.mouseMarker);
    }
  }

  /**
   * Dispatch a mouse click
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _clickEvent(_event: PlayerEvent) {
    console.debug(`[Event] Click event @ ${Date.now()}`);

    // Click the element at the specific point
    (document.elementFromPoint(
        _event.getData()['x'] * this.scalingWidth,
        _event.getData()['y'] * this.scalingHeight) as HTMLElement).click();

    // Add and store the click indicator
    const clickMarker = this._createDot(
        _event.getData()['x'] * this.scalingWidth,
        _event.getData()['y'] * this.scalingHeight,
        'blue'
    );
    document.body.appendChild(clickMarker);
    this.clickMarkers.push(clickMarker);
  }

  /**
   * Create and return a colored dot
   * @param {number} _x location x
   * @param {number} _y location y
   * @param {string} _fill color
   * @return {HTMLElement}
   */
  private _createDot(_x: number, _y: number, _fill: string): HTMLElement {
    // Create a dot to represent the click
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '15px';
    div.style.height = '15px';
    div.style.top = `${_y}px`;
    div.style.left = `${_x}px`;
    div.style.borderRadius = '50% 50%';
    div.style.background = _fill;

    return div;
  }
}
