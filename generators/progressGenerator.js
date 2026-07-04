/**
 * @module generators/progressGenerator
 * @description Generates PROGRESS.md with current sprint, completed work, priorities, and blockers.
 */

import { join } from 'path';
import { PATHS, DATA_FILES, OUTPUT_FILES } from '../app/constants.js';
import { readJSON, writeMarkdown } from '../utils/file.js';
import { heading, list, table, horizontalRule, quote, bold, progressBar, taskList } from '../utils/formatter.js';
import { documentHeader, documentFooter, composeDocument } from '../services/markdown.service.js';
import { getSprintInfo } from '../services/timeline.service.js';
import logger from '../utils/logger.js';

const progressGenerator = {
  name: 'progress',

  /**
   * Generates the PROGRESS.md file.
   * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
   */
  async generate() {
    const done = logger.time('Progress generator');

    const progressData = readJSON(join(PATHS.DATA, DATA_FILES.PROGRESS), {});
    const sprint = getSprintInfo();

    // ── Header ──────────────────────────────────────────────────────────
    const header = documentHeader('📊 Development Progress', {
      description: 'Current sprint progress, priorities, and blockers',
      version: 'Sprint ' + sprint.number,
    });

    // ── Sprint Section ──────────────────────────────────────────────────
    const sprintSection = [
      heading('🏃 Current Sprint', 2),
      '',
      table(
        ['Detail', 'Value'],
        [
          ['Sprint', `Sprint ${sprint.number}`],
          ['Period', `${sprint.start} → ${sprint.end}`],
          ['Days Remaining', `${sprint.daysRemaining} days`],
          ['Status', '🟢 Active'],
        ]
      ),
      '',
      quote('Active development sprint focused on current project priorities.'),
    ].join('\n');

    // ── Sprint Goals ────────────────────────────────────────────────────
    const goals = progressData.currentSprint?.goals || [];
    const goalsSection = goals.length > 0 ? [
      heading('🎯 Sprint Goals', 2),
      '',
      taskList(goals.map((goal) => ({
        text: goal,
        done: false, // Default to incomplete for pure strings
      }))),
    ].join('\n') : '';

    // ── Completed Work ──────────────────────────────────────────────────
    const completed = progressData.completed || [];
    const completedSection = completed.length > 0 ? [
      heading('✅ Completed Work', 2),
      '',
      table(
        ['Item', 'Date', 'Category'],
        completed.slice(0, 10).map(item => [
          item.item,
          item.date,
          `\`${item.category}\``,
        ])
      ),
    ].join('\n') : '';

    // ── Next Priorities ─────────────────────────────────────────────────
    const priorities = progressData.nextPriorities || [];
    const prioritiesSection = priorities.length > 0 ? [
      heading('🔮 Next Priorities', 2),
      '',
      list(priorities.map((p, i) => `${bold(`${i + 1}.`)} ${p}`)),
    ].join('\n') : '';

    // ── Blockers ────────────────────────────────────────────────────────
    const blockers = progressData.blockers || [];
    const blockersSection = blockers.length > 0 ? [
      heading('🚧 Known Blockers', 2),
      '',
      ...blockers.map(b => [
        `- ${bold('Issue:')} ${b.description}`,
        `  - ${bold('Severity:')} ${b.severity}`,
        `  - ${bold('Workaround:')} ${b.workaround || 'None identified'}`,
      ].join('\n')),
    ].join('\n') : [
      heading('🚧 Known Blockers', 2),
      '',
      '> ✅ No active blockers at this time.',
    ].join('\n');

    // ── Assemble ────────────────────────────────────────────────────────
    const content = composeDocument(
      header,
      sprintSection,
      goalsSection,
      completedSection,
      horizontalRule(),
      prioritiesSection,
      blockersSection,
      documentFooter()
    );

    const filepath = join(PATHS.OUTPUT, OUTPUT_FILES.PROGRESS);
    const changed = writeMarkdown(filepath, content);

    done();
    return { filename: OUTPUT_FILES.PROGRESS, content, changed };
  },
};

export default progressGenerator;
