import { Client, Events } from 'discord.js';

/**
 * Login to Discord with a timeout to prevent indefinite hanging.
 * Properly cleans up event listeners in all code paths (timeout, ready, error).
 *
 * @param client - Discord client instance
 * @param token - Discord bot token
 * @param timeoutMs - Timeout in milliseconds (default: 30000)
 * @throws Error if login times out or fails
 */
export async function loginWithTimeout(
  client: Client,
  token: string,
  timeoutMs = 30_000
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      client.off(Events.ClientReady, handleReady);
      client.off(Events.Error, handleError);
      reject(new Error(`Discord login timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    const handleReady = () => {
      clearTimeout(timeoutId);
      client.off(Events.Error, handleError);
      resolve();
    };

    const handleError = (error: Error) => {
      clearTimeout(timeoutId);
      client.off(Events.ClientReady, handleReady);
      reject(error);
    };

    client.once(Events.ClientReady, handleReady);
    client.once(Events.Error, handleError);
    client.login(token).catch(handleError);
  });
}
