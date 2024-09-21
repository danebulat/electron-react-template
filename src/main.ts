import { app, BrowserWindow, ipcMain, BaseWindow, WebContentsView } from 'electron';
import path from 'path';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

/// Loads the correct route for the view.
const loadPage = (view: WebContentsView, route: string) => {
  MAIN_WINDOW_VITE_DEV_SERVER_URL
    ? view.webContents.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/#/${route}`)
    : view.webContents.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html#${route}`)
    );
};

/// Sets up the main window and child views.
const createWebContentsView = () => {
  const win = new BaseWindow({ width: 800, height: 400 });
  const webPreferences = { preload: path.join(__dirname, 'preload.js') };

  const view1 = new WebContentsView({ webPreferences });
  view1.setBounds({ x: 0, y: 50, width: 800, height: 350 });
  loadPage(view1, '');

  const view2 = new WebContentsView({ webPreferences });
  view2.setBounds({ x: 0, y: 0, width: 800, height: 50 });
  loadPage(view2, 'tabs');

  win.contentView.addChildView(view1);
  win.contentView.addChildView(view2);

  win.on('resize', () => {
    const { width, height } = win.getContentBounds();
    view1.setBounds({ x: 0, y: 50, width, height: Math.max(height - 50, 0) });
    view2.setBounds({ x: 0, y: 0, width, height: 50 });
  });

  view2.webContents.openDevTools();
};

/// When ready.
app.whenReady().then(() => {
  ipcMain.handle('main:getVersionInfo', async (): Promise<string> => {
    const vnode = process.versions['node'];
    const velectron = process.versions['electron'];
    const vchrome = process.versions['chrome'];

    return `Node: ${vnode} - Electron: ${velectron} - Chrome: ${vchrome}`;
  });

  createWebContentsView();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWebContentsView();
  }
});
