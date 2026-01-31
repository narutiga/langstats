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
  const respond = async (content: string): Promise<void> => {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content });
      return;
    }

    await interaction.reply({ content, ephemeral: true });
  };

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
  try {
    await interaction.deferReply({ ephemeral: true });
  } catch (error) {
    console.error('Failed to defer setup reply:', error);

    // Wrap respond() in its own try/catch for full resilience
    try {
      await respond('Failed to start setup. Please try again.');
    } catch (respondError) {
      console.error('Failed to respond after defer failure:', respondError);
      // Can't do anything more - interaction is likely dead
    }
    return;
  }

  try {
    // Fetch bot member explicitly if not in cache
    let botMember = guild.members.me;
    if (!botMember) {
      try {
        botMember = await guild.members.fetch(interaction.client.user.id);
      } catch (error) {
        console.error('Failed to fetch bot member:', error);
        await respond('Unable to confirm bot permissions. Please try again.');
        return;
      }
    }

    const permissions = channel.permissionsFor(botMember);
    if (
      !permissions?.has([
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
      ])
    ) {
      await respond('I need permission to view and send messages in that channel.');
      return;
    }

    // Save to DB before sending a public confirmation message
    await upsertGuild({
      id: guild.id,
      name: guild.name,
      ownerId: guild.ownerId,
    });

    await updateReportChannel(guild.id, channel.id);

    // Handle confirmation message separately to distinguish DB save vs send failures
    try {
      await channel.send({
        content: `This channel has been set up for weekly growth reports. The first report will be posted next Monday.`,
      });

      await respond(`Weekly reports will be posted to ${channel}.`);
    } catch (sendError) {
      console.error('Failed to send confirmation message:', sendError);

      await respond(
        `Settings saved successfully. I couldn't send a confirmation message to ${channel}, but weekly reports are configured and will be posted there.`
      );
    }
  } catch (error) {
    console.error('Failed to setup report channel:', error);

    await respond('Failed to set up report channel. Please try again.');
  }
}
