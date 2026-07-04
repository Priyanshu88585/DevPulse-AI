/**
 * @module app/bootstrap
 * @description Initialization: ensures directories exist, validates config, loads data.
 */

import { PATHS, REPORT_DIRS } from './constants.js';
import config from './config.js';
import { ensureDir } from '../utils/file.js';
import { validateConfig } from '../utils/validator.js';
import logger from '../utils/logger.js';

/**
 * Bootstraps the application:
 * 1. Creates all required directories
 * 2. Validates configuration
 * 3. Logs startup info
 *
 * @returns {{ success: boolean, errors: string[] }}
 */
export async function bootstrap() {
  const done = logger.time('Bootstrap');

  // ── Create required directories ───────────────────────────────────────
  const directories = [
    PATHS.DATA,
    PATHS.LOGS,
    PATHS.OUTPUT,
    PATHS.TEMPLATES,
    PATHS.REPORTS,
    PATHS.DOCS,
    PATHS.ASSETS,
    REPORT_DIRS.DAILY,
    REPORT_DIRS.WEEKLY,
    REPORT_DIRS.MONTHLY,
    REPORT_DIRS.YEARLY,
  ];

  for (const dir of directories) {
    ensureDir(dir);
  }

  // ── Validate configuration ────────────────────────────────────────────
  const { valid, errors } = validateConfig(config);

  if (!valid) {
    logger.error('Configuration validation failed', { errors });
    done();
    return { success: false, errors };
  }

  // ── Startup info ──────────────────────────────────────────────────────
  logger.info(`🚀 ${config.project.name} v${config.project.version}`);
  logger.info(`   Environment: ${config.env.nodeEnv}`);
  logger.info(`   GitHub Actions: ${config.env.isGitHubActions ? 'Yes' : 'No'}`);
  logger.info(`   Enabled generators: ${config.generators.enabled.join(', ')}`);
  logger.info(`   Auto-commit: ${config.git.autoCommit}`);
  logger.info(`   Auto-push: ${config.git.autoPush}`);

  done();
  return { success: true, errors: [] };
}
