export class PlayerEvent {
  private time: number;
  private type: string;
  private data: any;

  constructor(_event: any) {
    this.time = _event.time;
    this.type = _event.type;
    this.data = _event.data;
  }

  public getType(): string {
    return this.type;
  }

  public getTime(): number {
    return this.time;
  }

  public getData(): any {
    return this.data;
  }
}