import { v4 as uuidv4 } from "uuid";

export interface ITask {
  id: string;
  title: string;
  description?: string | null;
  isDone: boolean;
}

export interface ITaskColumn {
  id: string;
  title: string;
  tasks: ITask[];
}

export class Task implements ITask {
  public id!: string;
  public title!: string;
  public description?: string | null = null;
  public isDone = false;

  constructor(data: Partial<ITask> = {}) {
    Object.assign(this, data);

    if (!this.id) {
      this.id = uuidv4();
    }
  }
}

export class TaskColumn implements ITaskColumn {
  public id!: string;
  public title!: string;
  public tasks: ITask[] = [];

  constructor(data: Partial<ITaskColumn> = {}) {
    Object.assign(this, data);

    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
