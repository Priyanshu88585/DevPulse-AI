/**
 * @module services/report.service
 * @description Generates periodic reports (daily/weekly/monthly/yearly).
 */

import { join } from 'path';
import { REPORT_DIRS } from '../app/constants.js';
import { ensureDir, writeMarkdown } from '../utils/file.js';
import { formatDate, formatReadable, getWeekNumber, getQuarter } from '../utils/date.js';
import { computeMetrics } from './metrics.service.js';
import { documentHeader, documentFooter, composeDocument } from './markdown.service.js';
import { heading, table, list, horizontalRule } from '../utils/formatter.js';
import logger from '../utils/logger.js';

// Ensure report directories exist
Object.values(REPORT_DIRS).forEach(dir => ensureDir(dir));

/**
 * Generates a daily report snapshot.
 * @param {Date} [date]
 * @returns {{ filename: string, changed: boolean }}
 */
export function generateDailyReport(date = new Date()) {
  const dateStr = formatDate(date);
  const filename = `report-${dateStr}.md`;
  const filepath = join(REPORT_DIRS.DAILY, filename);

  const metrics = computeMetrics();

  const content = composeDocument(
    documentHeader(`Daily Report — ${formatReadable(date)}`, {
      description: 'Automated daily project status snapshot',
      lastUpdated: dateStr,
    }),
    heading('Project Metrics', 2),
    table(
      ['Metric', 'Value'],
      [
        ['Documentation Pages', String(metrics.documentationPages)],
        ['Tasks Completed', `${metrics.completedTasks}/${metrics.totalTasks}`],
        ['Milestones Completed', `${metrics.completedMilestones}/${metrics.totalMilestones}`],
        ['Task Completion Rate', `${metrics.taskCompletionRate}%`],
        ['Total Commits', String(metrics.totalCommits)],
        ['Current Version', metrics.currentVersion],
      ]
    ),
    heading('Recent Activity', 2),
    metrics.recentCommits.length > 0
      ? list(metrics.recentCommits.map(c => `\`${c.hash}\` ${c.message} (${c.date})`))
      : '_No recent commits recorded._',
    documentFooter()
  );

  const changed = writeMarkdown(filepath, content);
  logger.info(`Daily report ${changed ? 'generated' : 'unchanged'}: ${filename}`);

  return { filename, changed };
}

/**
 * Generates a weekly report.
 * @param {Date} [date]
 * @returns {{ filename: string, changed: boolean }}
 */
export function generateWeeklyReport(date = new Date()) {
  const week = getWeekNumber(date);
  const year = date.getFullYear();
  const filename = `report-${year}-W${String(week).padStart(2, '0')}.md`;
  const filepath = join(REPORT_DIRS.WEEKLY, filename);

  const metrics = computeMetrics();

  const content = composeDocument(
    documentHeader(`Weekly Report — ${year} Week ${week}`, {
      description: 'Automated weekly project summary',
      lastUpdated: formatDate(date),
    }),
    heading('Week Summary', 2),
    table(
      ['Metric', 'Value'],
      [
        ['Total Tasks', String(metrics.totalTasks)],
        ['Completed Tasks', String(metrics.completedTasks)],
        ['Completion Rate', `${metrics.taskCompletionRate}%`],
        ['Active Milestones', String(metrics.inProgressMilestones)],
        ['Documentation Pages', String(metrics.documentationPages)],
      ]
    ),
    heading('Highlights', 2),
    list([
      `Project is at version ${metrics.currentVersion}`,
      `${metrics.completedMilestones} of ${metrics.totalMilestones} milestones completed`,
      `${metrics.pendingTasks} tasks remaining across all milestones`,
      metrics.blockers > 0
        ? `⚠️ ${metrics.blockers} active blocker(s) require attention`
        : '✅ No active blockers',
    ]),
    documentFooter()
  );

  const changed = writeMarkdown(filepath, content);
  logger.info(`Weekly report ${changed ? 'generated' : 'unchanged'}: ${filename}`);

  return { filename, changed };
}

/**
 * Generates a monthly report.
 * @param {Date} [date]
 * @returns {{ filename: string, changed: boolean }}
 */
export function generateMonthlyReport(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const filename = `report-${year}-${month}.md`;
  const filepath = join(REPORT_DIRS.MONTHLY, filename);

  const metrics = computeMetrics();
  const quarter = getQuarter(date);

  const content = composeDocument(
    documentHeader(`Monthly Report — ${formatReadable(date).split(' ').slice(0, 2).join(' ')} ${year}`, {
      description: `Monthly project status report (${quarter})`,
      lastUpdated: formatDate(date),
    }),
    heading('Monthly Overview', 2),
    table(
      ['Metric', 'Value'],
      [
        ['Quarter', quarter],
        ['Current Version', metrics.currentVersion],
        ['Total Versions Released', String(metrics.totalVersions)],
        ['Milestones Completed', `${metrics.completedMilestones}/${metrics.totalMilestones}`],
        ['Task Completion Rate', `${metrics.taskCompletionRate}%`],
        ['Total Project Files', String(metrics.totalProjectFiles)],
        ['Documentation Pages', String(metrics.documentationPages)],
      ]
    ),
    horizontalRule(),
    heading('Status', 2),
    list([
      `📊 ${metrics.taskCompletionRate}% of all tasks completed`,
      `📝 ${metrics.documentationPages} documentation pages maintained`,
      `🏗️ ${metrics.inProgressMilestones} milestone(s) currently in progress`,
      `📦 ${metrics.totalVersions} version(s) released to date`,
    ]),
    documentFooter()
  );

  const changed = writeMarkdown(filepath, content);
  logger.info(`Monthly report ${changed ? 'generated' : 'unchanged'}: ${filename}`);

  return { filename, changed };
}
