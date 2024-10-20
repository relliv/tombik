export interface ICalendarHeatmapOptions {
  type: "weekly" | "monthly" | "yearly";
  startDate: string;
  cellSize?: number;
}
