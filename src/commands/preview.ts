import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { generateWeeklyReportData, formatWeeklyReport } from '../services/report.js';

export const data = new SlashCommandBuilder()
  .setName('preview')
  .setDescription('Preview the weekly report without posting it');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply({ ephemeral: true });

  try {
    const reportData = await generateWeeklyReportData(guild.id, guild.name);

    if (!reportData) {
      await interaction.editReply({
        content: 'No stats data available yet. Reports will be available after the first daily stats collection.',
      });
      return;
    }

    const report = formatWeeklyReport(reportData);

    await interaction.editReply({
      content: `**Preview** (not posted to any channel)\n\n${report}`,
    });
  } catch (error) {
    console.error('Failed to generate preview:', error);

    await interaction.editReply({
      content: 'Failed to generate report preview. Please try again.',
    });
  }
}
