import { useEffect, useState } from "react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { PreviewPanel } from "@/components/layout/preview-panel";
import { ServiceList } from "@/components/layout/service-list";
import { TopBar } from "@/components/layout/top-bar";
import { SettingsModal } from "@/components/settings/settings-modal";
import { applyTheme } from "@/lib/themes";

function App() {
	const [settingsOpen, setSettingsOpen] = useState(false);

	useEffect(() => {
		window.electronAPI.settingsGetAll().then(({ theme }) => applyTheme(theme));
		window.electronAPI.onOpenSettings(() => setSettingsOpen(true));
		return () => {
			window.ipcRenderer.removeAllListeners("open-settings");
		};
	}, []);

	return (
		<div
			id="app-root"
			className="dark flex h-screen flex-col overflow-hidden bg-app text-foreground"
		>
			<TopBar />
			<div className="flex flex-1 gap-0.5 overflow-hidden bg-background p-0.5">
				<LeftSidebar />
				<ServiceList />
				<PreviewPanel />
			</div>
			<SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
		</div>
	);
}

export default App;
