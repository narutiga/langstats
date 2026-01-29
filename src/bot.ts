import { Client, GatewayIntentBits, Events } from 'discord.js';
import { config } from './config.js';
import { upsertGuild, deleteGuild } from './db/queries.js';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  console.log(`Serving ${readyClient.guilds.cache.size} guilds`);
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`Joined guild: ${guild.name} (${guild.id})`);
  try {
    await upsertGuild({
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
      createdAt: new Date(),
    });
    console.log(`Registered guild: ${guild.name}`);
  } catch (error) {
    console.error(`Failed to register guild ${guild.name}:`, error);
  }
});

client.on(Events.GuildDelete, async (guild) => {
  console.log(`Left guild: ${guild.name} (${guild.id})`);
  try {
    await deleteGuild(guild.id);
    console.log(`Removed guild data: ${guild.name}`);
  } catch (error) {
    console.error(`Failed to remove guild data ${guild.name}:`, error);
  }
});

export async function startBot(): Promise<void> {
  await client.login(config.discord.token);
}

export async function stopBot(): Promise<void> {
  client.destroy();
}
