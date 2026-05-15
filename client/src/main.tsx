import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./app/providers.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import initAuth from "./app/initAuth.ts";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ui/ErrorBoundary.tsx";

initAuth(); // this is for making sure user is loggedin after refresh

<Toaster richColors position="top-right" />;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-right" />
    <AppProviders>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>

      {/* <App /> */}
    </AppProviders>
  </StrictMode>,
);
