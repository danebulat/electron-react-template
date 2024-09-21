import { HashRouter, Route, Routes } from "react-router-dom";
import App from "./App";

const RouterInner = () => {
  return (
    <Routes>
      <Route path={'/'} element={<App />} />
      <Route path={'/tabs'} element={<App />} />
    </Routes>
  );
};

export const Router = () => (
  <HashRouter basename="/">
    <RouterInner />
  </HashRouter>
);