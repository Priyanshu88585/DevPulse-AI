/**
 * @module generators/updateGenerator
 * @description Orchestrator that runs all enabled generators, detects changes,
 * and returns the list of updated files.
 */

import { join } from 'path';
import config from '../app/config.js';
import { PATHS, GENERATOR_NAMES } from '../app/constants.js';
import { ensureDir } from '../utils/file.js';
import logger from '../utils/logger.js';

// Import all generators
import progressGenerator from './progressGenerator.js';
import roadmapGenerator from './roadmapGenerator.js';
import changelogGenerator from './changelogGenerator.js';
import metricsGenerator from './metricsGenerator.js';
import todoGenerator from './todoGenerator.js';
import releaseGenerator from './releaseGenerator.js';

/**
 * Registry of all available generators.
 * Each generator implements { name: string, generate(): Promise<{ filename, content, changed }> }
 */
const GENERATOR_REGISTRY = {
  [GENERATOR_NAMES.PROGRESS]:  progressGenerator,
  [GENERATOR_NAMES.ROADMAP]:   roadmapGenerator,
  [GENERATOR_NAMES.CHANGELOG]: changelogGenerator,
  [GENERATOR_NAMES.METRICS]:   metricsGenerator,
  [GENERATOR_NAMES.TODO]:      todoGenerator,
  [GENERATOR_NAMES.RELEASE]:   releaseGenerator,
};

/**
 * Runs all enabled generators and collects results.
 *
 * @param {object} [options]
 * @param {string[]} [options.only] - Run only these generators (by name). Overrides config.
 * @param {boolean} [options.force=false] - Force regeneration even if content hasn't changed.
 * @returns {Promise<{ results: object[], changedFiles: string[], errors: string[] }>}
 */
export async function runAllGenerators(options = {}) {
  const done = logger.time('Update generator (all)');

  // Ensure output directory exists
  ensureDir(PATHS.OUTPUT);

  const enabledNames = options.only || config.generators.enabled;
  const results = [];
  const changedFiles = [];
  const errors = [];

  logger.info(`Running ${enabledNames.length} generator(s): ${enabledNames.join(', ')}`);

  for (const name of enabledNames) {
    const generator = GENERATOR_REGISTRY[name];

    if (!generator) {
      const msg = `Unknown generator: ${name}`;
      logger.warn(msg);
      errors.push(msg);
      continue;
    }

    try {
      const result = await generator.generate();
      results.push({
        name,
        filename: result.filename,
        changed: result.changed,
      });

      if (result.changed) {
        const relPath = join('output', result.filename);
        changedFiles.push(relPath);
        logger.info(`✏️  Updated: ${result.filename}`);
      } else {
        logger.debug(`⏭️  Unchanged: ${result.filename}`);
      }
    } catch (err) {
      const msg = `Generator "${name}" failed: ${err.message}`;
      logger.error(msg, { stack: err.stack });
      errors.push(msg);
    }
  }

  logger.info(`Generation complete: ${changedFiles.length} file(s) changed, ${errors.length} error(s)`);
  done();

  return { results, changedFiles, errors };
}

/**
 * Runs a single generator by name.
 * @param {string} name - Generator name from GENERATOR_NAMES
 * @returns {Promise<{ filename: string, content: string, changed: boolean }>}
 */
export async function runGenerator(name) {
  const generator = GENERATOR_REGISTRY[name];
  if (!generator) {
    throw new Error(`Unknown generator: ${name}`);
  }

  ensureDir(PATHS.OUTPUT);
  return generator.generate();
}

/**
 * Lists all registered generator names.
 * @returns {string[]}
 */
export function listGenerators() {
  return Object.keys(GENERATOR_REGISTRY);
}

/**
 * Checks if a generator name is registered.
 * @param {string} name
 * @returns {boolean}
 */
export function isValidGenerator(name) {
  return name in GENERATOR_REGISTRY;
}
