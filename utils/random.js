/**
 * @module utils/random
 * @description Controlled randomization utilities for variety in generated docs.
 * Uses curated pools — never generates gibberish.
 */

import { randomBytes } from 'crypto';

/**
 * Picks a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function pickRandom(arr) {
  if (!arr || arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Picks N unique random elements from an array.
 * @template T
 * @param {T[]} arr
 * @param {number} n
 * @returns {T[]}
 */
export function pickMultiple(arr, n) {
  const shuffled = shuffleArray([...arr]);
  return shuffled.slice(0, Math.min(n, arr.length));
}

/**
 * Shuffles an array in-place using Fisher-Yates algorithm.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a short unique ID (8 hex characters).
 * @returns {string}
 */
export function generateId() {
  return randomBytes(4).toString('hex');
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a weighted random selection.
 * @param {{ value: *, weight: number }[]} options
 * @returns {*}
 */
export function weightedRandom(options) {
  const totalWeight = options.reduce((sum, opt) => sum + opt.weight, 0);
  let random = Math.random() * totalWeight;

  for (const option of options) {
    random -= option.weight;
    if (random <= 0) return option.value;
  }

  return options[options.length - 1].value;
}

/**
 * Returns a deterministic "random" index based on the current date,
 * useful for rotating generators day by day without actual randomness.
 * @param {number} arrayLength
 * @param {Date} [date]
 * @returns {number}
 */
export function dailyRotationIndex(arrayLength, date = new Date()) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return dayOfYear % arrayLength;
}
