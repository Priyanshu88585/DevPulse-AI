/**
 * @module tests/utils.test
 * @description Unit tests for utility modules.
 */

import { describe, it, expect } from 'vitest';

// ── Date Utils ──────────────────────────────────────────────────────────────
import {
  formatDate,
  formatTimestamp,
  formatReadable,
  getRelativeTime,
  getCurrentSprint,
  getWeekNumber,
  getQuarter,
  daysAgo,
  isToday,
} from '../utils/date.js';

describe('utils/date', () => {
  it('formatDate returns YYYY-MM-DD', () => {
    const result = formatDate(new Date('2025-07-04T12:00:00Z'));
    expect(result).toBe('2025-07-04');
  });

  it('formatTimestamp returns ISO string', () => {
    const result = formatTimestamp(new Date('2025-07-04T12:00:00Z'));
    expect(result).toBe('2025-07-04T12:00:00.000Z');
  });

  it('formatReadable returns human-readable date', () => {
    const result = formatReadable(new Date('2025-07-04T12:00:00Z'));
    expect(result).toContain('July');
    expect(result).toContain('2025');
  });

  it('getRelativeTime returns "just now" for recent dates', () => {
    expect(getRelativeTime(new Date())).toBe('just now');
  });

  it('getRelativeTime returns minutes ago', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(getRelativeTime(fiveMinAgo)).toBe('5 minutes ago');
  });

  it('getCurrentSprint returns sprint info', () => {
    const sprint = getCurrentSprint(new Date('2025-01-15'));
    expect(sprint.number).toBeGreaterThanOrEqual(1);
    expect(sprint.start).toBeDefined();
    expect(sprint.end).toBeDefined();
  });

  it('getWeekNumber returns a number 1-53', () => {
    const week = getWeekNumber(new Date('2025-01-15'));
    expect(week).toBeGreaterThanOrEqual(1);
    expect(week).toBeLessThanOrEqual(53);
  });

  it('getQuarter returns Q1-Q4', () => {
    expect(getQuarter(new Date('2025-01-15'))).toBe('Q1');
    expect(getQuarter(new Date('2025-04-15'))).toBe('Q2');
    expect(getQuarter(new Date('2025-07-15'))).toBe('Q3');
    expect(getQuarter(new Date('2025-10-15'))).toBe('Q4');
  });

  it('daysAgo returns a date string', () => {
    const result = daysAgo(7);
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('isToday returns true for today', () => {
    expect(isToday(new Date().toISOString())).toBe(true);
  });
});

// ── Formatter Utils ─────────────────────────────────────────────────────────
import {
  heading,
  list,
  taskList,
  table,
  quote,
  codeBlock,
  inlineCode,
  link,
  badge,
  horizontalRule,
  bold,
  italic,
  details,
  joinSections,
  progressBar,
} from '../utils/formatter.js';

describe('utils/formatter', () => {
  it('heading creates correct markdown heading', () => {
    expect(heading('Hello', 1)).toBe('# Hello');
    expect(heading('Hello', 2)).toBe('## Hello');
    expect(heading('Hello', 3)).toBe('### Hello');
  });

  it('list creates unordered list', () => {
    const result = list(['A', 'B', 'C']);
    expect(result).toBe('- A\n- B\n- C');
  });

  it('taskList creates checkbox list', () => {
    const result = taskList([
      { text: 'Done', done: true },
      { text: 'Pending', done: false },
    ]);
    expect(result).toContain('[x] Done');
    expect(result).toContain('[ ] Pending');
  });

  it('table creates markdown table', () => {
    const result = table(['Name', 'Value'], [['A', '1'], ['B', '2']]);
    expect(result).toContain('| Name | Value |');
    expect(result).toContain('| A | 1 |');
  });

  it('quote creates blockquote', () => {
    expect(quote('Hello')).toBe('> Hello');
  });

  it('codeBlock creates fenced code block', () => {
    const result = codeBlock('const x = 1;', 'js');
    expect(result).toContain('```js');
    expect(result).toContain('const x = 1;');
  });

  it('bold wraps in **', () => {
    expect(bold('text')).toBe('**text**');
  });

  it('italic wraps in *', () => {
    expect(italic('text')).toBe('*text*');
  });

  it('link creates markdown link', () => {
    expect(link('Google', 'https://google.com')).toBe('[Google](https://google.com)');
  });

  it('horizontalRule returns ---', () => {
    expect(horizontalRule()).toBe('---');
  });

  it('progressBar renders correct percentage', () => {
    const bar = progressBar(50, 10);
    expect(bar).toContain('50%');
    expect(bar).toContain('█');
    expect(bar).toContain('░');
  });

  it('details creates collapsible section', () => {
    const result = details('Summary', 'Content');
    expect(result).toContain('<details>');
    expect(result).toContain('<summary>Summary</summary>');
    expect(result).toContain('Content');
  });

  it('joinSections joins with double newlines', () => {
    expect(joinSections('A', 'B', 'C')).toBe('A\n\nB\n\nC');
  });

  it('joinSections filters empty values', () => {
    expect(joinSections('A', '', null, 'B')).toBe('A\n\nB');
  });
});

// ── Helper Utils ────────────────────────────────────────────────────────────
import {
  deepMerge,
  slugify,
  truncate,
  capitalize,
  titleCase,
  pluralize,
  groupBy,
  unique,
  getNestedValue,
} from '../utils/helper.js';

describe('utils/helper', () => {
  it('deepMerge merges nested objects', () => {
    const result = deepMerge(
      { a: 1, b: { c: 2, d: 3 } },
      { b: { c: 4 }, e: 5 }
    );
    expect(result).toEqual({ a: 1, b: { c: 4, d: 3 }, e: 5 });
  });

  it('slugify creates URL-friendly slug', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Some (Test) String')).toBe('some-test-string');
  });

  it('truncate cuts long strings', () => {
    expect(truncate('Hello, World!', 10)).toBe('Hello, ...');
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('capitalize capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('')).toBe('');
  });

  it('titleCase capitalizes each word', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  it('pluralize handles singular and plural', () => {
    expect(pluralize(1, 'file')).toBe('1 file');
    expect(pluralize(5, 'file')).toBe('5 files');
    expect(pluralize(0, 'item')).toBe('0 items');
  });

  it('groupBy groups array by key', () => {
    const data = [
      { type: 'a', val: 1 },
      { type: 'b', val: 2 },
      { type: 'a', val: 3 },
    ];
    const result = groupBy(data, 'type');
    expect(result.a).toHaveLength(2);
    expect(result.b).toHaveLength(1);
  });

  it('unique removes duplicates', () => {
    expect(unique([1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
  });

  it('getNestedValue retrieves nested property', () => {
    const obj = { a: { b: { c: 42 } } };
    expect(getNestedValue(obj, 'a.b.c')).toBe(42);
    expect(getNestedValue(obj, 'a.x', 'default')).toBe('default');
  });
});

// ── Random Utils ────────────────────────────────────────────────────────────
import {
  pickRandom,
  pickMultiple,
  shuffleArray,
  generateId,
  randomInt,
  dailyRotationIndex,
} from '../utils/random.js';

describe('utils/random', () => {
  it('pickRandom returns an element from the array', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = pickRandom(arr);
    expect(arr).toContain(result);
  });

  it('pickRandom returns undefined for empty array', () => {
    expect(pickRandom([])).toBeUndefined();
  });

  it('pickMultiple returns N unique elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = pickMultiple(arr, 3);
    expect(result).toHaveLength(3);
    expect(new Set(result).size).toBe(3);
  });

  it('shuffleArray returns same length', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray([...arr]);
    expect(result).toHaveLength(arr.length);
    expect(result.sort()).toEqual(arr.sort());
  });

  it('generateId returns 8 hex characters', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-f0-9]{8}$/);
  });

  it('randomInt returns number in range', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInt(1, 10);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
    }
  });

  it('dailyRotationIndex is deterministic for same date', () => {
    const date = new Date('2025-07-04');
    const idx1 = dailyRotationIndex(6, date);
    const idx2 = dailyRotationIndex(6, date);
    expect(idx1).toBe(idx2);
    expect(idx1).toBeGreaterThanOrEqual(0);
    expect(idx1).toBeLessThan(6);
  });
});

