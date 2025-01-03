export enum TimePart {
  MINUTES = "minutes",
  SECONDS = "seconds",
}

export interface ITimerInputEvent {
  event: KeyboardEvent;
  timePart: TimePart;
}

export interface ITimerInputChangeEvent {
  change: string;
  timePart: TimePart;
}

export enum IFinishReason {
  STOPPED = "stopped",
  FINISHED = "finished",
}
