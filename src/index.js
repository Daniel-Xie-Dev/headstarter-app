import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { StoreProvider } from "./useStore";
import { ProSidebarProvider } from "react-pro-sidebar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <ProSidebarProvider>
        <App />
      </ProSidebarProvider>
    </StoreProvider>
  </React.StrictMode>
);
