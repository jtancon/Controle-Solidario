import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthGoogleProvider } from "./context/authGoogle.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthGoogleProvider>
      <App />
    </AuthGoogleProvider>
  </StrictMode>
);
