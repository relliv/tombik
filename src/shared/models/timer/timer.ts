export interface ITimerInputEvent {
  event: KeyboardEvent | FocusEvent;
  timePart: "minutes" | "seconds";
}

export enum IFinishReason {
  STOPPED = "stopped",
  FINISHED = "finished",
}
