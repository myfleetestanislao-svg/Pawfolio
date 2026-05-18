import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@/lib/router";
import App from "./App.jsx";
import "@/components/styles/globals.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </React.StrictMode>
);
