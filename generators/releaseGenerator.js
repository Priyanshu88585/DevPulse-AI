/**
 * @module generators/releaseGenerator
 * @description Generates RELEASES.md summarizing each project release.
 */

import { join } from 'path';
import { PATHS, OUTPUT_FILES, CHANGELOG_CATEGORIES } from '../app/constants.js';
import { writeMarkdown } from '../utils/file.js';
import { formatReadable } from '../utils/date.js';
import { heading, list, horizontalRule, bold, table, badge } from '../utils/formatter.js';
import { documentHeader, documentFooter, composeDocument } from '../services/markdown.service.js';
import { loadVersions } from '../services/changelog.service.js';
import logger from '../utils/logger.js';

const releaseGenerator = {
  name: 'release',

  /**
   * Generates the RELEASES.md file.
   * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
   */
  async generate() {
    const done = logger.time('Release generator');

    const versions = loadVersions();

    // ── Header ──────────────────────────────────────────────────────────
    const header = documentHeader('🚀 Releases', {
      description: 'Release history and highlights for each version',
      lastUpdated: formatReadable(),
    });

    // ── Release Count ───────────────────────────────────────────────────
    const summaryBadges = [
      badge('releases', String(versions.length), 'blue'),
      badge('latest', versions[0]?.version || 'N/A', 'green'),
    ].join(' ');

    // ── Release Sections ────────────────────────────────────────────────
    const releaseSections = versions.map(version => {
      const dateStr = formatReadable(new Date(version.date));

      // Count changes per category
      const changeCounts = CHANGELOG_CATEGORIES
        .map(cat => {
          const count = version.changes?.[cat]?.length || 0;
          return count > 0 ? `${count} ${cat}` : null;
        })
        .filter(Boolean);

      // Collect highlights (first item from each non-empty category)
      const highlights = CHANGELOG_CATEGORIES
        .flatMap(cat => {
          const items = version.changes?.[cat] || [];
          return items.slice(0, 2).map(item => `${item}`);
        })
        .slice(0, 5);

      const section = [
        heading(`v${version.version} — ${version.title || 'Release'}`, 2),
        '',
        `📅 ${bold('Released:')} ${dateStr}`,
        '',
        changeCounts.length > 0
          ? `📦 ${bold('Changes:')} ${changeCounts.join(' · ')}`
          : '',
        '',
        heading('Highlights', 3),
        '',
        list(highlights.length > 0 ? highlights : ['Initial release']),
      ];

      return section.filter(Boolean).join('\n');
    });

    // ── Release Timeline ────────────────────────────────────────────────
    const timelineSection = versions.length > 1 ? [
      heading('📅 Release Timeline', 2),
      '',
      table(
        ['Version', 'Title', 'Date'],
        versions.map(v => [
          `v${v.version}`,
          v.title || '—',
          v.date,
        ])
      ),
    ].join('\n') : '';

    // ── Assemble ────────────────────────────────────────────────────────
    const content = composeDocument(
      header,
      summaryBadges,
      horizontalRule(),
      ...releaseSections.map(s => s + '\n\n' + horizontalRule()),
      timelineSection,
      documentFooter()
    );

    const filepath = join(PATHS.OUTPUT, OUTPUT_FILES.RELEASES);
    const changed = writeMarkdown(filepath, content);

    done();
    return { filename: OUTPUT_FILES.RELEASES, content, changed };
  },
};

export default releaseGenerator;
