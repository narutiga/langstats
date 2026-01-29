import { eq, and, gte, desc } from 'drizzle-orm';
import { db } from './client.js';
import { guilds, dailyStats, roleStats } from './schema.js';
import type { NewGuild, NewDailyStat, NewRoleStat } from './schema.js';

export async function upsertGuild(guild: NewGuild): Promise<void> {
  await db
    .insert(guilds)
    .values(guild)
    .onConflictDoUpdate({
      target: guilds.id,
      set: {
        name: guild.name,
        ownerId: guild.ownerId,
      },
    });
}

export async function updateReportChannel(
  guildId: string,
  channelId: string | null
): Promise<void> {
  await db
    .update(guilds)
    .set({ reportChannelId: channelId })
    .where(eq(guilds.id, guildId));
}

export async function deleteGuild(guildId: string): Promise<void> {
  await db.delete(roleStats).where(eq(roleStats.guildId, guildId));
  await db.delete(dailyStats).where(eq(dailyStats.guildId, guildId));
  await db.delete(guilds).where(eq(guilds.id, guildId));
}

export async function getAllGuilds() {
  return db.select().from(guilds);
}

export async function getGuild(guildId: string) {
  const result = await db
    .select()
    .from(guilds)
    .where(eq(guilds.id, guildId))
    .limit(1);
  return result[0] ?? null;
}

export async function insertDailyStats(stat: NewDailyStat): Promise<void> {
  await db
    .insert(dailyStats)
    .values(stat)
    .onConflictDoNothing();
}

export async function insertRoleStats(stats: NewRoleStat[]): Promise<void> {
  if (stats.length === 0) return;
  await db
    .insert(roleStats)
    .values(stats)
    .onConflictDoNothing();
}

export async function getWeeklyStats(guildId: string, days: number = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];

  const daily = await db
    .select()
    .from(dailyStats)
    .where(
      and(
        eq(dailyStats.guildId, guildId),
        gte(dailyStats.date, startDateStr)
      )
    )
    .orderBy(desc(dailyStats.date));

  const roles = await db
    .select()
    .from(roleStats)
    .where(
      and(
        eq(roleStats.guildId, guildId),
        gte(roleStats.date, startDateStr)
      )
    )
    .orderBy(desc(roleStats.date));

  return { daily, roles };
}

export async function getLatestDailyStats(guildId: string) {
  const result = await db
    .select()
    .from(dailyStats)
    .where(eq(dailyStats.guildId, guildId))
    .orderBy(desc(dailyStats.date))
    .limit(2);
  return result;
}

export async function getLatestRoleStats(guildId: string) {
  const latest = await db
    .select()
    .from(dailyStats)
    .where(eq(dailyStats.guildId, guildId))
    .orderBy(desc(dailyStats.date))
    .limit(1);

  if (!latest[0]) return { current: [], previous: [] };

  const latestDate = latest[0].date;
  const previousDate = new Date(latestDate);
  previousDate.setDate(previousDate.getDate() - 7);
  const previousDateStr = previousDate.toISOString().split('T')[0];

  const current = await db
    .select()
    .from(roleStats)
    .where(
      and(
        eq(roleStats.guildId, guildId),
        eq(roleStats.date, latestDate)
      )
    );

  const previous = await db
    .select()
    .from(roleStats)
    .where(
      and(
        eq(roleStats.guildId, guildId),
        eq(roleStats.date, previousDateStr)
      )
    );

  return { current, previous };
}
