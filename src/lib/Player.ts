import {PlayerEvent} from './PlayerEvent';

/**
 * Player class for running the re-enactment
 */
export class Player {
  // Data
  private data: JSON;
  private configuration: any;
  private events: any[];

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

  /**
   * Default constructor for the Player class.
   * @param {JSON} _data Object containing all the collected data
   * used to replay the participant actions
   * @param {string} _targetSelector CSS selector of the target
   * @param {number} _rate Tick rate to use for performing the actions.
   * Measured using milliseconds. Default is 1 millisecond tick
   * interval.
   */
  constructor(_data: JSON, _targetSelector: string, _rate=1) {
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
    // Resize the window
    window.resizeTo(
        this.configuration['viewport']['width'],
        this.configuration['viewport']['height'],
    );
  }

  /**
   * Data cleansing and normalizing method
   */
  private _cleanse() {
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
   * @param {Player} player Instance of the Player class
   */
  private _tick(player: Player) {
    player.ticks++;

    // Calculate the delta
    const delta = Date.now() - player.startTime;

    // Get and check the most recent event
    if (player.events.length > 0) {
      const eventTime = player.events[0]['time'];

      if (eventTime <= delta) {
        // Pop and perform the event if the time has elapsed
        const _event = new PlayerEvent(player.events.shift());
        player._perform(_event);

        // Clean up any extra markers if required
        if (player.clickMarkers.length > player.maxMarkers) {
          while (player.clickMarkers.length > player.maxMarkers) {
            player.clickMarkers.shift();
          }
        }
      }
    } else {
      // Stop playing the game
      player.stop();
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
    // this.target = document.querySelector(this.targetSelector);
    this.target = document.body;
    if (this.target === null) {
      console.warn(`Target '${this.targetSelector}' not found, ` +
                    `defaulting to 'document.body'`);
      this.target = document.body;
    }

    this.ticker = window.setInterval(
        this._tick,
        this.rate,
        this,
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
      key: _event.getData(),
    }));
  }

  /**
   * Dispatch mouse movement
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _mouseEvent(_event: PlayerEvent) {
    console.debug(`[Event] Mouse movement event @ ${Date.now()}`);
  }

  /**
   * Dispatch a mouse click
   * @param {PlayerEvent} _event the PlayerEvent to dispatch
   */
  private _clickEvent(_event: PlayerEvent) {
    console.debug(`[Event] Click event @ ${Date.now()}`);

    // Click the element at the specific point
    (document.elementFromPoint(
        _event.getData()['x'],
        _event.getData()['y']) as HTMLElement).click();

    // Create a dot to represent the click
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '15px';
    div.style.height = '15px';
    div.style.top = `${_event.getData()['y']}px`;
    div.style.left = `${_event.getData()['x']}px`;
    div.style.borderRadius = '50% 50%';
    div.style.background = 'blue';

    // Add and store the new indicator
    document.body.appendChild(div);
    this.clickMarkers.push(div); 
  }
}
