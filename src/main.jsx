import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "@lingui/react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/index.css";
import App from "./App.jsx";
import { i18n } from "@lingui/core";
import { activateLocale, getInitialLocale } from "./i18n";

async function bootstrapApp() {
  await activateLocale(getInitialLocale());

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <I18nProvider i18n={i18n}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </I18nProvider>
    </StrictMode>
  );
}

bootstrapApp();
