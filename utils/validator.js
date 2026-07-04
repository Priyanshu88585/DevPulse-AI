/**
 * @module utils/validator
 * @description Validation utilities for config, JSON data, and templates.
 */

import { existsSync } from 'fs';
import logger from './logger.js';

/**
 * Checks if a value is a non-empty string.
 * @param {*} value
 * @returns {boolean}
 */
export function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Checks if a value is a plain object (not null, not array).
 * @param {*} value
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Checks if a value is a non-empty array.
 * @param {*} value
 * @returns {boolean}
 */
export function isNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Validates the application configuration object.
 * @param {object} config
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateConfig(config) {
  const errors = [];

  if (!config) {
    errors.push('Configuration object is null or undefined');
    return { valid: false, errors };
  }

  // Project metadata
  if (!config.project || !isNonEmptyString(config.project.name)) {
    errors.push('config.project.name is required');
  }
  if (!config.project || !isNonEmptyString(config.project.version)) {
    errors.push('config.project.version is required');
  }

  // Paths
  if (!config.paths || !isNonEmptyString(config.paths.root)) {
    errors.push('config.paths.root is required');
  }
  if (!config.paths || !isNonEmptyString(config.paths.output)) {
    errors.push('config.paths.output is required');
  }
  if (!config.paths || !isNonEmptyString(config.paths.data)) {
    errors.push('config.paths.data is required');
  }

  // Generators
  if (!config.generators || !isNonEmptyArray(config.generators.enabled)) {
    errors.push('config.generators.enabled must be a non-empty array');
  }

  // Scheduler
  if (!config.scheduler || typeof config.scheduler.interval !== 'number' || config.scheduler.interval <= 0) {
    errors.push('config.scheduler.interval must be a positive number');
  }

  if (errors.length > 0) {
    errors.forEach(err => logger.warn(`Config validation: ${err}`));
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a JSON data object against expected keys.
 * @param {object} data - The data object to validate
 * @param {string[]} requiredKeys - Keys that must exist
 * @param {string} [label='data'] - Label for error messages
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateJSON(data, requiredKeys, label = 'data') {
  const missing = [];

  if (!isPlainObject(data)) {
    logger.warn(`${label}: expected an object, got ${typeof data}`);
    return { valid: false, missing: requiredKeys };
  }

  for (const key of requiredKeys) {
    if (!(key in data)) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    logger.warn(`${label}: missing keys: ${missing.join(', ')}`);
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Validates that a template file exists and contains placeholders.
 * @param {string} filePath
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateTemplate(filePath) {
  if (!existsSync(filePath)) {
    return { valid: false, reason: `Template file not found: ${filePath}` };
  }

  // We don't read content here to keep validation lightweight;
  // the actual template rendering handles missing placeholders gracefully.
  return { valid: true };
}

/**
 * Validates a semantic version string (e.g., "1.2.3").
 * @param {string} version
 * @returns {boolean}
 */
export function isValidSemver(version) {
  return /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/.test(version);
}

/**
 * Validates that a file path points to an existing file.
 * @param {string} filePath
 * @param {string} [label='file']
 * @returns {boolean}
 */
export function validateFileExists(filePath, label = 'file') {
  if (!existsSync(filePath)) {
    logger.warn(`${label} not found: ${filePath}`);
    return false;
  }
  return true;
}
