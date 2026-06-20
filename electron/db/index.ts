import path from "node:path";
import { app } from "electron";
import Database from "better-sqlite3";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { media, songs } from "./schema";

export interface SlideRecord {
	id: string;
	label: string;
	text: string;
}

export interface SongRecord {
	id: number;
	title: string;
	author: string;
	language: string;
	slides: SlideRecord[];
	createdAt: string;
	updatedAt: string;
}

export interface SongInput {
	title: string;
	author: string;
	language: string;
	slides: SlideRecord[];
}

export interface MediaRecord {
	id: number;
	type: "image" | "video";
	title: string;
	filePath: string;
	createdAt: string;
}

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
	if (dbInstance) return dbInstance;
	const dbPath = path.join(app.getPath("userData"), "seedscreen.db");
	const sqlite = new Database(dbPath);
	sqlite.pragma("journal_mode = WAL");
	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS songs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			author TEXT NOT NULL DEFAULT '',
			language TEXT NOT NULL DEFAULT 'es',
			slides TEXT NOT NULL DEFAULT '[]',
			created_at TEXT NOT NULL DEFAULT (datetime('now')),
			updated_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
		CREATE TABLE IF NOT EXISTS media (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			type TEXT NOT NULL,
			title TEXT NOT NULL,
			file_path TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
	dbInstance = drizzle(sqlite);
	return dbInstance;
}

function parseSong(row: typeof songs.$inferSelect): SongRecord {
	return {
		id: row.id,
		title: row.title,
		author: row.author,
		language: row.language,
		slides: JSON.parse(row.slides) as SlideRecord[],
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
	};
}

export function getSongs(): SongRecord[] {
	const rows = getDb().select().from(songs).orderBy(songs.title).all();
	return rows.map(parseSong);
}

export function addSong(input: SongInput): SongRecord {
	const row = getDb()
		.insert(songs)
		.values({
			title: input.title.trim(),
			author: (input.author || "").trim(),
			language: input.language || "es",
			slides: JSON.stringify(input.slides || []),
		})
		.returning()
		.get();
	return parseSong(row);
}

export function updateSong(id: number, input: SongInput): SongRecord | null {
	const row = getDb()
		.update(songs)
		.set({
			title: input.title.trim(),
			author: (input.author || "").trim(),
			language: input.language || "es",
			slides: JSON.stringify(input.slides || []),
			updatedAt: sql`(datetime('now'))`,
		})
		.where(eq(songs.id, id))
		.returning()
		.get();
	return row ? parseSong(row) : null;
}

export function deleteSong(id: number): boolean {
	getDb().delete(songs).where(eq(songs.id, id)).run();
	return true;
}

/** Insert incoming songs that aren't already present (matched by title + author). */
export function importSongs(incoming: SongInput[]): { added: number; total: number } {
	const key = (title: string, author: string) =>
		`${title.trim().toLowerCase()}::${author.trim().toLowerCase()}`;
	const existing = new Set(getSongs().map((s) => key(s.title, s.author)));
	let added = 0;
	for (const song of incoming ?? []) {
		if (!song?.title) continue;
		if (existing.has(key(song.title, song.author || ""))) continue;
		addSong({
			title: song.title,
			author: song.author || "",
			language: song.language || "es",
			slides: song.slides || [],
		});
		existing.add(key(song.title, song.author || ""));
		added++;
	}
	return { added, total: incoming?.length ?? 0 };
}

function parseMedia(row: typeof media.$inferSelect): MediaRecord {
	return {
		id: row.id,
		type: row.type === "video" ? "video" : "image",
		title: row.title,
		filePath: row.filePath,
		createdAt: row.createdAt,
	};
}

export function getMedia(): MediaRecord[] {
	const rows = getDb().select().from(media).orderBy(media.title).all();
	return rows.map(parseMedia);
}

export function addMedia(input: { type: "image" | "video"; title: string; filePath: string }): MediaRecord {
	const row = getDb()
		.insert(media)
		.values({ type: input.type, title: input.title.trim(), filePath: input.filePath })
		.returning()
		.get();
	return parseMedia(row);
}

export function deleteMedia(id: number): MediaRecord | null {
	const row = getDb().delete(media).where(eq(media.id, id)).returning().get();
	return row ? parseMedia(row) : null;
}
