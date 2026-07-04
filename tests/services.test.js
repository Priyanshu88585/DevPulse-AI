/**
 * @module tests/services.test
 * @description Unit tests for service modules.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ensureDir } from '../utils/file.js';
import { PATHS } from '../app/constants.js';

beforeAll(() => {
  ensureDir(PATHS.OUTPUT);
  ensureDir(PATHS.LOGS);
});

// ── Markdown Service ────────────────────────────────────────────────────────
import {
  renderTemplate,
  composeDocument,
  documentHeader,
  documentFooter,
} from '../services/markdown.service.js';

describe('markdown.service', () => {
  it('renderTemplate replaces placeholders', () => {
    const template = 'Hello {{name}}, version {{version}}!';
    const result = renderTemplate(template, { name: 'World', version: '1.0' });
    expect(result).toBe('Hello World, version 1.0!');
  });

  it('renderTemplate leaves unresolved placeholders', () => {
    const template = 'Hello {{name}}, {{missing}}!';
    const result = renderTemplate(template, { name: 'World' });
    expect(result).toBe('Hello World, {{missing}}!');
  });

  it('renderTemplate handles empty template', () => {
    expect(renderTemplate('', {})).toBe('');
    expect(renderTemplate(null, {})).toBe('');
  });

  it('composeDocument joins sections', () => {
    const result = composeDocument('A', 'B', 'C');
    expect(result).toContain('A');
    expect(result).toContain('B');
    expect(result).toContain('C');
  });

  it('documentHeader creates proper header', () => {
    const header = documentHeader('Title', { description: 'Desc', lastUpdated: '2025-01-01' });
    expect(header).toContain('# Title');
    expect(header).toContain('Desc');
    expect(header).toContain('2025-01-01');
  });

  it('documentFooter includes project name', () => {
    const footer = documentFooter('MyProject');
    expect(footer).toContain('MyProject');
  });
});

// ── Changelog Service ───────────────────────────────────────────────────────
import {
  loadVersions,
  getLatestVersion,
  getCurrentVersionString,
  formatVersionEntry,
  getChangelogStats,
} from '../services/changelog.service.js';

describe('changelog.service', () => {
  it('loadVersions returns array', () => {
    const versions = loadVersions();
    expect(Array.isArray(versions)).toBe(true);
    expect(versions.length).toBeGreaterThan(0);
  });

  it('getLatestVersion returns first version', () => {
    const latest = getLatestVersion();
    expect(latest).toBeDefined();
    expect(latest.version).toBe('1.0.0');
  });

  it('getCurrentVersionString returns version string', () => {
    const version = getCurrentVersionString();
    expect(version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('formatVersionEntry produces markdown', () => {
    const entry = {
      version: '1.0.0',
      date: '2025-06-01',
      title: 'Test',
      changes: { Added: ['Feature A'], Fixed: ['Bug B'] },
    };
    const result = formatVersionEntry(entry);
    expect(result).toContain('[1.0.0]');
    expect(result).toContain('Feature A');
    expect(result).toContain('Bug B');
  });

  it('getChangelogStats returns stats object', () => {
    const stats = getChangelogStats();
    expect(stats.totalVersions).toBeGreaterThan(0);
    expect(stats.totalChanges).toBeGreaterThan(0);
    expect(stats.latestVersion).toBeDefined();
  });
});

// ── Metrics Service ─────────────────────────────────────────────────────────
import { computeMetrics, getMetricsSummary } from '../services/metrics.service.js';

describe('metrics.service', () => {
  it('computeMetrics returns metrics object', () => {
    const metrics = computeMetrics();
    expect(metrics).toHaveProperty('documentationPages');
    expect(metrics).toHaveProperty('totalMilestones');
    expect(metrics).toHaveProperty('totalTasks');
    expect(metrics).toHaveProperty('completedTasks');
    expect(metrics).toHaveProperty('taskCompletionRate');
    expect(typeof metrics.taskCompletionRate).toBe('number');
  });

  it('getMetricsSummary returns summary', () => {
    const summary = getMetricsSummary();
    expect(summary).toHaveProperty('version');
    expect(summary).toHaveProperty('tasks');
    expect(summary).toHaveProperty('milestones');
    expect(summary).toHaveProperty('docs');
  });
});

// ── Task Service ────────────────────────────────────────────────────────────
import {
  getTasksByPriority,
  getTaskStats,
  getAllTasks,
} from '../services/task.service.js';

describe('task.service', () => {
  it('getTasksByPriority returns priority groups', () => {
    const tasks = getTasksByPriority();
    expect(tasks).toHaveProperty('high');
    expect(tasks).toHaveProperty('medium');
    expect(tasks).toHaveProperty('low');
    expect(tasks).toHaveProperty('completed');
    expect(tasks).toHaveProperty('future');
  });

  it('getTaskStats returns counts', () => {
    const stats = getTaskStats();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.high).toBeGreaterThanOrEqual(0);
    expect(stats.completed).toBeGreaterThan(0);
  });

  it('getAllTasks returns flat list', () => {
    const tasks = getAllTasks();
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks[0]).toHaveProperty('title');
    expect(tasks[0]).toHaveProperty('priority');
  });
});

// ── Timeline Service ────────────────────────────────────────────────────────
import {
  getSprintInfo,
  getMilestonesByStatus,
  getOverallProgress,
} from '../services/timeline.service.js';

describe('timeline.service', () => {
  it('getSprintInfo returns sprint data', () => {
    const sprint = getSprintInfo();
    expect(sprint.number).toBeGreaterThan(0);
    expect(sprint.start).toBeDefined();
    expect(sprint.end).toBeDefined();
    expect(sprint.daysRemaining).toBeGreaterThanOrEqual(0);
  });

  it('getMilestonesByStatus groups milestones', () => {
    const milestones = getMilestonesByStatus();
    expect(milestones).toHaveProperty('completed');
    expect(milestones).toHaveProperty('inProgress');
    expect(milestones).toHaveProperty('planned');
    expect(milestones).toHaveProperty('future');
  });

  it('getOverallProgress returns 0-100', () => {
    const progress = getOverallProgress();
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });
});

// ── Commit Service ──────────────────────────────────────────────────────────
import { selectCommitMessage } from '../services/commit.service.js';

describe('commit.service', () => {
  it('selectCommitMessage returns contextual message for single file', () => {
    const msg = selectCommitMessage(['output/PROGRESS.md']);
    expect(msg).toContain('progress');
  });

  it('selectCommitMessage returns general message for multiple files', () => {
    const msg = selectCommitMessage(['output/PROGRESS.md', 'output/METRICS.md']);
    expect(typeof msg).toBe('string');
    expect(msg.length).toBeGreaterThan(0);
  });
});
