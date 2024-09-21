// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { PreloadAPI } from "./types/preload";

export const API: PreloadAPI = {
  getVersionInfo: async () =>
    await ipcRenderer.invoke('main:getVersionInfo'),

  changeTab: (tabId: number) =>
    ipcRenderer.send('main:changeTab', tabId),
}

contextBridge.exposeInMainWorld('myAPI', API);
