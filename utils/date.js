/**
 * @module utils/date
 * @description Date/time formatting and calculation utilities.
 */

/**
 * Formats a Date object as "YYYY-MM-DD".
 * @param {Date} [date]
 * @returns {string}
 */
export function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Formats a Date object as a full ISO-8601 timestamp.
 * @param {Date} [date]
 * @returns {string}
 */
export function formatTimestamp(date = new Date()) {
  return date.toISOString();
}

/**
 * Returns a human-readable date string like "July 4, 2025".
 * @param {Date} [date]
 * @returns {string}
 */
export function formatReadable(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns a human-readable relative time string (e.g., "2 hours ago", "just now").
 * @param {Date|string} date
 * @returns {string}
 */
export function getRelativeTime(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  const years = Math.floor(diffDays / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/**
 * Calculates the current two-week sprint number and boundaries.
 * Sprint 1 starts on Jan 1 of the current year.
 * @param {Date} [date]
 * @returns {{ number: number, start: string, end: string }}
 */
export function getCurrentSprint(date = new Date()) {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - yearStart) / (1000 * 60 * 60 * 24));
  const sprintNumber = Math.floor(dayOfYear / 14) + 1;

  const sprintStartDay = (sprintNumber - 1) * 14;
  const sprintStart = new Date(date.getFullYear(), 0, 1 + sprintStartDay);
  const sprintEnd = new Date(sprintStart.getTime() + 13 * 24 * 60 * 60 * 1000);

  return {
    number: sprintNumber,
    start: formatDate(sprintStart),
    end: formatDate(sprintEnd),
  };
}

/**
 * Returns the ISO week number for a date.
 * @param {Date} [date]
 * @returns {number}
 */
export function getWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/**
 * Returns the quarter (Q1–Q4) for a date.
 * @param {Date} [date]
 * @returns {string}
 */
export function getQuarter(date = new Date()) {
  return `Q${Math.floor(date.getMonth() / 3) + 1}`;
}

/**
 * Returns a date string for N days ago.
 * @param {number} days
 * @returns {string}
 */
export function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDate(d);
}

/**
 * Checks if a date string represents today.
 * @param {string} dateStr - ISO date string
 * @returns {boolean}
 */
export function isToday(dateStr) {
  return formatDate() === formatDate(new Date(dateStr));
}
