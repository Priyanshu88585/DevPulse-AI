/**
 * @module services/changelog.service
 * @description Reads version data and builds structured changelog entries.
 */

import { join } from 'path';
import { PATHS, DATA_FILES, CHANGELOG_CATEGORIES } from '../app/constants.js';
import { readJSON } from '../utils/file.js';
import { formatReadable } from '../utils/date.js';
import logger from '../utils/logger.js';

/**
 * Loads all version entries from data/versions.json.
 * @returns {{ version: string, date: string, title: string, changes: object }[]}
 */
export function loadVersions() {
  const data = readJSON(join(PATHS.DATA, DATA_FILES.VERSIONS), { versions: [] });
  return data.versions || [];
}

/**
 * Gets the latest version entry.
 * @returns {object|null}
 */
export function getLatestVersion() {
  const versions = loadVersions();
  return versions.length > 0 ? versions[0] : null;
}

/**
 * Gets the current version string.
 * @returns {string}
 */
export function getCurrentVersionString() {
  const latest = getLatestVersion();
  return latest?.version || '0.0.0';
}

/**
 * Builds a formatted changelog section for a single version.
 * @param {{ version: string, date: string, title: string, changes: object }} versionEntry
 * @returns {string}
 */
export function formatVersionEntry(versionEntry) {
  const lines = [];
  const dateStr = formatReadable(new Date(versionEntry.date));
  lines.push(`## [${versionEntry.version}] — ${dateStr}`);

  if (versionEntry.title) {
    lines.push('', `### ${versionEntry.title}`);
  }

  for (const category of CHANGELOG_CATEGORIES) {
    const items = versionEntry.changes?.[category];
    if (items && items.length > 0) {
      lines.push('', `#### ${category}`, '');
      for (const item of items) {
        lines.push(`- ${item}`);
      }
    }
  }

  return lines.join('\n');
}

/**
 * Builds the full changelog content from all versions.
 * @returns {string}
 */
export function buildFullChangelog() {
  const versions = loadVersions();

  if (versions.length === 0) {
    logger.warn('No version entries found for changelog');
    return '';
  }

  const sections = versions.map(v => formatVersionEntry(v));
  return sections.join('\n\n---\n\n');
}

/**
 * Gets aggregated statistics about the changelog.
 * @returns {{ totalVersions: number, totalChanges: number, latestVersion: string, latestDate: string }}
 */
export function getChangelogStats() {
  const versions = loadVersions();
  let totalChanges = 0;

  for (const v of versions) {
    for (const category of CHANGELOG_CATEGORIES) {
      totalChanges += v.changes?.[category]?.length || 0;
    }
  }

  const latest = versions[0];
  return {
    totalVersions: versions.length,
    totalChanges,
    latestVersion: latest?.version || 'N/A',
    latestDate: latest?.date || 'N/A',
  };
}
