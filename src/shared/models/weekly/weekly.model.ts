export interface IWeeklyTodo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWeeklyWeek {
  weekNumber: number | string;
  todos: IWeeklyTodo[];
}
