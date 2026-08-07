import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const playlists = sqliteTable("playlists", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  theme: text("theme"),
  note: text("note"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const playlistTracks = sqliteTable("playlist_tracks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  playlistId: integer("playlist_id")
    .notNull()
    .references(() => playlists.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  url: text("url"),
  position: integer("position").notNull().default(0),
});

export const beautyRoutines = sqliteTable("beauty_routines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // "skincare-morning" / "makeup-daily" など
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  note: text("note"),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const routineSteps = sqliteTable("routine_steps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  routineId: integer("routine_id")
    .notNull()
    .references(() => beautyRoutines.id, { onDelete: "cascade" }),
  position: integer("position").notNull().default(0),
  name: text("name").notNull(),
  item: text("item"),
  brand: text("brand"),
  url: text("url"),
  memo: text("memo"),
});
