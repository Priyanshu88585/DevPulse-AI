/**
 * @module tests/scheduler.test
 * @description Unit tests for the scheduler module.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ensureDir } from '../utils/file.js';
import { PATHS } from '../app/constants.js';

import { join } from 'path';
import { rmSync, existsSync } from 'fs';

beforeAll(() => {
  ensureDir(PATHS.LOGS);
  const lastRunFile = join(PATHS.LOGS, '.last_run');
  if (existsSync(lastRunFile)) {
    rmSync(lastRunFile, { force: true });
  }
});

import { shouldRun, getExecutionHistory } from '../app/scheduler.js';

describe('scheduler', () => {
  it('shouldRun returns boolean', () => {
    const result = shouldRun();
    expect(typeof result).toBe('boolean');
  });

  it('shouldRun returns true on first run (no history)', () => {
    // First run should always return true since there's no last run file
    // (or it should be true based on interval elapsed)
    const result = shouldRun();
    expect(result).toBe(true);
  });

  it('getExecutionHistory returns array', () => {
    const history = getExecutionHistory(5);
    expect(Array.isArray(history)).toBe(true);
  });
});
