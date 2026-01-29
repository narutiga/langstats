import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const guilds = sqliteTable('guilds', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ownerId: text('owner_id').notNull(),
  reportChannelId: text('report_channel_id'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const dailyStats = sqliteTable(
  'daily_stats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    guildId: text('guild_id').notNull().references(() => guilds.id),
    date: text('date').notNull(),
    memberCount: integer('member_count').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('uniq_daily_stats').on(t.guildId, t.date)]
);

export const roleStats = sqliteTable(
  'role_stats',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    guildId: text('guild_id').notNull().references(() => guilds.id),
    date: text('date').notNull(),
    roleId: text('role_id').notNull(),
    roleName: text('role_name').notNull(),
    memberCount: integer('member_count').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex('uniq_role_stats').on(t.guildId, t.date, t.roleId)]
);

export type Guild = typeof guilds.$inferSelect;
export type NewGuild = typeof guilds.$inferInsert;
export type DailyStat = typeof dailyStats.$inferSelect;
export type NewDailyStat = typeof dailyStats.$inferInsert;
export type RoleStat = typeof roleStats.$inferSelect;
export type NewRoleStat = typeof roleStats.$inferInsert;
