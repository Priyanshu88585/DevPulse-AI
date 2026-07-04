/**
 * @module app/main
 * @description Application entry point. Orchestrates: bootstrap → schedule check → generate → commit → log.
 */

import { bootstrap } from './bootstrap.js';
import { shouldRun, recordExecution } from './scheduler.js';
import { runAllGenerators } from '../generators/updateGenerator.js';
import { performCommit } from '../services/commit.service.js';
import { logHistoryEvent } from '../services/log.service.js';
import { detectEnvironment } from '../services/github.service.js';
import logger from '../utils/logger.js';

/**
 * Main execution pipeline.
 * @param {object} [options]
 * @param {boolean} [options.force=false] - Skip schedule check and force generation
 * @param {boolean} [options.dryRun=false] - Generate but don't commit
 * @param {string[]} [options.only] - Run only specific generators
 * @returns {Promise<{ success: boolean, changedFiles: string[], errors: string[] }>}
 */
export async function main(options = {}) {
  const startTime = performance.now();

  try {
    // ── Bootstrap ─────────────────────────────────────────────────────
    const bootResult = await bootstrap();
    if (!bootResult.success) {
      logger.error('Bootstrap failed — aborting');
      return { success: false, changedFiles: [], errors: bootResult.errors };
    }

    // ── Environment Detection ─────────────────────────────────────────
    detectEnvironment();

    // ── Schedule Check ────────────────────────────────────────────────
    if (!options.force && !shouldRun()) {
      logger.info('Scheduler determined no run is needed. Use --force to override.');
      return { success: true, changedFiles: [], errors: [] };
    }

    // ── Run Generators ────────────────────────────────────────────────
    logger.info('━'.repeat(50));
    logger.info('Starting documentation generation...');
    logger.info('━'.repeat(50));

    const genResult = await runAllGenerators({ only: options.only });

    // ── Commit (unless dry run) ───────────────────────────────────────
    if (!options.dryRun && genResult.changedFiles.length > 0) {
      logger.info('Committing changes...');
      const commitResult = await performCommit(genResult.changedFiles);

      if (commitResult.committed) {
        logHistoryEvent('commit', `Committed ${genResult.changedFiles.length} file(s): ${commitResult.message}`);
      }
    } else if (options.dryRun) {
      logger.info('🏜️  Dry run mode — skipping commit');
    } else {
      logger.info('No files changed — nothing to commit');
    }

    // ── Record Execution ──────────────────────────────────────────────
    const duration = Math.round(performance.now() - startTime);
    recordExecution({
      generators: genResult.results.map(r => r.name),
      duration,
      changedFiles: genResult.changedFiles,
    });

    // ── Summary ───────────────────────────────────────────────────────
    logger.info('━'.repeat(50));
    logger.info('📊 Execution Summary');
    logger.info(`   Generators run: ${genResult.results.length}`);
    logger.info(`   Files changed:  ${genResult.changedFiles.length}`);
    logger.info(`   Errors:         ${genResult.errors.length}`);
    logger.info(`   Duration:       ${duration}ms`);
    logger.info('━'.repeat(50));

    if (genResult.errors.length > 0) {
      logger.warn('Completed with errors:', { errors: genResult.errors });
    }

    return {
      success: genResult.errors.length === 0,
      changedFiles: genResult.changedFiles,
      errors: genResult.errors,
    };

  } catch (err) {
    logger.error('Fatal error in main execution', { error: err.message, stack: err.stack });
    logHistoryEvent('error', `Fatal: ${err.message}`);
    return { success: false, changedFiles: [], errors: [err.message] };
  }
}

// ── CLI Entry Point ─────────────────────────────────────────────────────────
// When run directly (not imported), execute main with CLI args
const isDirectRun = process.argv[1]?.endsWith('main.js') ||
                     process.argv[1]?.endsWith('start.js');

if (isDirectRun && import.meta.url.endsWith(process.argv[1]?.split('/').pop())) {
  const args = process.argv.slice(2);
  const options = {
    force: args.includes('--force') || args.includes('-f'),
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    only: args.includes('--only') ? args[args.indexOf('--only') + 1]?.split(',') : undefined,
  };

  main(options).then(result => {
    process.exit(result.success ? 0 : 1);
  });
}
