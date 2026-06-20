import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const songs = sqliteTable("songs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	author: text("author").notNull().default(""),
	language: text("language").notNull().default("es"),
	slides: text("slides").notNull().default("[]"),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(datetime('now'))`),
	updatedAt: text("updated_at")
		.notNull()
		.default(sql`(datetime('now'))`),
});

export const media = sqliteTable("media", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	type: text("type").notNull(),
	title: text("title").notNull(),
	filePath: text("file_path").notNull(),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(datetime('now'))`),
});
