import { Loader } from "./Loader";

export class Player {
  private loader: Loader;

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

  constructor(_data: JSON, _rate=1) {
    this.loader = new Loader();

    // Setup the tick rate
    this.rate = _rate;
    this.ticks = 0;

    // Load and cleanse the data
    this.data = _data;
    this.configuration = this.data['configuration'];
    this.events = this.data['events'];
    this._cleanse();
  }

  private _cleanse() {
    // Perform important data cleaning
    // Normalise timing information to round down to nearest millisecond
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const timestamp = event['time'];
      event['time'] = Math.round(timestamp);
    }
  }

  private _tick(player: Player) {
    player.ticks++;

    // Calculate the delta
    const delta = Date.now() - player.startTime;

    // Get and check the most recent event
    if (player.events.length > 0) {
      const eventTime = player.events[0]['time'];

      if (eventTime <= delta) {
        // Pop and perform the event if the time has elapsed
        const _event = player.events.shift();
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

  private _perform(_event: any) {
    if (_event.type === 'keyboard') {
      console.debug(`[Event] Keyboard event @ ${Date.now()}`);
    } else if (_event.type === 'mouse') {
      console.debug(`[Event] Mouse movement event @ ${Date.now()}`);
    } else if (_event.type === 'click') {
      console.debug(`[Event] Click event @ ${Date.now()}`);
    } else {
      console.error(`[Event] Unknown event type '${_event.type}'`);
    }
  }
}