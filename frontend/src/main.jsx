import "./index.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import ChatProvider from "./Context/ChatProvider.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);
