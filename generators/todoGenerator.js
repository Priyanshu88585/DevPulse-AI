/**
 * @module generators/todoGenerator
 * @description Generates TODO.md organized by priority levels.
 */

import { join } from 'path';
import { PATHS, OUTPUT_FILES } from '../app/constants.js';
import { writeMarkdown } from '../utils/file.js';
import { formatReadable, formatTimestamp } from '../utils/date.js';
import { heading, list, horizontalRule, bold, taskList, table } from '../utils/formatter.js';
import { documentHeader, documentFooter, composeDocument } from '../services/markdown.service.js';
import { getTasksByPriority, getTaskStats } from '../services/task.service.js';
import logger from '../utils/logger.js';

const todoGenerator = {
  name: 'todo',

  /**
   * Generates the TODO.md file.
   * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
   */
  async generate() {
    const done = logger.time('TODO generator');

    const tasks = getTasksByPriority();
    const stats = getTaskStats();

    // ── Header ──────────────────────────────────────────────────────────
    const header = documentHeader('📝 Task Tracker', {
      description: 'Project tasks organized by priority level',
      lastUpdated: formatReadable(),
    });

    // ── Summary ─────────────────────────────────────────────────────────
    const summary = [
      heading('📊 Summary', 2),
      '',
      table(
        ['Priority', 'Count', 'Status'],
        [
          ['🔴 High', String(stats.high), stats.high > 0 ? 'Action needed' : '✅ Clear'],
          ['🟡 Medium', String(stats.medium), 'In queue'],
          ['🟢 Low', String(stats.low), 'Backlog'],
          ['✅ Completed', String(stats.completed), 'Done'],
          ['💡 Future', String(stats.future), 'Ideas'],
        ]
      ),
      '',
      `${bold('Total:')} ${stats.total} items | ${bold('Active:')} ${stats.high + stats.medium + stats.low} | ${bold('Done:')} ${stats.completed}`,
    ].join('\n');

    // ── High Priority ───────────────────────────────────────────────────
    const highSection = (tasks.high?.length > 0) ? [
      heading('🔴 High Priority', 2),
      '',
      taskList(tasks.high.map(t => ({
        text: `${t.title} ${t.category ? `\`${t.category}\`` : ''}`,
        done: false,
      }))),
    ].join('\n') : '';

    // ── Medium Priority ─────────────────────────────────────────────────
    const mediumSection = (tasks.medium?.length > 0) ? [
      heading('🟡 Medium Priority', 2),
      '',
      taskList(tasks.medium.map(t => ({
        text: `${t.title} ${t.category ? `\`${t.category}\`` : ''}`,
        done: false,
      }))),
    ].join('\n') : '';

    // ── Low Priority ────────────────────────────────────────────────────
    const lowSection = (tasks.low?.length > 0) ? [
      heading('🟢 Low Priority', 2),
      '',
      taskList(tasks.low.map(t => ({
        text: `${t.title} ${t.category ? `\`${t.category}\`` : ''}`,
        done: false,
      }))),
    ].join('\n') : '';

    // ── Completed ───────────────────────────────────────────────────────
    const completedSection = (tasks.completed?.length > 0) ? [
      heading('✅ Completed', 2),
      '',
      taskList(tasks.completed.map(t => ({
        text: `${t.title}${t.completedAt ? ` — ${t.completedAt}` : ''} ${t.category ? `\`${t.category}\`` : ''}`,
        done: true,
      }))),
    ].join('\n') : '';

    // ── Future Ideas ────────────────────────────────────────────────────
    const futureSection = (tasks.future?.length > 0) ? [
      heading('💡 Future Ideas', 2),
      '',
      list(tasks.future.map(t => `${t.title} ${t.category ? `\`${t.category}\`` : ''}`)),
    ].join('\n') : '';

    // ── Assemble ────────────────────────────────────────────────────────
    const content = composeDocument(
      header,
      summary,
      horizontalRule(),
      highSection,
      mediumSection,
      lowSection,
      horizontalRule(),
      completedSection,
      futureSection,
      horizontalRule(),
      `${bold('Last Updated:')} ${formatTimestamp()}`,
      documentFooter()
    );

    const filepath = join(PATHS.OUTPUT, OUTPUT_FILES.TODO);
    const changed = writeMarkdown(filepath, content);

    done();
    return { filename: OUTPUT_FILES.TODO, content, changed };
  },
};

export default todoGenerator;
