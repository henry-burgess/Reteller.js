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

  // Mouse logger
  private mouseLogger: number;

  // Screen related variables
  private resolution: [number, number];

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

    // Record the screen area dimensions
    this.resolution = [
      window.innerWidth,
      window.innerHeight,
    ];
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
   * @return {[number, number]}
   */
  public captureTime(): [number, number] {
    return [
      this.startTime,
      this.endTime,
    ];
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
   * @param {string} _type event type
   * @param {any} _data event data
   */
  private _logEvent(_time: number, _type: string, _data: any) {
    this.data.push(new PlayerEvent({
      time: _time,
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
    this._createHandler(LISTENER.CLICK);
    this._createHandler(LISTENER.KEYBOARD);
    this._createHandler(LISTENER.MOUSE);
  }

  /**
   * Teardown the keypress and mouse handlers
   */
  private _teardown(): void {
    // Remove the keypress and mouse event listeners
    document.body.removeEventListener(
        'click',
        this._clickEvent.bind(this)
    );

    document.body.removeEventListener(
        'keydown',
        this._keyboardEvent.bind(this)
    );

    document.body.removeEventListener(
        'mousemove',
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
    const blob = new Blob([JSON.stringify(
        {
          configuration: {
            viewport: {
              width: this.getResolution[0],
              height: this.getResolution[1],
            },
          },
          events: this.data,
        }
    )]);
    const blobURL = window.URL.createObjectURL(blob);

    // Create hidden link and click it
    const link = document.createElement('a');
    link.style.visibility = 'hidden';
    link.download = `capture_${Date.now()}.json`;
    link.href = blobURL;
    link.click();
  }

  // ---- Handlers and configuration ----
  /**
   * Create a handler of a specific type of event
   * @param {string} _type the type of handler
   */
  private _createHandler(_type: string) {
    if (_type === LISTENER.CLICK) {
      document.body.addEventListener('click', this._clickEvent.bind(this));
    } else if (_type === LISTENER.KEYBOARD) {
      document.body.addEventListener('keydown', this._keyboardEvent.bind(this));
    } else if (_type === LISTENER.MOUSE) {
      document.body.addEventListener('mousemove', this._mouseLogger.bind(this));
    } else {
      console.warn(`Unknown handler type '${_type}'`);
    }
  }

  /**
   * Create a new Keyboard event handler
   * @param {KeyboardEvent} _e the KeyboardEvent raised
   */
  private _keyboardEvent(_e: KeyboardEvent) {
    this._logEvent(
        Date.now() - this.startTime,
        LISTENER.KEYBOARD,
        {
          key: _e.key,
        }
    );
  }

  /**
   * Create a new Click event handler
   * @param {MouseEvent} _e the PointEvent raised
   */
  private _clickEvent(_e: MouseEvent) {
    this._logEvent(
        Date.now() - this.startTime,
        LISTENER.CLICK,
        {
          x: _e.clientX,
          y: _e.clientY,
        }
    );
  }

  /**
   * Create a new Mouse position logger
   * @param {MouseEvent} _e the MosueEvent raised
   */
  private _mouseLogger(_e: MouseEvent) {
    // Called on interval
    this._logEvent(
        Date.now() - this.startTime,
        LISTENER.MOUSE,
        {
          x: _e.pageX,
          y: _e.pageY,
        }
    );
  }
}
