import { PlayerEvent } from "./PlayerEvent";

export class Player {
  // Data
  private data: JSON;
  private configuration: any;
  private events: any[];

  // Tick and rate
  private rate: number;
  private ticks: 0;
  private ticker: number;

  // Start times
  private startTime: number;

  /**
   * Default constructor for the Player class.
   * @param _data Object containing all the collected data
   * used to replay the participant actions
   * @param _rate Tick rate to use for performing the actions.
   * Measured using milliseconds. Default is 1 millisecond tick
   * interval.
   */
  constructor(_data: JSON, _rate=1) {
    // Setup the tick rate
    this.rate = _rate;
    this.ticks = 0;

    // Load and cleanse the data
    this.data = _data;
    this.configuration = this.data['configuration'];
    this.events = this.data['events'];
    this._cleanse();

    // General setup of screen and layout
    this._setup();
  }

  private _setup() {
    // Resize the window
    window.resizeTo(this.configuration['viewport']['width'], this.configuration['viewport']['height']);
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
   * @param player Instance of the Player class
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
      }
    } else {
      // Stop playing the game
      player.stop();
    }
  }

  public start() {
    this.startTime = Date.now();
    console.info(`[Player] Playback started @ ${this.startTime}`);

    this.ticker = window.setInterval(
      this._tick,
      this.rate,
      this,
    );
  }

  public stop() {
    console.info(`[Player] Playback finished @ ${Date.now()}`);

    window.clearInterval(
      this.ticker
    );
  }

  private _perform(_event: PlayerEvent) {
    if (_event.getType() === 'keyboard') {
      this._keyboardEvent(_event);
    } else if (_event.getType() === 'mouse') {
      console.debug(`[Event] Mouse movement event @ ${Date.now()}`);
    } else if (_event.getType() === 'click') {
      console.debug(`[Event] Click event @ ${Date.now()}`);
    } else {
      console.error(`[Event] Unknown event type '${_event.getType()}'`);
    }
  }

  private _keyboardEvent(_event: PlayerEvent) {
    console.debug(`[Event] Keyboard event @ ${Date.now()}`);

    // Create a new KeyboardEvent
    const _toSend = new KeyboardEvent('keydown', {
      code: 'KeyJ',
    });

    // Send the event
    document.body.dispatchEvent(_toSend);
  }
}