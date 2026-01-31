import { Client, GatewayIntentBits, Events, TextChannel, NewsChannel } from 'discord.js';
import { config } from '../config.js';
import { getGuild } from '../db/queries.js';
import { generateWeeklyReportData, formatWeeklyReport } from '../services/report.js';

async function runWeeklyReport(): Promise<void> {
  console.log('Starting weekly report generation...');

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  const loginTimeoutMs = 30_000;

  await new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Discord login timed out after ${loginTimeoutMs}ms`));
    }, loginTimeoutMs);

    const handleReady = () => {
      clearTimeout(timeoutId);
      resolve();
    };

    const handleError = (error: Error) => {
      clearTimeout(timeoutId);
      reject(error);
    };

    client.once(Events.ClientReady, handleReady);
    client.once(Events.Error, handleError);
    client.login(config.discord.token).catch(handleError);
  });

  console.log(`Connected as ${client.user?.tag}`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const guild of client.guilds.cache.values()) {
    try {
      console.log(`Processing guild: ${guild.name}`);

      const guildData = await getGuild(guild.id);

      if (!guildData?.reportChannelId) {
        console.log(`  Skipping: No report channel configured`);
        skipCount++;
        continue;
      }

      const channel = await guild.channels.fetch(guildData.reportChannelId);

      if (!channel || (!(channel instanceof TextChannel) && !(channel instanceof NewsChannel))) {
        console.log(`  Skipping: Report channel not found or not a valid channel type`);
        skipCount++;
        continue;
      }

      const reportData = await generateWeeklyReportData(guild.id, guild.name);

      if (!reportData) {
        console.log(`  Skipping: No stats data available`);
        skipCount++;
        continue;
      }

      const report = formatWeeklyReport(reportData);
      await channel.send(report);

      console.log(`  Report sent to #${channel.name}`);
      successCount++;
    } catch (error) {
      console.error(`  Error processing ${guild.name}:`, error);
      errorCount++;
    }
  }

  client.destroy();

  console.log('Weekly report generation complete.');
  console.log(`  Sent: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);

  process.exit(errorCount > 0 ? 1 : 0);
}

runWeeklyReport().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
