import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  ChannelType,
  TextChannel,
  NewsChannel,
} from 'discord.js';
import { upsertGuild, updateReportChannel } from '../db/queries.js';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('Set the channel for weekly reports')
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel to post weekly reports')
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const channel = interaction.options.getChannel('channel', true);

  if (!(channel instanceof TextChannel) && !(channel instanceof NewsChannel)) {
    await interaction.reply({
      content: 'Please select a text channel or announcement channel.',
      ephemeral: true,
    });
    return;
  }

  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  // Defer reply immediately to avoid 3-second timeout
  await interaction.deferReply({ ephemeral: true });

  try {
    // Send confirmation message first to verify bot has permission
    await channel.send({
      content: `This channel has been set up for weekly growth reports. The first report will be posted next Monday.`,
    });

    // Only save to DB after successful send
    await upsertGuild({
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
    });

    await updateReportChannel(guild.id, channel.id);

    await interaction.editReply({
      content: `Weekly reports will be posted to ${channel}.`,
    });
  } catch (error) {
    console.error('Failed to setup report channel:', error);

    await interaction.editReply({
      content: 'Failed to save settings. Please try again.',
    });
  }
}
