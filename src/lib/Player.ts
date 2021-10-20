import { Loader } from "./Loader";

export class Player {
  private loader: Loader;

  private data: JSON;

  constructor(_data: JSON) {
    this.loader = new Loader();

    this.data = _data;
  }

  public start() {
    console.info(`Playback started @ ${Date.now()}`);
    console.debug(this.data);
  }
}