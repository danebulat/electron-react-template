export interface PreloadAPI {
  getVersionInfo: () => Promise<string>;
  changeTab: (tabId: number) => void;
}
