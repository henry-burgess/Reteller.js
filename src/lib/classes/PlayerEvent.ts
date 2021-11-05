/**
 * PlayerEvent utility class to hold information
 * about an event that will be shown
 */
export class PlayerEvent {
  private time: number;
  private type: string;
  private data: any;

  /**
   * Default constructor
   * @param {any} _event type of event loaded
   * from the data
   */
  constructor(_event: {time: number, type: string, data: any}) {
    this.time = _event.time;
    this.type = _event.type;
    this.data = _event.data;
  }

  /**
   * Get the type of event
   * @return {string}
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Get the timestamp of the event
   * @return {number}
   */
  public getTime(): number {
    return this.time;
  }

  /**
   * Get any data associated with the event
   * @return {any}
   */
  public getData(): any {
    return this.data;
  }
}
