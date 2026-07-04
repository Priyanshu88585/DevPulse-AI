/**
 * @module services/timeline.service
 * @description Sprint and milestone timeline calculations.
 */

import { join } from 'path';
import { PATHS, DATA_FILES, MILESTONE_STATUS } from '../app/constants.js';
import { readJSON } from '../utils/file.js';
import { getCurrentSprint, formatDate, formatReadable, getRelativeTime } from '../utils/date.js';
import logger from '../utils/logger.js';

/**
 * Loads roadmap milestones from data.
 * @returns {object[]}
 */
export function loadMilestones() {
  const data = readJSON(join(PATHS.DATA, DATA_FILES.ROADMAP), { milestones: [] });
  return data.milestones || [];
}

/**
 * Gets the current sprint information.
 * @returns {{ number: number, start: string, end: string, daysRemaining: number }}
 */
export function getSprintInfo() {
  const sprint = getCurrentSprint();
  const endDate = new Date(sprint.end);
  const now = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));

  return {
    ...sprint,
    daysRemaining,
  };
}

/**
 * Gets milestones grouped by status.
 * @returns {{ completed: object[], inProgress: object[], planned: object[], future: object[] }}
 */
export function getMilestonesByStatus() {
  const milestones = loadMilestones();

  return {
    completed: milestones.filter(m => m.status === MILESTONE_STATUS.COMPLETED),
    inProgress: milestones.filter(m => m.status === MILESTONE_STATUS.IN_PROGRESS),
    planned: milestones.filter(m => m.status === MILESTONE_STATUS.PLANNED),
    future: milestones.filter(m => m.status === MILESTONE_STATUS.FUTURE),
  };
}

/**
 * Gets the currently active milestone (in-progress).
 * @returns {object|null}
 */
export function getCurrentMilestone() {
  const milestones = loadMilestones();
  return milestones.find(m => m.status === MILESTONE_STATUS.IN_PROGRESS) || null;
}

/**
 * Gets the next upcoming milestone.
 * @returns {object|null}
 */
export function getNextMilestone() {
  const milestones = loadMilestones();
  return milestones.find(m => m.status === MILESTONE_STATUS.PLANNED) || null;
}

/**
 * Calculates overall project completion percentage based on milestone statuses.
 * @returns {number} Percentage (0-100)
 */
export function getOverallProgress() {
  const milestones = loadMilestones();
  if (milestones.length === 0) return 0;

  const weights = {
    [MILESTONE_STATUS.COMPLETED]: 1.0,
    [MILESTONE_STATUS.IN_PROGRESS]: 0.5,
    [MILESTONE_STATUS.PLANNED]: 0.1,
    [MILESTONE_STATUS.FUTURE]: 0.0,
  };

  const totalWeight = milestones.reduce((sum, m) => sum + (weights[m.status] || 0), 0);
  return Math.round((totalWeight / milestones.length) * 100);
}

/**
 * Gets a timeline summary suitable for documentation.
 * @returns {object}
 */
export function getTimelineSummary() {
  const milestones = loadMilestones();
  const current = getCurrentMilestone();
  const next = getNextMilestone();

  return {
    totalMilestones: milestones.length,
    overallProgress: getOverallProgress(),
    currentMilestone: current ? {
      title: current.title,
      targetDate: current.targetDate,
      timeRemaining: getRelativeTime(new Date(Date.now() - (new Date(current.targetDate) - Date.now()))),
    } : null,
    nextMilestone: next ? {
      title: next.title,
      targetDate: next.targetDate,
    } : null,
    lastCompletedMilestone: milestones
      .filter(m => m.status === MILESTONE_STATUS.COMPLETED)
      .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))[0] || null,
  };
}
