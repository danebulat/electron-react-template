import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { Tabs } from "./Tabs";

const RouterInner = () => {
  return (
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/tabs'} element={<Tabs />} />
    </Routes>
  );
};

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
);