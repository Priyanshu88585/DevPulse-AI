#!/usr/bin/env node

/**
 * @script scripts/release.js
 * @description Bump version and generate release documentation.
 *
 * Usage:
 *   npm run release
 *   npm run release -- patch
 *   npm run release -- minor
 *   npm run release -- major
 */

import { readJSON, writeJSON } from '../utils/file.js';
import { join } from 'path';
import { PATHS, DATA_FILES } from '../app/constants.js';
import { main } from '../app/main.js';
import { formatDate } from '../utils/date.js';
import logger from '../utils/logger.js';

const BUMP_TYPE = process.argv[2] || 'patch';

function bumpVersion(version, type) {
  const parts = version.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${parts[0] + 1}.0.0`;
    case 'minor':
      return `${parts[0]}.${parts[1] + 1}.0`;
    case 'patch':
    default:
      return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
}

async function release() {
  console.log(`🚀 Preparing ${BUMP_TYPE} release...\n`);

  // Read current versions
  const versionsPath = join(PATHS.DATA, DATA_FILES.VERSIONS);
  const versionsData = readJSON(versionsPath, { versions: [] });

  const currentVersion = versionsData.versions[0]?.version || '1.0.0';
  const newVersion = bumpVersion(currentVersion, BUMP_TYPE);

  console.log(`   Version: ${currentVersion} → ${newVersion}`);

  // Add new version entry
  const newEntry = {
    version: newVersion,
    date: formatDate(),
    title: `Release v${newVersion}`,
    changes: {
      Added: [],
      Changed: [],
      Fixed: [],
      Improved: ['Documentation auto-generation improvements'],
      Documentation: ['Updated project documentation'],
    },
  };

  versionsData.versions.unshift(newEntry);
  writeJSON(versionsPath, versionsData);

  // Update settings
  const settingsPath = join(PATHS.DATA, DATA_FILES.SETTINGS);
  const settings = readJSON(settingsPath, {});
  settings.version = newVersion;
  writeJSON(settingsPath, settings);

  // Update package.json
  const pkgPath = join(PATHS.REPORTS, '..', 'package.json');
  const pkg = readJSON(pkgPath, {});
  if (pkg.version) {
    pkg.version = newVersion;
    writeJSON(pkgPath, pkg);
  }

  console.log(`\n📦 Version bumped to ${newVersion}`);
  console.log('📝 Generating release documentation...\n');

  // Run generators
  const result = await main({
    force: true,
    dryRun: false,
    only: ['changelog', 'release', 'metrics'],
  });

  console.log(`\n✅ Release v${newVersion} prepared successfully.`);
  process.exit(result.success ? 0 : 1);
}

release().catch(err => {
  logger.error('Release failed', { error: err.message });
  process.exit(1);
});
