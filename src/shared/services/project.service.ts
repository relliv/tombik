import { IBasicFolder } from "../models/file/folder.model";

export class ProjectService {
  public static async loadProjectFolders(): Promise<IBasicFolder[]> {
    return await (window as any).ipcRenderer.getWorkspaceFolders();
  }
}
