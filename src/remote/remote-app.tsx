import { useEffect, useMemo, useRef, useState } from "react";
import type { SlideBackground } from "@/lib/slide-settings";
import { BottomNav, type RemoteTab } from "./components/bottom-nav";
import { TopBar } from "./components/top-bar";
import { send, useRemoteState } from "./lib/remote-api";
import { settingsFor } from "./lib/preview-settings";
import { ControlPage, type NextSlideInfo } from "./pages/control-page";
import { LibraryPage } from "./pages/library-page";
import { ServicePage } from "./pages/service-page";
import { SettingsPage } from "./pages/settings-page";

export function RemoteApp() {
	const { state, connected } = useRemoteState();
	const [activeTab, setActiveTab] = useState<RemoteTab>("control");
	const [confirmToggle, setConfirmToggle] = useState(false);
	const confirmTimerRef = useRef<number | null>(null);

	const background: SlideBackground = useMemo(
		() => ({
			id: "remote",
			label: "",
			...(state?.background ?? { type: "color", value: "#000000" }),
		}),
		[state?.background],
	);
	const settings = useMemo(() => settingsFor(background), [background]);

	const liveItem = state?.items.find((i) => i.scheduleId === state.liveItemId);
	const showsLiveSlides = !!state && state.selectedItemId === state.liveItemId;
	const liveIdx = useMemo(
		() => (showsLiveSlides && state ? state.slides.findIndex((s) => s.id === state.liveSlideId) : -1),
		[showsLiveSlides, state],
	);

	// Keep the live item's slides loaded while on the Control tab so the
	// preview/slide-counter/up-next logic below always has fresh data.
	useEffect(() => {
		if (activeTab === "control" && state?.liveItemId && state.selectedItemId !== state.liveItemId) {
			send({ type: "selectItem", itemId: state.liveItemId });
		}
	}, [activeTab, state?.liveItemId, state?.selectedItemId]);

	// Next slide: if last slide of the current item → show the next item's first slide.
	const nextSlide = useMemo<NextSlideInfo | null>(() => {
		if (!state || !state.liveItemId) return null;
		if (!showsLiveSlides || state.slides.length === 0 || liveIdx === -1) return null;

		if (liveIdx < state.slides.length - 1) {
			return { slide: state.slides[liveIdx + 1], fromItem: null };
		}

		const liveItemIdx = state.items.findIndex((i) => i.scheduleId === state.liveItemId);
		const nextItem = state.items[liveItemIdx + 1];
		if (nextItem) {
			return { slide: { text: nextItem.previewText, label: nextItem.title }, fromItem: nextItem };
		}
		return null;
	}, [state, showsLiveSlides, liveIdx]);

	function handleToggleOutputTap() {
		if (confirmToggle) {
			if (confirmTimerRef.current) window.clearTimeout(confirmTimerRef.current);
			setConfirmToggle(false);
			send({ type: "toggleOutput" });
			return;
		}
		setConfirmToggle(true);
		confirmTimerRef.current = window.setTimeout(() => setConfirmToggle(false), 2200);
	}

	return (
		<div className="dark min-h-screen bg-app text-foreground">
			<TopBar
				title={!connected ? "Reconnecting..." : liveItem ? liveItem.title : "No signal"}
				connected={connected}
				outputOpen={!!state?.outputOpen}
				confirmToggle={confirmToggle}
				onToggleOutput={handleToggleOutputTap}
			/>

			<main className="min-h-screen pt-14 pb-16">
				{activeTab === "control" && (
					<ControlPage state={state} liveItem={liveItem} nextSlide={nextSlide} settings={settings} />
				)}
				{activeTab === "library" && <LibraryPage />}
				{activeTab === "service" && <ServicePage state={state} settings={settings} />}
				{activeTab === "settings" && (
					<SettingsPage
						connected={connected}
						state={state}
						confirmToggle={confirmToggle}
						onToggleOutput={handleToggleOutputTap}
					/>
				)}
			</main>

			<BottomNav active={activeTab} onChange={setActiveTab} />
		</div>
	);
}
