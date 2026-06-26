import type {
	BibleBook,
	BibleLang,
	BibleVerse,
	MediaRecord,
	SongRecord,
} from "../../../electron/electron-env";

async function getJson<T>(url: string): Promise<T> {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`${url} -> ${res.status}`);
	return res.json() as Promise<T>;
}

export function fetchSongs(): Promise<SongRecord[]> {
	return getJson("/api/library/songs");
}

export function fetchBibleBooks(lang: BibleLang): Promise<BibleBook[]> {
	return getJson(`/api/library/bible/books?lang=${lang}`);
}

export function fetchBibleChapter(
	bookId: string,
	chapter: number,
	lang: BibleLang,
): Promise<BibleVerse[]> {
	return getJson(
		`/api/library/bible/chapter?book=${encodeURIComponent(bookId)}&chapter=${chapter}&lang=${lang}`,
	);
}

export function fetchMedia(): Promise<MediaRecord[]> {
	return getJson("/api/library/media");
}
