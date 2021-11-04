import {PlayerEvent} from './PlayerEvent';

const LISTENER = {
  KEYBOARD: 'keyboard',
  MOUSE: 'mouse',
  CLICK: 'click',
};

/**
 * Capture class that handles data capturing
 * and storage
 */
export class Capture {
  // Data storage target
  private data: PlayerEvent[];

  // Date information
  private startTime: number;
  private endTime: number;

  /**
   * Default constructor
   */
  constructor() {
    this.data = [];
  }

  // ---- Public methods for start and stop ----
  /**
   * Start the data capture
   */
  public start(): void {
    this._setup();

    // Record the start time
    this.startTime = Date.now();
    console.info(`Data capture started @ ${this.startTime}`);
  }

  /**
   * Stop the data capture
   */
  public stop(): void {
    this._teardown();

    // Record the end time
    this.endTime = Date.now();
  }

  /**
   * Return the capture window times
   * @return {number[]}
   */
  public captureTime() {
    return [
      this.startTime,
      this.endTime,
    ];
  }

  /**
   * Log and store a new event
   * @param {number} _time event time
   * @param {string} _type event type
   * @param {any} _data event data
   */
  private _logEvent(_time: number, _type: string, _data: any) {
    this.data.push(new PlayerEvent({
      time: Date.now(),
      type: _type,
      data: _data,
    }));
  }

  // ---- Setup and teardown methods ----
  /**
   * Setup the keypress and mouse handlers
   */
  private _setup(): void {
    // Setup the keypress and mouse handlers
  }

  /**
   * Teardown the keypress and mouse handlers
   */
  private _teardown() {
    // Teardown the keypress and mouse handlers
  }

  // ---- Handlers and configuration ----
  /**
   * Create a handler of a specific type of event
   * @param {string} _type the type of handler
   */
  private _createHandler(_type: string) {
    // Create the keypress or mouse handler
  }

  /**
   * Create a new Keyboard event handler
   */
  private _keyboardEvent() {
    // Called on a keyboard event
  }

  /**
   * Create a new Click event handler
   * @param {PointerEvent} _e the PointEvent raised
   * @param {Capture} _capture the Capture instance
   */
  private _clickEvent(_e: PointerEvent, _capture: Capture) {
    _capture._logEvent(
        Date.now(),
        LISTENER.CLICK,
        {
          x: _e.clientX,
          y: _e.clientY,
        }
    );
  }

  /**
   * Create a new Mouse position logger
   */
  private _mouseLogger() {
    // Called on interval
  }
}
