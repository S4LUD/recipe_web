import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import Dashboard from "./Dashboard.tsx";
import "./index.css";

// Wrap the rendering code in a check to ensure the root element exists
const rootElement = document.getElementById("root");
if (rootElement) {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
  ]);

  createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
} else {
  console.error(
    "Root element not found. Make sure you have an element with the ID 'root' in your HTML file."
  );
}
