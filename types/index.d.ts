// Valid listeners for the replay library
declare enum Listeners {
  Keyboard = "keyboard",
  Mouse = "mouse",
  Click = "click",
}

// Format of the JSON data collected by the
declare type CaptureData = {
  configuration: CaptureConfiguration;
  events: CaptureEvent[];
};

declare type CaptureConfiguration = {
  viewport: {
    width: number;
    height: number;
  };
  target: string;
}

declare type CaptureEvent = {
  time: number;
  type: Listeners;
  data: CoordinateData | KeyData;
}

// Coordinates associated with mouse position and click position
declare type CoordinateData = {
  x: number;
  y: number;
};

// Keycode of the keypress associated with a keyboard event
declare type KeyData = {
  key: string;
};
