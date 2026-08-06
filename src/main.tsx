
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import { DemoUserProvider } from "./contexts/DemoUserContext.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <DemoUserProvider>
      <App />
    </DemoUserProvider>,
  );
