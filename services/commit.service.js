/**
 * @module services/commit.service
 * @description Manages the git commit workflow: staging, committing, and pushing changes.
 */

import config from '../app/config.js';
import { COMMIT_MESSAGES } from '../app/constants.js';
import * as git from '../utils/git.js';
import { pickRandom } from '../utils/random.js';
import { logCommitEvent } from './log.service.js';
import logger from '../utils/logger.js';

/**
 * Selects an appropriate commit message, optionally based on the files changed.
 * @param {string[]} [changedFiles=[]] - List of changed file names
 * @returns {string}
 */
export function selectCommitMessage(changedFiles = []) {
  // Try to pick a contextual message based on what changed
  const contextualMessages = {
    'PROGRESS.md':  'docs: update development progress',
    'ROADMAP.md':   'chore: synchronize roadmap',
    'CHANGELOG.md': 'docs: update changelog entries',
    'METRICS.md':   'docs: refresh project metrics',
    'TODO.md':      'chore: refresh task tracker',
    'RELEASES.md':  'docs: improve release notes',
    'STATUS.md':    'docs: update project status',
  };

  // If only one file changed, use a specific message
  if (changedFiles.length === 1) {
    const filename = changedFiles[0].split('/').pop();
    if (contextualMessages[filename]) {
      return contextualMessages[filename];
    }
  }

  // Otherwise, pick a general commit message
  return pickRandom(COMMIT_MESSAGES);
}

/**
 * Performs the full commit workflow:
 * 1. Configures git user (if in CI)
 * 2. Stages changed files
 * 3. Creates commit with meaningful message
 * 4. Optionally pushes to remote
 *
 * @param {string[]} changedFiles - Files that were updated by generators
 * @param {object} [options]
 * @param {string} [options.message] - Override commit message
 * @param {boolean} [options.push] - Override push behavior
 * @returns {{ committed: boolean, message: string, hash: string|null }}
 */
export async function performCommit(changedFiles, options = {}) {
  const result = { committed: false, message: '', hash: null };

  try {
    // Check if auto-commit is enabled
    if (!config.git.autoCommit) {
      logger.info('Auto-commit is disabled, skipping commit');
      return result;
    }

    // Check if we're in a git repo
    if (!git.isGitRepo()) {
      logger.warn('Not a git repository, skipping commit');
      return result;
    }

    // Check if there are actually changes
    if (!changedFiles || changedFiles.length === 0) {
      logger.info('No files changed, nothing to commit');
      return result;
    }

    // Configure git user in CI environments
    if (config.env.isGitHubActions || config.env.isCI) {
      git.configureUser(config.git.userName, config.git.userEmail);
    }

    // Select commit message
    const message = options.message || selectCommitMessage(changedFiles);

    // Stage and commit
    const shouldPush = options.push ?? config.git.autoPush;
    git.commitAndPush(message, {
      files: changedFiles,
      push: shouldPush,
      branch: config.git.branch,
    });

    result.committed = true;
    result.message = message;
    result.hash = git.getLastCommitHash();

    // Log the commit event
    logCommitEvent({
      hash: result.hash,
      message,
      files: changedFiles,
    });

    logger.info(`Commit successful: ${message}`, {
      hash: result.hash,
      filesChanged: changedFiles.length,
    });

  } catch (err) {
    logger.error('Commit failed', { error: err.message });
    result.committed = false;
  }

  return result;
}

/**
 * Gets a summary of the current git status.
 * @returns {{ isRepo: boolean, branch: string|null, hasChanges: boolean, changedFiles: string[] }}
 */
export function getGitStatus() {
  const isRepo = git.isGitRepo();
  return {
    isRepo,
    branch: isRepo ? git.getCurrentBranch() : null,
    hasChanges: isRepo ? git.hasUncommittedChanges() : false,
    changedFiles: isRepo ? git.getChangedFiles() : [],
  };
}
