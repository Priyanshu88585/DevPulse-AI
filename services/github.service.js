/**
 * @module services/github.service
 * @description GitHub environment detection and repository metadata.
 */

import config from '../app/config.js';
import * as git from '../utils/git.js';
import logger from '../utils/logger.js';

/**
 * Detects the current execution environment.
 * @returns {{ isGitHubActions: boolean, isCI: boolean, isLocal: boolean, event?: string, runId?: string }}
 */
export function detectEnvironment() {
  const env = {
    isGitHubActions: !!process.env.GITHUB_ACTIONS,
    isCI: !!process.env.CI,
    isLocal: !process.env.CI && !process.env.GITHUB_ACTIONS,
  };

  if (env.isGitHubActions) {
    env.event = process.env.GITHUB_EVENT_NAME || 'unknown';
    env.runId = process.env.GITHUB_RUN_ID || 'unknown';
    env.repository = process.env.GITHUB_REPOSITORY || '';
    env.ref = process.env.GITHUB_REF || '';
    env.actor = process.env.GITHUB_ACTOR || '';
    logger.info('Running in GitHub Actions environment', {
      event: env.event,
      runId: env.runId,
    });
  } else if (env.isCI) {
    logger.info('Running in CI environment');
  } else {
    logger.info('Running in local development environment');
  }

  return env;
}

/**
 * Gets repository metadata combining git info and environment variables.
 * @returns {{ name: string, url: string, branch: string|null, lastCommit: string|null, commitCount: number }}
 */
export function getRepositoryMetadata() {
  const repoInfo = git.isGitRepo() ? git.getRepoInfo() : {};
  const commitCount = git.isGitRepo() ? git.getCommitCount() : 0;

  return {
    name: config.project.name,
    url: repoInfo.remoteUrl || config.project.repository || '',
    branch: repoInfo.branch || null,
    lastCommit: repoInfo.lastCommit || null,
    commitCount,
  };
}

/**
 * Checks if the current GitHub Actions token has push permissions.
 * In practice this is determined by whether GITHUB_TOKEN is set.
 * @returns {boolean}
 */
export function hasWritePermissions() {
  if (!process.env.GITHUB_ACTIONS) return true; // Local always has write
  return !!process.env.GITHUB_TOKEN;
}

/**
 * Gets the GitHub Actions workflow context if running in Actions.
 * @returns {object|null}
 */
export function getWorkflowContext() {
  if (!process.env.GITHUB_ACTIONS) return null;

  return {
    workflow: process.env.GITHUB_WORKFLOW || 'unknown',
    action: process.env.GITHUB_ACTION || 'unknown',
    actor: process.env.GITHUB_ACTOR || 'unknown',
    repository: process.env.GITHUB_REPOSITORY || 'unknown',
    eventName: process.env.GITHUB_EVENT_NAME || 'unknown',
    ref: process.env.GITHUB_REF || 'unknown',
    sha: process.env.GITHUB_SHA || 'unknown',
    runNumber: process.env.GITHUB_RUN_NUMBER || '0',
    runId: process.env.GITHUB_RUN_ID || '0',
  };
}
