import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { OutputView } from "./components/output/output-view";
import "./global.css";

const isOutput = window.location.hash === "#output";

// biome-ignore lint/style/noNonNullAssertion: false positive
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>{isOutput ? <OutputView /> : <App />}</React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
	console.log(message);
});
