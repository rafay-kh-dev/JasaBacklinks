import React from "react";
import ReactDOM from "react-dom/client";
import { useLayoutEffect } from "react";
import App from "./App.jsx";
import "./index.css"; // Make sure this line exists!

export function AppBootstrap() {
  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.style.visibility = "visible";
    }
    document.getElementById("app-prerender-loader")?.remove();
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppBootstrap />
  </React.StrictMode>,
);
