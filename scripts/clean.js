#!/usr/bin/env node

/**
 * @script scripts/clean.js
 * @description Resets output/ and logs/ directories.
 *
 * Usage:
 *   npm run clean
 */

import { rmSync, existsSync } from 'fs';
import { PATHS } from '../app/constants.js';
import { ensureDir } from '../utils/file.js';

const CLEAN_TARGETS = [
  { path: PATHS.OUTPUT, label: 'output/' },
  { path: PATHS.LOGS, label: 'logs/' },
];

console.log('🧹 Cleaning project directories...\n');

for (const target of CLEAN_TARGETS) {
  if (existsSync(target.path)) {
    rmSync(target.path, { recursive: true, force: true });
    console.log(`   ✓ Removed ${target.label}`);
  } else {
    console.log(`   ⏭ ${target.label} (already clean)`);
  }
  ensureDir(target.path);
}

console.log('\n✅ Clean complete. Directories have been reset.');
