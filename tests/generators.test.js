/**
 * @module tests/generators.test
 * @description Unit tests for documentation generators.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ensureDir } from '../utils/file.js';
import { PATHS } from '../app/constants.js';

// Ensure output directory exists before tests
beforeAll(() => {
  ensureDir(PATHS.OUTPUT);
  ensureDir(PATHS.LOGS);
});

// ── Progress Generator ──────────────────────────────────────────────────────
import progressGenerator from '../generators/progressGenerator.js';

describe('progressGenerator', () => {
  it('has correct name', () => {
    expect(progressGenerator.name).toBe('progress');
  });

  it('generate() returns expected shape', async () => {
    const result = await progressGenerator.generate();
    expect(result).toHaveProperty('filename');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('changed');
    expect(result.filename).toBe('PROGRESS.md');
  });

  it('generates valid markdown', async () => {
    const result = await progressGenerator.generate();
    expect(result.content).toContain('# 📊 Development Progress');
    expect(result.content).toContain('Current Sprint');
    expect(result.content).toContain('Completed Work');
  });
});

// ── Roadmap Generator ───────────────────────────────────────────────────────
import roadmapGenerator from '../generators/roadmapGenerator.js';

describe('roadmapGenerator', () => {
  it('has correct name', () => {
    expect(roadmapGenerator.name).toBe('roadmap');
  });

  it('generate() returns expected shape', async () => {
    const result = await roadmapGenerator.generate();
    expect(result.filename).toBe('ROADMAP.md');
    expect(result.content).toBeTruthy();
  });

  it('includes milestone sections', async () => {
    const result = await roadmapGenerator.generate();
    expect(result.content).toContain('Roadmap');
    expect(result.content).toContain('Overall Progress');
  });
});

// ── Changelog Generator ─────────────────────────────────────────────────────
import changelogGenerator from '../generators/changelogGenerator.js';

describe('changelogGenerator', () => {
  it('has correct name', () => {
    expect(changelogGenerator.name).toBe('changelog');
  });

  it('generate() returns expected shape', async () => {
    const result = await changelogGenerator.generate();
    expect(result.filename).toBe('CHANGELOG.md');
    expect(result.content).toContain('Changelog');
  });

  it('includes version entries', async () => {
    const result = await changelogGenerator.generate();
    expect(result.content).toContain('1.0.0');
    expect(result.content).toContain('Added');
  });
});

// ── Metrics Generator ───────────────────────────────────────────────────────
import metricsGenerator from '../generators/metricsGenerator.js';

describe('metricsGenerator', () => {
  it('has correct name', () => {
    expect(metricsGenerator.name).toBe('metrics');
  });

  it('generate() returns expected shape', async () => {
    const result = await metricsGenerator.generate();
    expect(result.filename).toBe('METRICS.md');
    expect(result.content).toContain('Metrics');
  });

  it('includes statistics tables', async () => {
    const result = await metricsGenerator.generate();
    expect(result.content).toContain('Documentation Pages');
    expect(result.content).toContain('Task Completion');
  });
});

// ── TODO Generator ──────────────────────────────────────────────────────────
import todoGenerator from '../generators/todoGenerator.js';

describe('todoGenerator', () => {
  it('has correct name', () => {
    expect(todoGenerator.name).toBe('todo');
  });

  it('generate() returns expected shape', async () => {
    const result = await todoGenerator.generate();
    expect(result.filename).toBe('TODO.md');
    expect(result.content).toContain('Task Tracker');
  });

  it('includes priority sections', async () => {
    const result = await todoGenerator.generate();
    expect(result.content).toContain('High Priority');
    expect(result.content).toContain('Medium Priority');
    expect(result.content).toContain('Completed');
  });
});

// ── Release Generator ───────────────────────────────────────────────────────
import releaseGenerator from '../generators/releaseGenerator.js';

describe('releaseGenerator', () => {
  it('has correct name', () => {
    expect(releaseGenerator.name).toBe('release');
  });

  it('generate() returns expected shape', async () => {
    const result = await releaseGenerator.generate();
    expect(result.filename).toBe('RELEASES.md');
    expect(result.content).toContain('Releases');
  });

  it('includes version highlights', async () => {
    const result = await releaseGenerator.generate();
    expect(result.content).toContain('v1.0.0');
    expect(result.content).toContain('Highlights');
  });
});

// ── Update Orchestrator ─────────────────────────────────────────────────────
import { runAllGenerators, listGenerators, isValidGenerator } from '../generators/updateGenerator.js';

describe('updateGenerator', () => {
  it('listGenerators returns all generator names', () => {
    const names = listGenerators();
    expect(names).toContain('progress');
    expect(names).toContain('roadmap');
    expect(names).toContain('changelog');
    expect(names).toContain('metrics');
    expect(names).toContain('todo');
    expect(names).toContain('release');
  });

  it('isValidGenerator validates names', () => {
    expect(isValidGenerator('progress')).toBe(true);
    expect(isValidGenerator('nonexistent')).toBe(false);
  });

  it('runAllGenerators runs specified generators', async () => {
    const result = await runAllGenerators({ only: ['metrics'] });
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe('metrics');
    expect(result.errors).toHaveLength(0);
  });
});
