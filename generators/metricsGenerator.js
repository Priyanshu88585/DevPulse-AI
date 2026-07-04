/**
 * @module generators/metricsGenerator
 * @description Generates METRICS.md with project statistics and dashboard.
 */

import { join } from 'path';
import { PATHS, OUTPUT_FILES } from '../app/constants.js';
import { writeMarkdown } from '../utils/file.js';
import { heading, table, horizontalRule, bold, progressBar, badge } from '../utils/formatter.js';
import { documentHeader, documentFooter, composeDocument } from '../services/markdown.service.js';
import { computeMetrics } from '../services/metrics.service.js';
import logger from '../utils/logger.js';

const metricsGenerator = {
  name: 'metrics',

  /**
   * Generates the METRICS.md file.
   * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
   */
  async generate() {
    const done = logger.time('Metrics generator');

    const m = computeMetrics();

    // ── Header ──────────────────────────────────────────────────────────
    const header = documentHeader('📊 Project Metrics', {
      description: 'Automated project statistics and health indicators',
      version: m.currentVersion,
    });

    // ── Badges ──────────────────────────────────────────────────────────
    const badgeSection = [
      badge('version', `v${m.currentVersion}`, 'blue'),
      badge('tasks', `${m.completedTasks}/${m.totalTasks}`, m.taskCompletionRate > 70 ? 'green' : 'orange'),
      badge('milestones', `${m.completedMilestones}/${m.totalMilestones}`, 'purple'),
      badge('docs', `${m.documentationPages} pages`, 'brightgreen'),
    ].join(' ');

    // ── Overview Table ──────────────────────────────────────────────────
    const overviewSection = [
      heading('📈 Overview', 2),
      '',
      table(
        ['Metric', 'Value', 'Status'],
        [
          ['Documentation Pages', String(m.documentationPages), '📝'],
          ['Total Milestones', String(m.totalMilestones), '🏗️'],
          ['Completed Milestones', String(m.completedMilestones), '✅'],
          ['In-Progress Milestones', String(m.inProgressMilestones), '🔄'],
          ['Planned Milestones', String(m.plannedMilestones), '📋'],
          ['Current Version', `v${m.currentVersion}`, '📦'],
          ['Total Versions Released', String(m.totalVersions), '🏷️'],
        ]
      ),
    ].join('\n');

    // ── Task Metrics ────────────────────────────────────────────────────
    const taskSection = [
      heading('✅ Task Completion', 2),
      '',
      `${bold('Progress:')} ${progressBar(m.taskCompletionRate)}`,
      '',
      table(
        ['Metric', 'Count'],
        [
          ['Total Tasks', String(m.totalTasks)],
          ['Completed', String(m.completedTasks)],
          ['Pending', String(m.pendingTasks)],
          ['Completion Rate', `${m.taskCompletionRate}%`],
        ]
      ),
    ].join('\n');

    // ── Repository Metrics ──────────────────────────────────────────────
    const repoSection = [
      heading('🏗️ Repository', 2),
      '',
      table(
        ['Metric', 'Value'],
        [
          ['Total Project Files', String(m.totalProjectFiles)],
          ['Total Commits', String(m.totalCommits)],
          ['Active Blockers', String(m.blockers)],
          ['Sprint Items Completed', String(m.sprintItems)],
        ]
      ),
    ].join('\n');

    // ── Recent Activity ─────────────────────────────────────────────────
    const recentSection = m.recentCommits.length > 0 ? [
      heading('📝 Recent Activity', 2),
      '',
      table(
        ['Hash', 'Message', 'Date'],
        m.recentCommits.map(c => [
          `\`${c.hash}\``,
          c.message,
          c.date.slice(0, 10),
        ])
      ),
    ].join('\n') : '';

    // ── Assemble ────────────────────────────────────────────────────────
    const content = composeDocument(
      header,
      badgeSection,
      overviewSection,
      horizontalRule(),
      taskSection,
      horizontalRule(),
      repoSection,
      recentSection,
      documentFooter()
    );

    const filepath = join(PATHS.OUTPUT, OUTPUT_FILES.METRICS);
    const changed = writeMarkdown(filepath, content);

    done();
    return { filename: OUTPUT_FILES.METRICS, content, changed };
  },
};

export default metricsGenerator;
