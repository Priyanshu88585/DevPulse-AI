/**
 * @module app/constants
 * @description Centralized constants for the GitHub Contributions project.
 * All magic strings, paths, generator names, and enumerations live here.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ── Project Root ────────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const PROJECT_ROOT = join(__dirname, '..');

// ── Directory Paths ─────────────────────────────────────────────────────────
export const PATHS = Object.freeze({
  APP:        join(PROJECT_ROOT, 'app'),
  SERVICES:   join(PROJECT_ROOT, 'services'),
  GENERATORS: join(PROJECT_ROOT, 'generators'),
  UTILS:      join(PROJECT_ROOT, 'utils'),
  DATA:       join(PROJECT_ROOT, 'data'),
  LOGS:       join(PROJECT_ROOT, 'logs'),
  OUTPUT:     join(PROJECT_ROOT, 'output'),
  TEMPLATES:  join(PROJECT_ROOT, 'templates'),
  REPORTS:    join(PROJECT_ROOT, 'reports'),
  SCRIPTS:    join(PROJECT_ROOT, 'scripts'),
  DOCS:       join(PROJECT_ROOT, 'docs'),
  ASSETS:     join(PROJECT_ROOT, 'assets'),
  TESTS:      join(PROJECT_ROOT, 'tests'),
});

// ── Report Subdirectories ───────────────────────────────────────────────────
export const REPORT_DIRS = Object.freeze({
  DAILY:   join(PATHS.REPORTS, 'daily'),
  WEEKLY:  join(PATHS.REPORTS, 'weekly'),
  MONTHLY: join(PATHS.REPORTS, 'monthly'),
  YEARLY:  join(PATHS.REPORTS, 'yearly'),
});

// ── Output File Names ───────────────────────────────────────────────────────
export const OUTPUT_FILES = Object.freeze({
  README:    'README.md',
  CHANGELOG: 'CHANGELOG.md',
  ROADMAP:   'ROADMAP.md',
  STATUS:    'STATUS.md',
  PROGRESS:  'PROGRESS.md',
  TODO:      'TODO.md',
  RELEASES:  'RELEASES.md',
  METRICS:   'METRICS.md',
});

// ── Data File Names ─────────────────────────────────────────────────────────
export const DATA_FILES = Object.freeze({
  SETTINGS:    'settings.json',
  ROADMAP:     'roadmap.json',
  PROGRESS:    'progress.json',
  MILESTONES:  'milestones.json',
  VERSIONS:    'versions.json',
  COMMITS:     'commits.json',
  DEVELOPERS:  'developers.json',
});

// ── Log File Names ──────────────────────────────────────────────────────────
export const LOG_FILES = Object.freeze({
  ACTIVITY:  'activity.log',
  SCHEDULER: 'scheduler.log',
  COMMITS:   'commits.log',
  HISTORY:   'history.log',
  ERRORS:    'errors.log',
});

// ── Generator Names ─────────────────────────────────────────────────────────
export const GENERATOR_NAMES = Object.freeze({
  PROGRESS:  'progress',
  ROADMAP:   'roadmap',
  CHANGELOG: 'changelog',
  METRICS:   'metrics',
  TODO:      'todo',
  RELEASE:   'release',
});

// ── Template File Names ─────────────────────────────────────────────────────
export const TEMPLATE_FILES = Object.freeze({
  CHANGELOG: 'changelog.template.md',
  ROADMAP:   'roadmap.template.md',
  PROGRESS:  'progress.template.md',
  METRICS:   'metrics.template.md',
  TODO:      'todo.template.md',
  RELEASE:   'release.template.md',
});

// ── Commit Message Templates ────────────────────────────────────────────────
export const COMMIT_MESSAGES = Object.freeze([
  'docs: update project status',
  'docs: refresh development metrics',
  'chore: synchronize roadmap',
  'docs: update weekly progress',
  'chore: refresh task tracker',
  'docs: improve release notes',
  'docs: update milestone overview',
  'chore: maintain project documentation',
  'docs: update changelog entries',
  'docs: refresh project metrics',
  'chore: update documentation files',
  'docs: synchronize project status',
  'docs: update development progress',
  'chore: refresh documentation suite',
  'docs: maintain project records',
]);

// ── Changelog Categories ────────────────────────────────────────────────────
export const CHANGELOG_CATEGORIES = Object.freeze([
  'Added',
  'Changed',
  'Fixed',
  'Improved',
  'Documentation',
]);

// ── Task Priorities ─────────────────────────────────────────────────────────
export const TASK_PRIORITIES = Object.freeze({
  HIGH:      'high',
  MEDIUM:    'medium',
  LOW:       'low',
  COMPLETED: 'completed',
  FUTURE:    'future',
});

// ── Milestone Statuses ──────────────────────────────────────────────────────
export const MILESTONE_STATUS = Object.freeze({
  COMPLETED:   'completed',
  IN_PROGRESS: 'in-progress',
  PLANNED:     'planned',
  FUTURE:      'future',
});

// ── Log Levels ──────────────────────────────────────────────────────────────
export const LOG_LEVELS = Object.freeze({
  DEBUG: 'DEBUG',
  INFO:  'INFO',
  WARN:  'WARN',
  ERROR: 'ERROR',
});

// ── Schedule Intervals (milliseconds) ───────────────────────────────────────
export const INTERVALS = Object.freeze({
  SIX_HOURS:    6 * 60 * 60 * 1000,
  TWELVE_HOURS: 12 * 60 * 60 * 1000,
  DAILY:        24 * 60 * 60 * 1000,
});

// ── Version ─────────────────────────────────────────────────────────────────
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'DevPulse AI';
