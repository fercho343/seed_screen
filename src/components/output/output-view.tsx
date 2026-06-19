import { useEffect, useState } from "react";

export function OutputView() {
	const [text, setText] = useState<string | null>(null);

	useEffect(() => {
		window.electronAPI.onShowText((t) => setText(t));
		window.electronAPI.onGoBlack(() => setText(null));
	}, []);

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-black p-20">
			{text && (
				<p className="whitespace-pre-wrap text-center text-5xl leading-snug font-bold text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)]">
					{text}
				</p>
			)}
		</div>
	);
}
