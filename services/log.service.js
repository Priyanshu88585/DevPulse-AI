/**
 * @module services/log.service
 * @description Structured log management — execution history, scheduler logs, commit logs.
 */

import { join } from 'path';
import { PATHS, LOG_FILES } from '../app/constants.js';
import { ensureDir, readMarkdown } from '../utils/file.js';
import { formatTimestamp } from '../utils/date.js';
import logger from '../utils/logger.js';
import { appendFileSync } from 'fs';

// Ensure log directory exists on import
ensureDir(PATHS.LOGS);

/**
 * Records a scheduler execution event.
 * @param {object} event
 * @param {string} event.action - e.g., 'started', 'completed', 'skipped'
 * @param {string[]} [event.generators] - Generators that were run
 * @param {number} [event.duration] - Duration in milliseconds
 * @param {string} [event.reason] - Reason (e.g., for skipping)
 */
export function logSchedulerEvent(event) {
  const timestamp = formatTimestamp();
  const parts = [
    `[${timestamp}]`,
    `ACTION=${event.action}`,
  ];

  if (event.generators?.length) {
    parts.push(`GENERATORS=${event.generators.join(',')}`);
  }
  if (event.duration !== undefined) {
    parts.push(`DURATION=${event.duration}ms`);
  }
  if (event.reason) {
    parts.push(`REASON=${event.reason}`);
  }

  const entry = parts.join(' ');
  writeLogEntry(LOG_FILES.SCHEDULER, entry);
  logger.debug(`Scheduler event: ${event.action}`);
}

/**
 * Records a commit event.
 * @param {object} event
 * @param {string} event.hash - Commit hash
 * @param {string} event.message - Commit message
 * @param {string[]} event.files - Files included in the commit
 */
export function logCommitEvent(event) {
  const timestamp = formatTimestamp();
  const entry = [
    `[${timestamp}]`,
    `HASH=${event.hash || 'unknown'}`,
    `MESSAGE="${event.message}"`,
    `FILES=${event.files?.join(',') || 'none'}`,
  ].join(' ');

  writeLogEntry(LOG_FILES.COMMITS, entry);
  logger.debug(`Commit logged: ${event.message}`);
}

/**
 * Records a history entry for any notable event.
 * @param {string} category - e.g., 'generation', 'release', 'config'
 * @param {string} description
 */
export function logHistoryEvent(category, description) {
  const timestamp = formatTimestamp();
  const entry = `[${timestamp}] [${category.toUpperCase()}] ${description}`;
  writeLogEntry(LOG_FILES.HISTORY, entry);
}

/**
 * Gets the most recent log entries from a specific log file.
 * @param {string} logFilename - e.g., 'scheduler.log'
 * @param {number} [count=20] - Number of recent entries to return
 * @returns {string[]}
 */
export function getRecentLogEntries(logFilename, count = 20) {
  const filepath = join(PATHS.LOGS, logFilename);
  const content = readMarkdown(filepath, '');
  if (!content) return [];

  const lines = content.split('\n').filter(line => line.trim());
  return lines.slice(-count);
}

/**
 * Gets the total number of entries in a log file.
 * @param {string} logFilename
 * @returns {number}
 */
export function getLogEntryCount(logFilename) {
  const filepath = join(PATHS.LOGS, logFilename);
  const content = readMarkdown(filepath, '');
  if (!content) return 0;
  return content.split('\n').filter(line => line.trim()).length;
}

// ── Internal ────────────────────────────────────────────────────────────────

/**
 * Appends a line to a log file.
 * @param {string} filename
 * @param {string} entry
 */
function writeLogEntry(filename, entry) {
  try {
    const filepath = join(PATHS.LOGS, filename);
    appendFileSync(filepath, entry + '\n', 'utf-8');
  } catch (err) {
    logger.error(`Failed to write log entry to ${filename}`, { error: err.message });
  }
}
