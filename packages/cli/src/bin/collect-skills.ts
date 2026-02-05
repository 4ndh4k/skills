#!/usr/bin/env node

import { Command } from 'commander';
import { scanCommand } from '../commands/scan.js';

const program = new Command();

program
  .name('collect-skills')
  .description('CLI tool for scanning and adding skills to the 4ndh4k-skills repository')
  .version('1.0.0');

program
  .command('scan')
  .description('Scan for skills and add them to the repository')
  .option('-p, --path <directory>', 'Path to scan for skills', process.cwd())
  .option('-t, --target <directory>', 'Target repository path')
  .option('-r, --recursive', 'Scan recursively (not yet implemented)', false)
  .option('--dry-run', 'Preview changes without copying', false)
  .action(scanCommand);

program.parse();
