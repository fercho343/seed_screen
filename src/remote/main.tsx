import React from "react";
import ReactDOM from "react-dom/client";
import "../global.css";
import { RemoteApp } from "./RemoteApp";

// biome-ignore lint/style/noNonNullAssertion: false positive
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RemoteApp />
	</React.StrictMode>,
);
