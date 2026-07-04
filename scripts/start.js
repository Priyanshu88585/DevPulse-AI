#!/usr/bin/env node

/**
 * @script scripts/start.js
 * @description Main entry script — runs the full documentation generation pipeline.
 *
 * Usage:
 *   npm start
 *   npm start -- --force
 *   npm start -- --dry-run
 *   npm start -- --only progress,metrics
 */

import { main } from '../app/main.js';

const args = process.argv.slice(2);

const options = {
  force: args.includes('--force') || args.includes('-f'),
  dryRun: args.includes('--dry-run') || args.includes('-d'),
  only: (() => {
    const idx = args.indexOf('--only');
    if (idx === -1) return undefined;
    return args[idx + 1]?.split(',').map(s => s.trim());
  })(),
};

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
DevPulse AI — Intelligent Project Documentation & Progress Automation Engine

Usage:
  npm start                      Run with schedule check
  npm start -- --force           Force run (skip schedule check)
  npm start -- --dry-run         Generate without committing
  npm start -- --only a,b        Run specific generators only

Options:
  --force, -f       Skip schedule check and force generation
  --dry-run, -d     Generate docs but don't commit changes
  --only <names>    Comma-separated list of generators to run
  --help, -h        Show this help message

Generators:
  progress, roadmap, changelog, metrics, todo, release
`);
  process.exit(0);
}

main(options).then(result => {
  if (!result.success) {
    console.error('\n❌ Execution completed with errors.');
    process.exit(1);
  }
  console.log('\n✅ Execution completed successfully.');
  process.exit(0);
});
