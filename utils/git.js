/**
 * @module utils/git
 * @description Git helper functions using child_process.
 */

import { execSync } from 'child_process';
import logger from './logger.js';
import { PROJECT_ROOT } from '../app/constants.js';

/**
 * Executes a git command in the project root directory.
 * @param {string} command - Git command (without the 'git' prefix)
 * @param {object} [options]
 * @param {boolean} [options.silent=false] - Suppress output logging
 * @returns {string} Trimmed stdout
 */
function execGit(command, { silent = false } = {}) {
  try {
    const result = execSync(`git ${command}`, {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : ['pipe', 'pipe', 'pipe'],
    });
    return result.trim();
  } catch (err) {
    const msg = err.stderr?.trim() || err.message;
    if (!silent) {
      logger.error(`Git command failed: git ${command}`, { error: msg });
    }
    throw new Error(`git ${command}: ${msg}`);
  }
}

/**
 * Checks if the current directory is a git repository.
 * @returns {boolean}
 */
export function isGitRepo() {
  try {
    execGit('rev-parse --is-inside-work-tree', { silent: true });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets the hash of the last commit.
 * @returns {string|null}
 */
export function getLastCommitHash() {
  try {
    return execGit('rev-parse --short HEAD', { silent: true });
  } catch {
    return null;
  }
}

/**
 * Gets the current branch name.
 * @returns {string|null}
 */
export function getCurrentBranch() {
  try {
    return execGit('rev-parse --abbrev-ref HEAD', { silent: true });
  } catch {
    return null;
  }
}

/**
 * Gets basic repository info.
 * @returns {{ branch: string|null, lastCommit: string|null, remoteUrl: string|null }}
 */
export function getRepoInfo() {
  let remoteUrl = null;
  try {
    remoteUrl = execGit('remote get-url origin', { silent: true });
  } catch {
    // no remote configured
  }

  return {
    branch: getCurrentBranch(),
    lastCommit: getLastCommitHash(),
    remoteUrl,
  };
}

/**
 * Checks if there are uncommitted changes (staged or unstaged).
 * @returns {boolean}
 */
export function hasUncommittedChanges() {
  try {
    const status = execGit('status --porcelain', { silent: true });
    return status.length > 0;
  } catch {
    return false;
  }
}

/**
 * Gets list of changed files.
 * @returns {string[]}
 */
export function getChangedFiles() {
  try {
    const status = execGit('status --porcelain', { silent: true });
    if (!status) return [];
    return status.split('\n').map(line => line.trim().replace(/^..\s+/, ''));
  } catch {
    return [];
  }
}

/**
 * Stages specific files for commit.
 * @param {string[]} files - File paths relative to project root
 */
export function stageFiles(files) {
  if (!files || files.length === 0) return;
  execGit(`add ${files.join(' ')}`);
  logger.debug(`Staged ${files.length} file(s)`);
}

/**
 * Stages all changes.
 */
export function stageAll() {
  execGit('add -A');
  logger.debug('Staged all changes');
}

/**
 * Creates a commit with the given message.
 * @param {string} message
 */
export function commit(message) {
  execGit(`commit -m "${message}"`);
  logger.info(`Committed: ${message}`);
}

/**
 * Pushes to the remote.
 * @param {string} [branch='main']
 */
export function push(branch = 'main') {
  execGit(`push origin ${branch}`);
  logger.info(`Pushed to origin/${branch}`);
}

/**
 * Configures git user name and email for commits.
 * @param {string} name
 * @param {string} email
 */
export function configureUser(name, email) {
  execGit(`config user.name "${name}"`, { silent: true });
  execGit(`config user.email "${email}"`, { silent: true });
  logger.debug(`Git user configured: ${name} <${email}>`);
}

/**
 * Full commit-and-push workflow.
 * @param {string} message
 * @param {object} [options]
 * @param {string[]} [options.files] - Specific files to stage (stages all if omitted)
 * @param {boolean} [options.push=false] - Whether to push after committing
 * @param {string} [options.branch='main'] - Branch to push to
 */
export function commitAndPush(message, { files, push: shouldPush = false, branch = 'main' } = {}) {
  if (!hasUncommittedChanges()) {
    logger.info('No changes to commit');
    return;
  }

  if (files && files.length > 0) {
    stageFiles(files);
  } else {
    stageAll();
  }

  commit(message);

  if (shouldPush) {
    push(branch);
  }
}

/**
 * Gets the total commit count in the repository.
 * @returns {number}
 */
export function getCommitCount() {
  try {
    const count = execGit('rev-list --count HEAD', { silent: true });
    return parseInt(count, 10) || 0;
  } catch {
    return 0;
  }
}
