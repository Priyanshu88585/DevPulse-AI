#!/usr/bin/env node

/**
 * @script scripts/update.js
 * @description Force-update all generators (bypasses schedule check).
 *
 * Usage:
 *   npm run update
 */

import { main } from '../app/main.js';

console.log('🔄 Force-updating all documentation...\n');

main({ force: true, dryRun: false }).then(result => {
  console.log(`\n📄 Files updated: ${result.changedFiles.length}`);
  if (result.changedFiles.length > 0) {
    result.changedFiles.forEach(f => console.log(`   ✏️  ${f}`));
  }
  process.exit(result.success ? 0 : 1);
});
