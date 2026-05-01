import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./app/providers.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import initAuth from "./app/initAuth.ts";

initAuth(); // this is for making sure user is loggedin after refresh
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
      {/* <App /> */}
    </AppProviders>
  </StrictMode>,
);
