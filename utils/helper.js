/**
 * @module utils/helper
 * @description General-purpose helper functions.
 */

/**
 * Deep merges two objects. Source values override target values.
 * Arrays are replaced, not concatenated.
 * @param {object} target
 * @param {object} source
 * @returns {object}
 */
export function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Converts a string to a URL-friendly slug.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates a string to a maximum length, adding ellipsis if needed.
 * @param {string} text
 * @param {number} [maxLength=100]
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} text
 * @returns {string}
 */
export function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalizes each word in a string.
 * @param {string} text
 * @returns {string}
 */
export function titleCase(text) {
  if (!text) return '';
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Pluralizes a word based on count.
 * @param {number} count
 * @param {string} singular
 * @param {string} [plural] - defaults to singular + 's'
 * @returns {string}
 */
export function pluralize(count, singular, plural) {
  const p = plural || `${singular}s`;
  return `${count} ${count === 1 ? singular : p}`;
}

/**
 * Groups an array of objects by a key.
 * @template T
 * @param {T[]} arr
 * @param {string|((item: T) => string)} key
 * @returns {Record<string, T[]>}
 */
export function groupBy(arr, key) {
  const getKey = typeof key === 'function' ? key : (item) => item[key];
  return arr.reduce((groups, item) => {
    const group = getKey(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}

/**
 * Removes duplicate values from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T[]}
 */
export function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Safely gets a nested property value using a dot-separated path.
 * @param {object} obj
 * @param {string} path - e.g., "project.metadata.name"
 * @param {*} [fallback]
 * @returns {*}
 */
export function getNestedValue(obj, path, fallback) {
  return path.split('.').reduce((current, key) => {
    return current !== null && current !== undefined ? current[key] : fallback;
  }, obj) ?? fallback;
}

/**
 * Delays execution for the specified milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retries an async function up to maxRetries times with delay between attempts.
 * @param {Function} fn - Async function to retry
 * @param {number} [maxRetries=3]
 * @param {number} [delay=1000] - Delay between retries in ms
 * @returns {Promise<*>}
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(delay * attempt);
    }
  }
}
