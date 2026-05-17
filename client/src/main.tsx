import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppProviders } from "./app/providers.tsx";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import initAuth from "./app/initAuth.ts";
import { Toaster } from "sonner";
import ErrorBoundary from "./components/ui/ErrorBoundary.tsx";

void initAuth().finally(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <Toaster richColors position="top-right" />
      <AppProviders>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </AppProviders>
    </StrictMode>,
  );
});
