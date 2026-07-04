#!/usr/bin/env node

/**
 * @script scripts/generate.js
 * @description Generate documentation without committing (dry-run mode).
 *
 * Usage:
 *   npm run generate
 *   npm run generate -- --only progress,metrics
 */

import { main } from '../app/main.js';

const args = process.argv.slice(2);

const options = {
  force: true,   // Always force when explicitly generating
  dryRun: true,  // Never commit in generate mode
  only: (() => {
    const idx = args.indexOf('--only');
    if (idx === -1) return undefined;
    return args[idx + 1]?.split(',').map(s => s.trim());
  })(),
};

console.log('📝 Generating documentation (dry-run mode)...\n');

main(options).then(result => {
  console.log(`\n📄 Files generated: ${result.changedFiles.length}`);
  if (result.changedFiles.length > 0) {
    result.changedFiles.forEach(f => console.log(`   ✏️  ${f}`));
  }
  process.exit(result.success ? 0 : 1);
});
