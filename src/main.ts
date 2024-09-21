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
  const win = new BaseWindow({ width: 800, height: 400, backgroundColor: '#202020' });
  const webPreferences = { preload: path.join(__dirname, 'preload.js') };

  // View for local app.
  const view1 = new WebContentsView({ webPreferences });
  view1.setBounds({ x: 0, y: 50, width: 800, height: 350 });
  loadPage(view1, '');

  // View for tabs.
  const view2 = new WebContentsView({ webPreferences });
  view2.setBounds({ x: 0, y: 0, width: 800, height: 50 });
  loadPage(view2, 'tabs');

  // View for web pages.
  const view3 = new WebContentsView({ webPreferences });
  view3.setBounds({ x: 0, y: 50, width: 800, height: 350 });
  view3.webContents.loadURL('https://electronjs.org');

  // Add tabs and local app views by default;
  win.contentView.addChildView(view1);
  win.contentView.addChildView(view2);

  win.on('resize', () => {
    const { width, height } = win.getContentBounds();
    view1.setBounds({ x: 0, y: 50, width, height: Math.max(height - 50, 0) });
    view3.setBounds({ x: 0, y: 50, width, height: Math.max(height - 50, 0) });
    view2.setBounds({ x: 0, y: 0, width, height: 50 });
  });

  const removeViews = () => {
    for (const child of win.contentView.children) {
      if (child !== view2) {
        win.contentView.removeChildView(child);
      }
    }
  };

  // IPC handlers
  ipcMain.on('main:changeTab', (_, tabId: number) => {
    removeViews();

    switch (tabId) {
      case 1: {
        // Reloads the view and resets state.
        //loadPage(view1, '');

        win.contentView.addChildView(view1);
        break;
      }
      case 2: {
        view3.webContents.loadURL('https://electronjs.org');
        win.contentView.addChildView(view3);
        break;
      }
      case 3: {
        view3.webContents.loadURL('https://github.com/electron/electron');
        win.contentView.addChildView(view3);
        break;
      }
    }
  });

  // Open developer tools.
  view1.webContents.openDevTools();
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
