import type { Guild, Role } from 'discord.js';

const LANGUAGE_KEYWORDS = [
  'english',
  'japanese',
  'spanish',
  'french',
  'german',
  'chinese',
  'korean',
  'portuguese',
  'italian',
  'russian',
  'learner',
  'native',
  'speaker',
  '学習',
  '母語',
  'fluent',
  'beginner',
  'intermediate',
  'advanced',
];

export function isLanguageRole(roleName: string): boolean {
  const lower = roleName.toLowerCase();
  return LANGUAGE_KEYWORDS.some((kw) => lower.includes(kw));
}

export interface GuildStats {
  guildId: string;
  guildName: string;
  memberCount: number;
  roleStats: RoleStatData[];
}

export interface RoleStatData {
  roleId: string;
  roleName: string;
  memberCount: number;
}

export async function collectGuildStats(guild: Guild): Promise<GuildStats> {
  await guild.members.fetch();

  const languageRoles = guild.roles.cache.filter((role) =>
    isLanguageRole(role.name) && role.members.size > 0
  );

  const roleStats: RoleStatData[] = languageRoles.map((role: Role) => ({
    roleId: role.id,
    roleName: role.name,
    memberCount: role.members.size,
  }));

  roleStats.sort((a, b) => b.memberCount - a.memberCount);

  return {
    guildId: guild.id,
    guildName: guild.name,
    memberCount: guild.memberCount,
    roleStats,
  };
}
