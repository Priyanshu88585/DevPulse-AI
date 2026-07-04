/**
 * @module utils/file
 * @description File system utilities for reading/writing JSON and Markdown files.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { dirname, join, extname } from 'path';
import { createHash } from 'crypto';
import logger from './logger.js';

/**
 * Ensures a directory exists, creating it recursively if necessary.
 * @param {string} dirPath
 */
export function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
    logger.debug(`Created directory: ${dirPath}`);
  }
}

/**
 * Checks if a file exists.
 * @param {string} filePath
 * @returns {boolean}
 */
export function fileExists(filePath) {
  return existsSync(filePath);
}

/**
 * Reads and parses a JSON file.
 * @param {string} filePath
 * @param {*} [fallback=null] - Value to return if the file is missing or invalid.
 * @returns {*}
 */
export function readJSON(filePath, fallback = null) {
  try {
    if (!existsSync(filePath)) {
      logger.debug(`JSON file not found, using fallback: ${filePath}`);
      return fallback;
    }
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    logger.error(`Failed to read JSON: ${filePath}`, { error: err.message });
    return fallback;
  }
}

/**
 * Writes an object as formatted JSON.
 * @param {string} filePath
 * @param {*} data
 */
export function writeJSON(filePath, data) {
  try {
    ensureDir(dirname(filePath));
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    logger.debug(`Wrote JSON: ${filePath}`);
  } catch (err) {
    logger.error(`Failed to write JSON: ${filePath}`, { error: err.message });
    throw err;
  }
}

/**
 * Reads a markdown (or any text) file.
 * @param {string} filePath
 * @param {string} [fallback=''] - Value to return if file is missing.
 * @returns {string}
 */
export function readMarkdown(filePath, fallback = '') {
  try {
    if (!existsSync(filePath)) {
      return fallback;
    }
    return readFileSync(filePath, 'utf-8');
  } catch (err) {
    logger.error(`Failed to read file: ${filePath}`, { error: err.message });
    return fallback;
  }
}

/**
 * Writes markdown content to a file, only if the content has actually changed.
 * @param {string} filePath
 * @param {string} content
 * @returns {boolean} True if the file was written (content changed), false otherwise.
 */
export function writeMarkdown(filePath, content) {
  try {
    ensureDir(dirname(filePath));

    // Change detection via content hash
    if (existsSync(filePath)) {
      const existing = readFileSync(filePath, 'utf-8');
      if (hashContent(existing) === hashContent(content)) {
        logger.debug(`No changes detected, skipping write: ${filePath}`);
        return false;
      }
    }

    writeFileSync(filePath, content, 'utf-8');
    logger.debug(`Wrote markdown: ${filePath}`);
    return true;
  } catch (err) {
    logger.error(`Failed to write markdown: ${filePath}`, { error: err.message });
    throw err;
  }
}

/**
 * Computes a SHA-256 hash of the given content string.
 * @param {string} content
 * @returns {string}
 */
export function hashContent(content) {
  return createHash('sha256').update(content, 'utf-8').digest('hex');
}

/**
 * Lists all files in a directory (non-recursive) matching an optional extension filter.
 * @param {string} dirPath
 * @param {string} [ext] - e.g. '.md', '.json'
 * @returns {string[]} Array of absolute file paths.
 */
export function listFiles(dirPath, ext) {
  try {
    if (!existsSync(dirPath)) return [];
    return readdirSync(dirPath)
      .filter(f => {
        const full = join(dirPath, f);
        return statSync(full).isFile() && (!ext || extname(f) === ext);
      })
      .map(f => join(dirPath, f));
  } catch (err) {
    logger.error(`Failed to list files: ${dirPath}`, { error: err.message });
    return [];
  }
}

/**
 * Counts all files recursively within a directory.
 * @param {string} dirPath
 * @returns {number}
 */
export function countFilesRecursive(dirPath) {
  let count = 0;
  try {
    if (!existsSync(dirPath)) return 0;
    const entries = readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(dirPath, entry.name);
      if (entry.isFile()) {
        count++;
      } else if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
        count += countFilesRecursive(full);
      }
    }
  } catch {
    // silently ignore permission errors in recursive scan
  }
  return count;
}
