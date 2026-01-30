import { Client, GatewayIntentBits, Events, REST, Routes, ActivityType } from 'discord.js';
import { config } from './config.js';
import { upsertGuild, deleteGuild } from './db/queries.js';
import * as setupCommand from './commands/setup.js';
import * as previewCommand from './commands/preview.js';

const commands = [setupCommand, previewCommand];

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
  presence: {
    status: 'online',
    activities: [
      {
        name: 'server growth',
        type: ActivityType.Watching,
      },
    ],
  },
});

async function registerCommands(guildId: string): Promise<void> {
  if (!config.discord.clientId) {
    throw new Error('DISCORD_CLIENT_ID is required for command registration');
  }

  const rest = new REST().setToken(config.discord.token);

  try {
    console.log(`Registering commands for guild ${guildId}...`);

    await rest.put(
      Routes.applicationGuildCommands(config.discord.clientId, guildId),
      { body: commands.map((cmd) => cmd.data.toJSON()) }
    );

    console.log(`Commands registered for guild ${guildId}`);
  } catch (error) {
    console.error(`Failed to register commands for guild ${guildId}:`, error);
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  console.log(`Serving ${readyClient.guilds.cache.size} guilds`);

  for (const guild of readyClient.guilds.cache.values()) {
    await registerCommands(guild.id);
  }
});

client.on(Events.GuildCreate, async (guild) => {
  console.log(`Joined guild: ${guild.name} (${guild.id})`);
  try {
    await upsertGuild({
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
    });
    console.log(`Registered guild: ${guild.name}`);

    // Only register commands for truly new guilds (after bot is ready)
    // During startup, GuildCreate fires for cached guilds before ClientReady,
    // and ClientReady handles command registration for all existing guilds
    if (client.isReady()) {
      await registerCommands(guild.id);
    }
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

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find((cmd) => cmd.data.name === interaction.commandName);

  if (!command) {
    console.warn(`Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error executing command ${interaction.commandName}:`, error);

    const reply = {
      content: 'An error occurred while executing this command.',
      ephemeral: true,
    };

    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    } catch (replyError) {
      console.error('Failed to send error response:', replyError);
    }
  }
});

export async function startBot(): Promise<void> {
  await client.login(config.discord.token);
}

export async function stopBot(): Promise<void> {
  client.destroy();
}
