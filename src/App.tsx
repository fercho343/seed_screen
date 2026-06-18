import { LeftSidebar } from "@/components/layout/left-sidebar";
import { PreviewPanel } from "@/components/layout/preview-panel";
import { ServiceList } from "@/components/layout/service-list";
import { TopBar } from "@/components/layout/top-bar";

function App() {
	return (
		<div className="dark flex h-screen flex-col overflow-hidden bg-app text-foreground">
			<TopBar />
			<div className="flex flex-1 gap-0.5 overflow-hidden bg-background p-0.5">
				<LeftSidebar />
				<ServiceList />
				<PreviewPanel />
			</div>
		</div>
	);
}

export default App;
