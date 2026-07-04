/**
 * @module generators/randomTextGenerator
 * @description Curated phrase pools for natural-sounding documentation.
 * Never generates gibberish — all phrases are project-relevant and meaningful.
 */

import { pickRandom, pickMultiple } from '../utils/random.js';

/**
 * Status descriptions for project health.
 */
const STATUS_DESCRIPTIONS = [
  'The project is progressing steadily with all systems operational.',
  'Development is on track with milestone targets being met as planned.',
  'The team has been focused on improving code quality and test coverage.',
  'Recent efforts have centered on documentation improvements and automation.',
  'Infrastructure and CI/CD pipeline optimizations have been the primary focus.',
  'The codebase has been stabilized with improved error handling throughout.',
  'Performance optimizations have yielded measurable improvements in execution speed.',
  'The project architecture has been refined for better extensibility.',
];

/**
 * Sprint summary phrases.
 */
const SPRINT_SUMMARIES = [
  'This sprint focused on stabilizing core functionality and improving test coverage.',
  'Key deliverables included documentation updates and generator improvements.',
  'The sprint prioritized bug fixes and performance optimizations.',
  'Major progress was made on the automation pipeline and CI/CD workflows.',
  'This sprint addressed technical debt and improved code maintainability.',
  'Focus areas included error handling improvements and logging enhancements.',
  'Template rendering and markdown formatting received significant improvements.',
  'The sprint delivered improvements to the scheduling and commit automation systems.',
];

/**
 * Improvement descriptions.
 */
const IMPROVEMENTS = [
  'Enhanced error handling with descriptive messages and stack traces',
  'Improved markdown output formatting for better readability',
  'Optimized file I/O operations to reduce unnecessary disk writes',
  'Refined configuration validation with detailed error reporting',
  'Updated template system with better placeholder resolution',
  'Strengthened input validation across all service modules',
  'Improved logging with structured metadata and level filtering',
  'Enhanced change detection accuracy using SHA-256 content hashing',
  'Refined commit message selection for more contextual messages',
  'Optimized generator execution order for efficiency',
];

/**
 * Next step / priority descriptions.
 */
const NEXT_PRIORITIES = [
  'Expand unit test coverage to achieve 90%+ code coverage',
  'Complete API reference documentation for all public modules',
  'Implement plugin architecture for custom generator support',
  'Add support for multi-repository documentation generation',
  'Create interactive project dashboard with real-time metrics',
  'Implement GitHub Issues synchronization for task tracking',
  'Build automated release note generation from commit history',
  'Add support for custom markdown themes and templates',
  'Implement project health scoring based on multiple indicators',
  'Create contributor analytics and statistics dashboard',
];

/**
 * Blocker descriptions.
 */
const BLOCKERS = [
  'GitHub Actions rate limiting during peak hours may delay scheduled runs',
  'Template rendering edge cases with nested placeholders need resolution',
  'Cross-platform path handling differences between CI and local environments',
];

// ── Public API ──────────────────────────────────────────────────────────────

export function getStatusDescription() {
  return pickRandom(STATUS_DESCRIPTIONS);
}

export function getSprintSummary() {
  return pickRandom(SPRINT_SUMMARIES);
}

export function getImprovements(count = 3) {
  return pickMultiple(IMPROVEMENTS, count);
}

export function getNextPriorities(count = 3) {
  return pickMultiple(NEXT_PRIORITIES, count);
}

export function getBlockerDescription() {
  return pickRandom(BLOCKERS);
}

/**
 * Gets a varied commit message prefix.
 */
const COMMIT_PREFIXES = [
  'docs: update',
  'chore: refresh',
  'docs: improve',
  'chore: maintain',
  'docs: synchronize',
];

export function getCommitPrefix() {
  return pickRandom(COMMIT_PREFIXES);
}

/**
 * Gets a section transition phrase for between document sections.
 */
const TRANSITIONS = [
  'The following sections provide detailed information:',
  'Below is a breakdown of the current state:',
  'Here is an overview of the latest updates:',
  'The details are organized as follows:',
];

export function getTransition() {
  return pickRandom(TRANSITIONS);
}
