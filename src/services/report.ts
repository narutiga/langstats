import { getLatestDailyStats, getLatestRoleStats } from '../db/queries.js';

export interface WeeklyReportData {
  guildName: string;
  currentMembers: number;
  memberChange: number;
  growthRate: number;
  roleChanges: RoleChange[];
}

export interface RoleChange {
  roleName: string;
  currentCount: number;
  change: number;
}

export async function generateWeeklyReportData(
  guildId: string,
  guildName: string
): Promise<WeeklyReportData | null> {
  const dailyStats = await getLatestDailyStats(guildId);

  if (dailyStats.length === 0) {
    return null;
  }

  const current = dailyStats[0];
  const previous = dailyStats[1];

  const currentMembers = current.memberCount ?? 0;
  const previousMembers = previous?.memberCount ?? currentMembers;
  const memberChange = currentMembers - previousMembers;
  const growthRate =
    previousMembers > 0 ? ((memberChange / previousMembers) * 100) : 0;

  const { current: currentRoles, previous: previousRoles } =
    await getLatestRoleStats(guildId);

  const previousRoleMap = new Map(
    previousRoles.map((r) => [r.roleId, r.memberCount ?? 0])
  );

  const roleChanges: RoleChange[] = currentRoles.map((role) => {
    const prevCount = previousRoleMap.get(role.roleId) ?? 0;
    return {
      roleName: role.roleName,
      currentCount: role.memberCount ?? 0,
      change: (role.memberCount ?? 0) - prevCount,
    };
  });

  roleChanges.sort((a, b) => b.currentCount - a.currentCount);

  return {
    guildName,
    currentMembers,
    memberChange,
    growthRate,
    roleChanges: roleChanges.slice(0, 5),
  };
}

export function formatWeeklyReport(data: WeeklyReportData): string {
  const changeSign = data.memberChange >= 0 ? '+' : '';
  const growthSign = data.growthRate >= 0 ? '+' : '';

  let report = `📊 Weekly Growth Report - ${data.guildName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 Members: ${data.currentMembers.toLocaleString()} (${changeSign}${data.memberChange})
📈 Growth: ${growthSign}${data.growthRate.toFixed(1)}%
`;

  if (data.roleChanges.length > 0) {
    report += `
🏷️ Language Roles:`;

    for (const role of data.roleChanges) {
      const roleChangeSign = role.change >= 0 ? '+' : '';
      report += `
   ${role.roleName}: ${role.currentCount} (${roleChangeSign}${role.change})`;
    }
  }

  report += `

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Found this useful? React with 👍
   Want advanced stats? Reply "PRO"`;

  return report;
}
