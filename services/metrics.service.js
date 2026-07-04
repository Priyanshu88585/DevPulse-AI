/**
 * @module services/metrics.service
 * @description Computes project statistics and metrics from data and filesystem.
 */

import { join } from 'path';
import { PATHS, DATA_FILES } from '../app/constants.js';
import { readJSON, listFiles, countFilesRecursive } from '../utils/file.js';
import { formatTimestamp } from '../utils/date.js';
import logger from '../utils/logger.js';

/**
 * Computes comprehensive project metrics.
 * @returns {object} Metrics object with various statistics.
 */
export function computeMetrics() {
  const done = logger.time('Metrics computation');

  const milestoneData = readJSON(join(PATHS.DATA, DATA_FILES.MILESTONES), { milestones: [] });
  const commitData = readJSON(join(PATHS.DATA, DATA_FILES.COMMITS), { history: [], totalCommits: 0 });
  const versionData = readJSON(join(PATHS.DATA, DATA_FILES.VERSIONS), { versions: [] });
  const progressData = readJSON(join(PATHS.DATA, DATA_FILES.PROGRESS), {});

  // Documentation pages count
  const outputFiles = listFiles(PATHS.OUTPUT, '.md');
  const docFiles = listFiles(PATHS.DOCS, '.md');
  const documentationPages = outputFiles.length + docFiles.length;

  // Milestone statistics
  const milestones = milestoneData.milestones || [];
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const inProgressMilestones = milestones.filter(m => m.status === 'in-progress').length;
  const plannedMilestones = milestones.filter(m => m.status === 'planned' || m.status === 'future').length;

  // Task statistics from milestones
  let totalTasks = 0;
  let completedTasks = 0;
  for (const milestone of milestones) {
    if (milestone.tasks) {
      totalTasks += milestone.tasks.length;
      completedTasks += milestone.tasks.filter(t => t.done).length;
    }
  }
  const pendingTasks = totalTasks - completedTasks;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Repository structure
  const totalProjectFiles = countFilesRecursive(PATHS.REPORTS) +
    countFilesRecursive(PATHS.OUTPUT) +
    countFilesRecursive(PATHS.DOCS) +
    countFilesRecursive(join(PATHS.REPORTS, '..', 'services')) +
    countFilesRecursive(join(PATHS.REPORTS, '..', 'generators')) +
    countFilesRecursive(join(PATHS.REPORTS, '..', 'utils'));

  const metrics = {
    documentationPages,
    lastUpdated: formatTimestamp(),
    totalMilestones: milestones.length,
    completedMilestones,
    inProgressMilestones,
    plannedMilestones,
    totalTasks,
    completedTasks,
    pendingTasks,
    taskCompletionRate,
    totalCommits: commitData.totalCommits || commitData.history?.length || 0,
    totalVersions: versionData.versions?.length || 0,
    currentVersion: versionData.versions?.[0]?.version || '0.0.0',
    recentCommits: (commitData.history || []).slice(0, 5),
    sprintItems: progressData.completed?.length || 0,
    blockers: progressData.blockers?.length || 0,
    totalProjectFiles,
  };

  done();
  return metrics;
}

/**
 * Returns a summary of metrics suitable for inline display (e.g., in README badges).
 * @returns {{ version: string, tasks: string, milestones: string, docs: string }}
 */
export function getMetricsSummary() {
  const m = computeMetrics();
  return {
    version: m.currentVersion,
    tasks: `${m.completedTasks}/${m.totalTasks}`,
    milestones: `${m.completedMilestones}/${m.totalMilestones}`,
    docs: `${m.documentationPages} pages`,
  };
}

/**
 * Formats metrics as a structured object for template rendering.
 * @returns {Record<string, string>}
 */
export function getMetricsForTemplate() {
  const m = computeMetrics();
  return {
    documentationPages: String(m.documentationPages),
    lastUpdated: m.lastUpdated,
    totalMilestones: String(m.totalMilestones),
    completedMilestones: String(m.completedMilestones),
    inProgressMilestones: String(m.inProgressMilestones),
    plannedMilestones: String(m.plannedMilestones),
    totalTasks: String(m.totalTasks),
    completedTasks: String(m.completedTasks),
    pendingTasks: String(m.pendingTasks),
    taskCompletionRate: String(m.taskCompletionRate),
    totalCommits: String(m.totalCommits),
    totalVersions: String(m.totalVersions),
    currentVersion: m.currentVersion,
    totalProjectFiles: String(m.totalProjectFiles),
  };
}
