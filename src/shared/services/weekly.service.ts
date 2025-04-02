import { IBasicFolder } from "../models/file/folder.model";

export default class WeeklyService {
  public static async loadWeeklyYearFolders(): Promise<IBasicFolder[]> {
    return await (window as any).ipcRenderer.getWeeklyYearFolders();
  }

  public static async loadWeeklyYearFolder(
    year: string
  ): Promise<IBasicFolder> {
    return await (window as any).ipcRenderer.getWeeklyYearFolder(year);
  }
}
