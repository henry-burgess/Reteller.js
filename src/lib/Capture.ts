export class Capture {
  // Data storage target
  private dataframe: any;

  // Date information
  private startTime: number;
  private endTime: number;

  constructor() {
    this.dataframe = {};
  }

  // ---- Public methods for start and stop ----
  public start() {
    this._setup();

    // Record the start time
    this.startTime = Date.now();
    console.info(`Data capture started @ ${this.startTime}`);
  }

  public stop() {
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
    ]
  }

  // ---- Setup and teardown methods ----
  private _setup() {
    // Setup the keypress and mouse handlers
  }

  private _teardown() {
    // Teardown the keypress and mouse handlers
  }

  // ---- Handlers and configuration ----
  private _createHandler(_type: string) {
    // Create the keypress or mouse handler
  }

  private _keyboardEvent() {
    // Called on a keyboard event
  }

  private _mouseEvent() {
    // Called on a mouse event
  }

  private _mouseLogger() {
    // Called on interval
  }
}