// ── Validator Utils ─────────────────────────────────────────────────────────
import {
  isNonEmptyString,
  isPlainObject,
  isNonEmptyArray,
  isValidSemver,
  validateJSON,
} from '../utils/validator.js';

describe('utils/validator', () => {
  it('isNonEmptyString validates correctly', () => {
    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isNonEmptyString('   ')).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(42)).toBe(false);
  });

  it('isPlainObject validates correctly', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject('string')).toBe(false);
  });

  it('isNonEmptyArray validates correctly', () => {
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray([])).toBe(false);
    expect(isNonEmptyArray(null)).toBe(false);
  });

  it('isValidSemver validates version strings', () => {
    expect(isValidSemver('1.0.0')).toBe(true);
    expect(isValidSemver('0.1.0')).toBe(true);
    expect(isValidSemver('1.2.3-beta')).toBe(true);
    expect(isValidSemver('1.0')).toBe(false);
    expect(isValidSemver('abc')).toBe(false);
  });

  it('validateJSON checks required keys', () => {
    const data = { name: 'test', version: '1.0.0' };
    const result = validateJSON(data, ['name', 'version']);
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('validateJSON reports missing keys', () => {
    const data = { name: 'test' };
    const result = validateJSON(data, ['name', 'version', 'author']);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('version');
    expect(result.missing).toContain('author');
  });
});
