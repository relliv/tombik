import {
  ITaskColumn,
  TaskColumn,
} from "./../../src/shared/models/project/task.model";
import { PROJECT_BOARD_COLUMNS } from "./../../src/shared/constants/project-board.constants";
import { IBasicFolder } from "./../../src/shared/models/file/folder.model";
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Notification,
  dialog,
} from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// #region Electron Setup

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, "../..");

export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

let win: BrowserWindow | null = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");

const workspaceFilePath = path.join(
  app.getPath("userData"),
  "current-user-workspace.json"
);

async function selectWorkspaceDirectory() {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    fs.writeFileSync(
      workspaceFilePath,
      JSON.stringify({ workspace: selectedPath }, null, 2)
    );
    return selectedPath;
  }
  return null;
}

function getSavedWorkspaceDirectory() {
  if (fs.existsSync(workspaceFilePath)) {
    const data = fs.readFileSync(workspaceFilePath, "utf-8");
    return JSON.parse(data).workspace;
  }
  return null;
}

// Function to get list of folders in the workspace directory with full path and folder name
function getFoldersInWorkspace(workspacePath: string): IBasicFolder[] {
  return fs
    .readdirSync(workspacePath)
    .filter((file) => {
      return fs.statSync(path.join(workspacePath, file)).isDirectory();
    })
    .map(
      (folder: string) =>
        ({
          fullPath: path.join(workspacePath, folder),
          name: folder,
        } as IBasicFolder)
    );
}

// Function to create a new project folder in the workspace directory
function createNewProjectFolder(projectName: string) {
  const workspaceDirectory = getSavedWorkspaceDirectory();
  if (workspaceDirectory) {
    const newProjectPath = path.join(workspaceDirectory, projectName);
    if (!fs.existsSync(newProjectPath)) {
      fs.mkdirSync(newProjectPath);
      return true;
    }
  }
  return false;
}

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(__dirname, "/public/assets/images/logos/app-icon.ico"),
    // icon: path.join(__dirname, "public/assets/images/logos/app-icon.ico"),
    minHeight: 800,
    minWidth: 500,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    // #298
    win.loadURL(VITE_DEV_SERVER_URL);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  setupWindowControls();
}

function setupWindowControls() {
  ipcMain.on("window-minimize", () => win.minimize());
  ipcMain.on("window-maximize", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on("window-close", () => win.close());

  ipcMain.handle("is-window-maximized", () => win.isMaximized() ?? false);

  win.on("maximize", () => {
    win.webContents.send("window-maximized-change", true);
  });

  win.on("unmaximize", () => {
    win.webContents.send("window-maximized-change", false);
  });

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

// #endregion

// #region App APIs

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

// #endregion

// #region App Events

app.whenReady().then(async () => {
  let workspaceDirectory = getSavedWorkspaceDirectory();
  if (!workspaceDirectory) {
    workspaceDirectory = await selectWorkspaceDirectory();
  }

  if (workspaceDirectory) {
    console.log("Workspace Directory:", workspaceDirectory);
    // You can now use this directory in your application logic
  }

  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// #endregion

// #region App Specific APIs

ipcMain.handle(
  "save-project-board-data",
  async (_, projectPath: string, columns: string) => {
    const boardPath = path.join(projectPath, "tasks.json");

    fs.writeFileSync ? fs.writeFileSync(boardPath, columns) : null;

    return true;
  }
);

ipcMain.handle("get-workspace-folders", async () => {
  const workspaceDirectory = getSavedWorkspaceDirectory();
  if (workspaceDirectory) {
    return getFoldersInWorkspace(workspaceDirectory);
  }
  return [];
});

ipcMain.handle("create-new-project", async (_, projectName) => {
  return createNewProjectFolder(projectName);
});

ipcMain.handle("get-project-board-data", async (_, projectPath: string) => {
  const boardPath = path.join(projectPath, "tasks.json");

  if (!fs.existsSync(boardPath)) {
    const emptyProject = PROJECT_BOARD_COLUMNS.map((columnName: string) => {
      return new TaskColumn({
        title: columnName,
      });
    });

    fs.writeFileSync
      ? fs.writeFileSync(boardPath, JSON.stringify(emptyProject, null, 2))
      : null;

    return emptyProject;
  }

  const boardData = await fs.promises.readFile(boardPath, "utf-8");

  return JSON.parse(boardData);
});

ipcMain.on("show-notification", (event, { title, message }) => {
  const notification = new Notification({ title, body: message });

  notification.show();
});

// #endregion
