import { startBot, stopBot } from './bot.js';

async function main(): Promise<void> {
  console.log('Starting LangStats Bot...');

  process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down...');
    await stopBot();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down...');
    await stopBot();
    process.exit(0);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  try {
    await startBot();
    console.log('Bot is running. Press Ctrl+C to stop.');
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
