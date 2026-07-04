/**
 * @module generators/roadmapGenerator
 * @description Generates ROADMAP.md with completed, current, upcoming milestones and future ideas.
 */

import { join } from 'path';
import { PATHS, OUTPUT_FILES } from '../app/constants.js';
import { writeMarkdown } from '../utils/file.js';
import { formatReadable } from '../utils/date.js';
import { heading, table, list, horizontalRule, bold, progressBar, quote } from '../utils/formatter.js';
import { documentHeader, documentFooter, composeDocument } from '../services/markdown.service.js';
import { getMilestonesByStatus, getOverallProgress } from '../services/timeline.service.js';
import logger from '../utils/logger.js';

const roadmapGenerator = {
  name: 'roadmap',

  /**
   * Generates the ROADMAP.md file.
   * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
   */
  async generate() {
    const done = logger.time('Roadmap generator');

    const { completed, inProgress, planned, future } = getMilestonesByStatus();
    const overallProgress = getOverallProgress();

    // ── Header ──────────────────────────────────────────────────────────
    const header = documentHeader('🗺️ Project Roadmap', {
      description: 'Strategic development roadmap and milestone tracking',
      lastUpdated: formatReadable(),
    });

    // ── Overall Progress ────────────────────────────────────────────────
    const overviewSection = [
      heading('📈 Overall Progress', 2),
      '',
      `${progressBar(overallProgress)}`,
      '',
      table(
        ['Status', 'Count'],
        [
          ['✅ Completed', String(completed.length)],
          ['🔄 In Progress', String(inProgress.length)],
          ['📋 Planned', String(planned.length)],
          ['💡 Future', String(future.length)],
        ]
      ),
    ].join('\n');

    // ── Completed Milestones ────────────────────────────────────────────
    const completedSection = completed.length > 0 ? [
      heading('✅ Completed Milestones', 2),
      '',
      ...completed.map(m => [
        `### ${m.title}`,
        '',
        `> Completed: ${formatReadable(new Date(m.completedDate))} | Target: ${formatReadable(new Date(m.targetDate))}`,
        '',
        m.description,
        '',
        list((m.deliverables || []).map(d => `~~${d}~~`)),
        '',
      ].join('\n')),
    ].join('\n') : '';

    // ── Current Milestone ───────────────────────────────────────────────
    const currentSection = inProgress.length > 0 ? [
      heading('🔄 Current Milestone', 2),
      '',
      ...inProgress.map(m => [
        `### 🎯 ${m.title}`,
        '',
        quote(m.description),
        '',
        table(
          ['Detail', 'Value'],
          [
            ['Target Date', formatReadable(new Date(m.targetDate))],
            ['Status', '🔄 In Progress'],
          ]
        ),
        '',
        heading('Deliverables', 4),
        '',
        list((m.deliverables || []).map(d => d)),
        '',
      ].join('\n')),
    ].join('\n') : '';

    // ── Planned ─────────────────────────────────────────────────────────
    const plannedSection = planned.length > 0 ? [
      heading('📋 Upcoming Milestones', 2),
      '',
      ...planned.map(m => [
        `### ${m.title}`,
        '',
        `> Target: ${formatReadable(new Date(m.targetDate))}`,
        '',
        m.description,
        '',
        list(m.deliverables || []),
        '',
      ].join('\n')),
    ].join('\n') : '';

    // ── Future Ideas ────────────────────────────────────────────────────
    const futureSection = future.length > 0 ? [
      heading('💡 Future Ideas', 2),
      '',
      ...future.map(m => [
        `### ${m.title}`,
        '',
        m.description,
        '',
        list(m.deliverables || []),
        '',
      ].join('\n')),
    ].join('\n') : '';

    // ── Assemble ────────────────────────────────────────────────────────
    const content = composeDocument(
      header,
      overviewSection,
      horizontalRule(),
      completedSection,
      currentSection,
      horizontalRule(),
      plannedSection,
      futureSection,
      documentFooter()
    );

    const filepath = join(PATHS.OUTPUT, OUTPUT_FILES.ROADMAP);
    const changed = writeMarkdown(filepath, content);

    done();
    return { filename: OUTPUT_FILES.ROADMAP, content, changed };
  },
};

export default roadmapGenerator;
