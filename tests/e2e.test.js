import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

const PROJECT_ROOT = join(__dirname, '..');

describe('End-to-End Execution', () => {
  it('npm run generate should execute successfully without committing', () => {
    // Run the generate script (which is intrinsically dry-run)
    const output = execSync('npm run generate', { cwd: PROJECT_ROOT, encoding: 'utf8' });
    
    // Check stdout for success markers
    expect(output).toContain('Execution Summary');
    expect(output).toContain('Files changed:  0');
    expect(output).toContain('Dry run mode — skipping commit');
  });

  it('All documentation files should exist after generation', () => {
    const outputDir = join(PROJECT_ROOT, 'output');
    
    const requiredDocs = [
      'CHANGELOG.md',
      'METRICS.md',
      'PROGRESS.md',
      'RELEASES.md',
      'ROADMAP.md',
      'TODO.md'
    ];
    
    for (const doc of requiredDocs) {
      expect(existsSync(join(outputDir, doc))).toBe(true);
    }
  });

  it('Generated docs should not contain dynamic dates like lastUpdated', () => {
    const progressDoc = readFileSync(join(PROJECT_ROOT, 'output', 'PROGRESS.md'), 'utf8');
    
    // Determinism check: we removed lastUpdated previously
    expect(progressDoc).not.toContain('Last Updated:');
  });
});
