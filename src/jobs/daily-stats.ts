import { Client, GatewayIntentBits } from 'discord.js';
import { config } from '../config.js';
import {
  getAllGuilds,
  upsertGuild,
  insertDailyStats,
  insertRoleStats,
} from '../db/queries.js';
import { collectGuildStats } from '../services/stats.js';
import { loginWithTimeout } from '../utils/discord.js';

async function runDailyStats(): Promise<void> {
  console.log('Starting daily stats collection...');

  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  });

  await loginWithTimeout(client, config.discord.token);

  console.log(`Connected as ${client.user?.tag}`);

  const today = new Date().toISOString().split('T')[0];
  let successCount = 0;
  let errorCount = 0;

  for (const guild of client.guilds.cache.values()) {
    try {
      console.log(`Processing guild: ${guild.name}`);

      await upsertGuild({
        id: guild.id,
        name: guild.name,
        ownerId: guild.ownerId,
        createdAt: new Date(),
      });

      const stats = await collectGuildStats(guild);

      await insertDailyStats({
        guildId: guild.id,
        date: today,
        memberCount: stats.memberCount,
        createdAt: new Date(),
      });

      if (stats.roleStats.length > 0) {
        await insertRoleStats(
          stats.roleStats.map((rs) => ({
            guildId: guild.id,
            date: today,
            roleId: rs.roleId,
            roleName: rs.roleName,
            memberCount: rs.memberCount,
            createdAt: new Date(),
          }))
        );
      }

      console.log(
        `  Members: ${stats.memberCount}, Language roles: ${stats.roleStats.length}`
      );
      successCount++;
    } catch (error) {
      console.error(`  Error processing ${guild.name}:`, error);
      errorCount++;
    }
  }

  client.destroy();

  console.log('Daily stats collection complete.');
  console.log(`  Success: ${successCount}, Errors: ${errorCount}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

runDailyStats().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
