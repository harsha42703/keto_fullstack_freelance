import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./Context/userContext";
import { router } from "./routes";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UserProvider>
      {/* <RouterProvider router={router} /> */}
      <App />
    </UserProvider>
  </React.StrictMode>
);
