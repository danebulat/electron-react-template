import { API } from "src/preload";

declare global {
  interface Window {
    myAPI: typeof API;
  }
}

export {};
