import { LeftSidebar } from "@/components/layout/left-sidebar";
import { PreviewPanel } from "@/components/layout/preview-panel";
import { ServiceList } from "@/components/layout/service-list";
import { TopBar } from "@/components/layout/top-bar";

function App() {
	return (
		<div className="dark flex h-screen flex-col overflow-hidden bg-background text-foreground">
			<TopBar />
			<div className="flex flex-1 gap-[3px] overflow-hidden p-[3px]">
				<LeftSidebar />
				<ServiceList />
				<PreviewPanel />
			</div>
		</div>
	);
}

export default App;
