import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { generateWeeklyReportData, formatWeeklyReport } from '../services/report.js';

export const data = new SlashCommandBuilder()
  .setName('preview')
  .setDescription('Preview the weekly report without posting it');

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const guild = interaction.guild;
  const respond = async (content: string): Promise<void> => {
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content });
      return;
    }

    await interaction.reply({ content, ephemeral: true });
  };

  if (!guild) {
    await interaction.reply({
      content: 'This command can only be used in a server.',
      ephemeral: true,
    });
    return;
  }

  try {
    await interaction.deferReply({ ephemeral: true });
  } catch (error) {
    console.error('Failed to defer preview reply:', error);
    await respond('Failed to start report preview. Please try again.');
    return;
  }

  try {
    const reportData = await generateWeeklyReportData(guild.id, guild.name);

    if (!reportData) {
      await respond(
        'No stats data available yet. Reports will be available after the first daily stats collection.'
      );
      return;
    }

    const report = formatWeeklyReport(reportData);

    await respond(`**Preview** (not posted to any channel)\n\n${report}`);
  } catch (error) {
    console.error('Failed to generate preview:', error);

    await respond('Failed to generate report preview. Please try again.');
  }
}
