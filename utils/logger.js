/**
 * @module utils/logger
 * @description Timestamped logging to console and file with level filtering.
 */

import { appendFileSync, mkdirSync, existsSync, statSync, renameSync } from 'fs';
import { join } from 'path';
import { PATHS, LOG_FILES, LOG_LEVELS } from '../app/constants.js';

// ── Ensure logs directory ───────────────────────────────────────────────────
if (!existsSync(PATHS.LOGS)) {
  mkdirSync(PATHS.LOGS, { recursive: true });
}

// ── Level hierarchy ─────────────────────────────────────────────────────────
const LEVEL_PRIORITY = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

/**
 * Determines the minimum log level from environment or defaults to INFO.
 */
function getMinLevel() {
  const envLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
  return LEVEL_PRIORITY[envLevel] !== undefined ? envLevel : 'INFO';
}

/**
 * Formats a log entry with ISO timestamp, level, and message.
 * @param {string} level
 * @param {string} message
 * @param {object} [meta]
 * @returns {string}
 */
function formatEntry(level, message, meta) {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

/**
 * Writes a log entry to the specified file, with optional size-based rotation.
 * @param {string} filename
 * @param {string} entry
 */
function writeToFile(filename, entry) {
  try {
    const filepath = join(PATHS.LOGS, filename);
    const MAX_SIZE = 1024 * 1024; // 1 MB

    if (existsSync(filepath)) {
      const stats = statSync(filepath);
      if (stats.size > MAX_SIZE) {
        const rotated = filepath.replace('.log', `.${Date.now()}.log`);
        renameSync(filepath, rotated);
      }
    }

    appendFileSync(filepath, entry + '\n', 'utf-8');
  } catch (err) {
    // Fallback: if file logging fails, print to stderr
    process.stderr.write(`[LOGGER] Failed to write log file: ${err.message}\n`);
  }
}

/**
 * Core log function.
 * @param {string} level - One of DEBUG, INFO, WARN, ERROR
 * @param {string} message
 * @param {object} [meta] - Optional structured metadata
 */
function log(level, message, meta) {
  const minLevel = getMinLevel();
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[minLevel]) return;

  const entry = formatEntry(level, message, meta);

  // Console output
  const logToConsole = process.env.LOG_CONSOLE !== 'false';
  if (logToConsole) {
    const colorMap = {
      DEBUG: '\x1b[90m',   // gray
      INFO:  '\x1b[36m',   // cyan
      WARN:  '\x1b[33m',   // yellow
      ERROR: '\x1b[31m',   // red
    };
    const reset = '\x1b[0m';
    const color = colorMap[level] || '';
    console.log(`${color}${entry}${reset}`);
  }

  // File output
  const logToFile = process.env.LOG_FILE !== 'false';
  if (logToFile) {
    writeToFile(LOG_FILES.ACTIVITY, entry);
    if (level === LOG_LEVELS.ERROR) {
      writeToFile(LOG_FILES.ERRORS, entry);
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────────────
const logger = {
  debug: (msg, meta) => log(LOG_LEVELS.DEBUG, msg, meta),
  info:  (msg, meta) => log(LOG_LEVELS.INFO, msg, meta),
  warn:  (msg, meta) => log(LOG_LEVELS.WARN, msg, meta),
  error: (msg, meta) => log(LOG_LEVELS.ERROR, msg, meta),

  /**
   * Log to a specific named file (e.g., scheduler.log, commits.log).
   * @param {string} filename
   * @param {string} message
   */
  logTo(filename, message) {
    const entry = formatEntry(LOG_LEVELS.INFO, message);
    writeToFile(filename, entry);
  },

  /**
   * Log the start of a named operation for timing purposes.
   * @param {string} operationName
   * @returns {Function} Call the returned function to log completion with elapsed time.
   */
  time(operationName) {
    const start = performance.now();
    log(LOG_LEVELS.INFO, `⏱  Starting: ${operationName}`);
    return () => {
      const elapsed = (performance.now() - start).toFixed(1);
      log(LOG_LEVELS.INFO, `✓  Completed: ${operationName} (${elapsed}ms)`);
    };
  },
};

export default logger;
