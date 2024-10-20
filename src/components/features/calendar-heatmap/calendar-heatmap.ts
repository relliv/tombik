import { DateTime } from "luxon";

export interface IHeatmapDay {
  date: DateTime;
  count: number;
}

export interface ICalendarHeatmapOptions {
  type: "weekly" | "monthly" | "yearly";
  startDate: string;
  cellSize?: number;

  onClick?: (day: IHeatmapDay) => void;
}
