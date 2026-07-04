/**
 * @module services/task.service
 * @description Manages TODO items and task tracking across priorities.
 */

import { join } from 'path';
import { PATHS, DATA_FILES, TASK_PRIORITIES } from '../app/constants.js';
import { readJSON } from '../utils/file.js';
import logger from '../utils/logger.js';

/**
 * @typedef {object} TaskItem
 * @property {string} id
 * @property {string} title
 * @property {string} priority - 'high' | 'medium' | 'low' | 'completed' | 'future'
 * @property {string} [category]
 * @property {string} [createdAt]
 * @property {string} [completedAt]
 */

/**
 * Default tasks representing realistic project work.
 */
const DEFAULT_TASKS = {
  high: [
    { id: 't-001', title: 'Complete unit test coverage for all services', category: 'Testing' },
    { id: 't-002', title: 'Finalize setup documentation with examples', category: 'Documentation' },
    { id: 't-003', title: 'Implement error recovery in scheduler', category: 'Core' },
  ],
  medium: [
    { id: 't-004', title: 'Add configuration validation on startup', category: 'Core' },
    { id: 't-005', title: 'Create API reference documentation', category: 'Documentation' },
    { id: 't-006', title: 'Implement daily report aggregation', category: 'Feature' },
    { id: 't-007', title: 'Add end-to-end test for full generation pipeline', category: 'Testing' },
    { id: 't-008', title: 'Optimize file I/O for large repositories', category: 'Performance' },
  ],
  low: [
    { id: 't-009', title: 'Add Mermaid architecture diagrams to docs', category: 'Documentation' },
    { id: 't-010', title: 'Create contributor statistics generator', category: 'Feature' },
    { id: 't-011', title: 'Implement Shields.io badge auto-update', category: 'Feature' },
    { id: 't-012', title: 'Add custom theme support for generated markdown', category: 'Enhancement' },
  ],
  completed: [
    { id: 't-013', title: 'Set up ES Module project structure', category: 'Core', completedAt: '2025-01-20' },
    { id: 't-014', title: 'Implement logger with file output and rotation', category: 'Core', completedAt: '2025-02-05' },
    { id: 't-015', title: 'Build all six documentation generators', category: 'Core', completedAt: '2025-03-10' },
    { id: 't-016', title: 'Create GitHub Actions scheduler workflow', category: 'CI/CD', completedAt: '2025-04-15' },
    { id: 't-017', title: 'Implement change detection with content hashing', category: 'Performance', completedAt: '2025-04-20' },
    { id: 't-018', title: 'Build template rendering engine', category: 'Core', completedAt: '2025-05-01' },
    { id: 't-019', title: 'Configure git commit automation', category: 'CI/CD', completedAt: '2025-05-10' },
    { id: 't-020', title: 'Implement metrics computation service', category: 'Feature', completedAt: '2025-06-01' },
  ],
  future: [
    { id: 't-021', title: 'AI-powered weekly development summaries', category: 'AI' },
    { id: 't-022', title: 'GitHub Issues synchronization', category: 'Integration' },
    { id: 't-023', title: 'Multi-repository support', category: 'Feature' },
    { id: 't-024', title: 'Plugin architecture for custom generators', category: 'Architecture' },
    { id: 't-025', title: 'Project health scoring system', category: 'Analytics' },
  ],
};

/**
 * Loads tasks from data or returns default tasks.
 * @returns {Record<string, TaskItem[]>}
 */
export function loadTasks() {
  const data = readJSON(join(PATHS.DATA, 'tasks.json'), null);
  if (data && data.tasks) {
    return data.tasks;
  }
  return DEFAULT_TASKS;
}

/**
 * Gets tasks organized by priority level.
 * @returns {Record<string, TaskItem[]>}
 */
export function getTasksByPriority() {
  return loadTasks();
}

/**
 * Gets task statistics.
 * @returns {{ total: number, high: number, medium: number, low: number, completed: number, future: number }}
 */
export function getTaskStats() {
  const tasks = loadTasks();
  return {
    total: Object.values(tasks).flat().length,
    high: tasks[TASK_PRIORITIES.HIGH]?.length || 0,
    medium: tasks[TASK_PRIORITIES.MEDIUM]?.length || 0,
    low: tasks[TASK_PRIORITIES.LOW]?.length || 0,
    completed: tasks[TASK_PRIORITIES.COMPLETED]?.length || 0,
    future: tasks[TASK_PRIORITIES.FUTURE]?.length || 0,
  };
}

/**
 * Gets all tasks as a flat list.
 * @returns {TaskItem[]}
 */
export function getAllTasks() {
  const tasks = loadTasks();
  return Object.entries(tasks).flatMap(([priority, items]) =>
    items.map(item => ({ ...item, priority }))
  );
}
