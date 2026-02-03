import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import App from "./App.jsx";
import Router from "./Router.jsx";
import "./assets/scss/all.scss";
import "bootstrap";
import { HashRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 全域 Toast 掛載 */}
    <Toaster position="top-right" />
    <HashRouter>
      <Router />
    </HashRouter>
  </StrictMode>,
);
