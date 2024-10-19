export interface ITimerInputEvent {
  event: KeyboardEvent | FocusEvent;
  timePart: "minutes" | "seconds";
}
