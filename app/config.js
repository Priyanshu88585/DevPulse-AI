/**
 * @module app/config
 * @description Central configuration for the GitHub Contributions engine.
 * Merges defaults with environment variables and data/settings.json overrides.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  PROJECT_ROOT,
  PATHS,
  GENERATOR_NAMES,
  INTERVALS,
  OUTPUT_FILES,
} from './constants.js';

// ── Load settings.json if available ─────────────────────────────────────────
let userSettings = {};
const settingsPath = join(PATHS.DATA, 'settings.json');
try {
  if (existsSync(settingsPath)) {
    userSettings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
  }
} catch {
  // Settings file missing or malformed — use defaults
}

// ── Environment helpers ─────────────────────────────────────────────────────
const env = (key, fallback) => process.env[key] ?? fallback;
const envBool = (key, fallback) => {
  const val = process.env[key];
  if (val === undefined) return fallback;
  return val === 'true' || val === '1';
};

// ── Configuration Object ────────────────────────────────────────────────────
const config = Object.freeze({

  // ── Project Metadata ────────────────────────────────────────────────────
  project: {
    name:        userSettings.name        || env('PROJECT_NAME', 'DevPulse AI'),
    version:     userSettings.version     || env('PROJECT_VERSION', '1.0.0'),
    description: userSettings.description || 'Intelligent Project Documentation & Progress Automation',
    repository:  userSettings.repository  || env('REPO_URL', ''),
    author:      userSettings.author      || env('AUTHOR', 'DevPulse AI Team'),
    license:     userSettings.license     || 'MIT',
  },

  // ── Paths ───────────────────────────────────────────────────────────────
  paths: {
    root:      PROJECT_ROOT,
    data:      PATHS.DATA,
    output:    PATHS.OUTPUT,
    templates: PATHS.TEMPLATES,
    logs:      PATHS.LOGS,
    reports:   PATHS.REPORTS,
    docs:      PATHS.DOCS,
    assets:    PATHS.ASSETS,
  },

  // ── Scheduler ───────────────────────────────────────────────────────────
  scheduler: {
    interval:    parseInt(env('SCHEDULE_INTERVAL', INTERVALS.SIX_HOURS), 10),
    timezone:    env('TZ', 'UTC'),
    maxRetries:  3,
    retryDelay:  5000,
  },

  // ── Generators ──────────────────────────────────────────────────────────
  generators: {
    enabled: userSettings.enabledGenerators || [
      GENERATOR_NAMES.PROGRESS,
      GENERATOR_NAMES.ROADMAP,
      GENERATOR_NAMES.CHANGELOG,
      GENERATOR_NAMES.METRICS,
      GENERATOR_NAMES.TODO,
      GENERATOR_NAMES.RELEASE,
    ],
    outputMap: {
      [GENERATOR_NAMES.PROGRESS]:  OUTPUT_FILES.PROGRESS,
      [GENERATOR_NAMES.ROADMAP]:   OUTPUT_FILES.ROADMAP,
      [GENERATOR_NAMES.CHANGELOG]: OUTPUT_FILES.CHANGELOG,
      [GENERATOR_NAMES.METRICS]:   OUTPUT_FILES.METRICS,
      [GENERATOR_NAMES.TODO]:      OUTPUT_FILES.TODO,
      [GENERATOR_NAMES.RELEASE]:   OUTPUT_FILES.RELEASES,
    },
  },

  // ── Git / Commit ────────────────────────────────────────────────────────
  git: {
    userName:   env('GIT_USER_NAME', 'GitHub Contributions Bot'),
    userEmail:  env('GIT_USER_EMAIL', 'bot@github-contributions.dev'),
    autoCommit: envBool('AUTO_COMMIT', true),
    autoPush:   envBool('AUTO_PUSH', false),
    branch:     env('GIT_BRANCH', 'main'),
  },

  // ── Logging ─────────────────────────────────────────────────────────────
  logging: {
    level:       env('LOG_LEVEL', 'INFO'),
    toConsole:   envBool('LOG_CONSOLE', true),
    toFile:      envBool('LOG_FILE', true),
    maxFileSize: 1024 * 1024, // 1 MB before rotation
  },

  // ── Environment ─────────────────────────────────────────────────────────
  env: {
    nodeEnv:     env('NODE_ENV', 'production'),
    isCI:        envBool('CI', false),
    isGitHubActions: !!process.env.GITHUB_ACTIONS,
  },
});

export default config;
