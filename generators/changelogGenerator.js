/**
 * @module generators/changelogGenerator
 * @description Generates CHANGELOG.md with semantic versioned entries.
 */

import { join } from 'path';
import { PATHS, OUTPUT_FILES } from '../app/constants.js';
import { writeMarkdown } from '../utils/file.js';
import { heading, horizontalRule } from '../utils/formatter.js';
import { documentHeader, documentFooter, composeDocument } from '../services/markdown.service.js';
import { buildFullChangelog, getChangelogStats } from '../services/changelog.service.js';
import logger from '../utils/logger.js';

const changelogGenerator = {
  name: 'changelog',

  /**
   * Generates the CHANGELOG.md file.
   * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
   */
  async generate() {
    const done = logger.time('Changelog generator');

    const stats = getChangelogStats();
    const changelogBody = buildFullChangelog();

    // ── Header ──────────────────────────────────────────────────────────
    const header = documentHeader('📋 Changelog', {
      description: 'All notable changes to this project are documented in this file. This project adheres to [Semantic Versioning](https://semver.org/).',
      version: stats.latestVersion,
    });

    // ── Summary ─────────────────────────────────────────────────────────
    const summary = [
      `> **${stats.totalVersions}** releases | **${stats.totalChanges}** total changes | Latest: **v${stats.latestVersion}**`,
    ].join('\n');

    // ── Assemble ────────────────────────────────────────────────────────
    const content = composeDocument(
      header,
      summary,
      horizontalRule(),
      changelogBody,
      horizontalRule(),
      documentFooter()
    );

    const filepath = join(PATHS.OUTPUT, OUTPUT_FILES.CHANGELOG);
    const changed = writeMarkdown(filepath, content);

    done();
    return { filename: OUTPUT_FILES.CHANGELOG, content, changed };
  },
};

export default changelogGenerator;
