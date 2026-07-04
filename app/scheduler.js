/**
 * @module app/scheduler
 * @description Determines whether documentation generation should run based on
 * interval checks and change detection.
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { PATHS, LOG_FILES } from './constants.js';
import config from './config.js';
import { readMarkdown, fileExists, ensureDir } from '../utils/file.js';
import { logSchedulerEvent, getRecentLogEntries } from '../services/log.service.js';
import logger from '../utils/logger.js';

/**
 * Last-run tracking file path.
 */
const LAST_RUN_FILE = join(PATHS.LOGS, '.last_run');

/**
 * Checks if enough time has elapsed since the last run.
 * @returns {boolean}
 */
export function shouldRun() {
  // In GitHub Actions, always run (the cron schedule handles timing)
  if (config.env.isGitHubActions) {
    logger.debug('Running in GitHub Actions — always proceeding');
    return true;
  }

  // Check last run timestamp
  if (!fileExists(LAST_RUN_FILE)) {
    logger.debug('No last run record found — proceeding');
    return true;
  }

  try {
    const lastRunStr = readMarkdown(LAST_RUN_FILE, '').trim();
    const lastRun = new Date(lastRunStr).getTime();
    const now = Date.now();
    const elapsed = now - lastRun;
    const interval = config.scheduler.interval;

    if (elapsed >= interval) {
      logger.info(`Interval elapsed (${Math.round(elapsed / 1000 / 60)} min since last run)`);
      return true;
    }

    const remaining = Math.round((interval - elapsed) / 1000 / 60);
    logger.info(`Skipping: ${remaining} minutes remaining until next scheduled run`);
    return false;
  } catch (err) {
    logger.warn(`Error reading last run time: ${err.message} — proceeding anyway`);
    return true;
  }
}

/**
 * Records the current run timestamp.
 */
export function recordRunSync() {
  try {
    ensureDir(PATHS.LOGS);
    writeFileSync(LAST_RUN_FILE, new Date().toISOString(), 'utf-8');
    logger.debug('Recorded last run timestamp');
  } catch (err) {
    logger.error('Failed to record run timestamp', { error: err.message });
  }
}

/**
 * Logs and records a scheduler execution.
 * @param {object} result
 * @param {string[]} result.generators - Generators that were run
 * @param {number} result.duration - Duration in ms
 * @param {string[]} result.changedFiles - Files that changed
 */
export function recordExecution(result) {
  recordRunSync();

  logSchedulerEvent({
    action: result.changedFiles.length > 0 ? 'completed' : 'completed-no-changes',
    generators: result.generators,
    duration: result.duration,
  });
}

/**
 * Gets scheduler execution history.
 * @param {number} [count=10]
 * @returns {string[]}
 */
export function getExecutionHistory(count = 10) {
  return getRecentLogEntries(LOG_FILES.SCHEDULER, count);
}
