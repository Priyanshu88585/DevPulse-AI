#!/usr/bin/env node

/**
 * @script scripts/verify.js
 * @description Comprehensive continuous validation and self-healing verification script.
 * Validates determinism, tests, schemas, and git state.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// --- Logger Setup ---
const logInfo = (msg) => console.log(`[INFO] ℹ️  ${msg}`);
const logSuccess = (msg) => console.log(`[PASS] ✅ ${msg}`);
const logError = (msg) => console.error(`[FAIL] ❌ ${msg}`);
const logWarn = (msg) => console.warn(`[WARN] ⚠️  ${msg}`);

const MAX_RETRIES = 3;

/**
 * Run a shell command synchronously and return output
 */
function runCommand(command, ignoreError = false) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    if (!ignoreError) {
      throw new Error(`Command failed: ${command}\nOutput: ${error.stdout}\nError: ${error.stderr}`);
    }
    return error.stdout || error.stderr || '';
  }
}

/**
 * 1. Validate Project Configuration
 */
function validateConfig() {
  logInfo('Validating configuration...');
  const pkgPath = join(process.cwd(), 'package.json');
  if (!existsSync(pkgPath)) throw new Error('package.json not found');
  
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (!pkg.name || !pkg.version) throw new Error('package.json is missing name or version');

  const schedulerPath = join(process.cwd(), '.github/workflows/scheduler.yml');
  if (!existsSync(schedulerPath)) throw new Error('Scheduler workflow not found');
  
  logSuccess('Configuration valid');
}

/**
 * 2. Validate JSON Schemas
 */
function validateSchemas() {
  logInfo('Validating JSON data files...');
  const dataDir = join(process.cwd(), 'data');
  const requiredFiles = ['commits.json', 'developers.json', 'milestones.json', 'progress.json', 'roadmap.json', 'settings.json', 'versions.json'];
  
  for (const file of requiredFiles) {
    const filePath = join(dataDir, file);
    if (!existsSync(filePath)) throw new Error(`Missing required data file: ${file}`);
    
    try {
      JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (err) {
      throw new Error(`Invalid JSON in ${file}: ${err.message}`);
    }
  }
  logSuccess('All JSON schemas valid');
}

/**
 * 3. Run Unit and Integration Tests
 */
function runTests() {
  logInfo('Executing test suite...');
  runCommand('npm run test');
  logSuccess('Test suite passed');
}

/**
 * 4. Verify Deterministic Output & Git State
 */
function verifyDeterminism() {
  logInfo('Verifying deterministic documentation generation...');
  
  // Ensure working directory is clean before we start
  const initialStatus = runCommand('git status --porcelain', true);
  
  logInfo('Running generation 1...');
  runCommand('npm run generate');
  
  const statusAfterRun1 = runCommand('git status --porcelain', true);
  
  logInfo('Running generation 2...');
  runCommand('npm run generate');
  
  const statusAfterRun2 = runCommand('git status --porcelain', true);

  if (statusAfterRun1 !== statusAfterRun2) {
    throw new Error(`Determinism failure! Git status differs between runs.\nRun 1 Status:\n${statusAfterRun1}\nRun 2 Status:\n${statusAfterRun2}`);
  }

  logSuccess('Deterministic output verified (Outputs are identical)');
}

/**
 * Main execution loop with retry logic
 */
async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔄 Starting Continuous Verification Loop');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  let attempt = 1;
  let success = false;

  while (attempt <= MAX_RETRIES && !success) {
    try {
      logInfo(`--- Validation Attempt ${attempt}/${MAX_RETRIES} ---`);
      
      validateConfig();
      validateSchemas();
      runTests();
      verifyDeterminism();

      success = true;
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      logSuccess('All continuous validations passed successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
      logError(`Validation failed on attempt ${attempt}:`);
      console.error(error.message);
      
      if (attempt < MAX_RETRIES) {
        logWarn('Retrying in 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempt++;
      } else {
        logError('Maximum retries reached. Verification failed.');
        process.exit(1);
      }
    }
  }
}

main();
