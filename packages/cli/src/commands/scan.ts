import * as p from '@clack/prompts';
import type { CliOptions } from '../types/skill.js';
import { scanForSkills } from '../core/scanner.js';
import { copySkills } from '../core/copier.js';
import { promptSkillSelection, promptConfirmation, displayResults, createSpinner } from '../ui/prompts.js';

/**
 * Main scan command - orchestrates the scan and add workflow
 * @param options - CLI options from commander
 */
export async function scanCommand(options: CliOptions): Promise<void> {
  // Get paths from options or environment
  const scanPath = options.path || process.cwd();
  const targetPath =
    options.target || (process.env._4NDH4K_SKILLS_PATH as string | undefined);

  // Validate target path
  if (!targetPath) {
    console.error(
      'Target path not set. Set _4NDH4K_SKILLS_PATH environment variable or use --target option.'
    );
    process.exit(1);
  }

  // Scan for skills
  const spinner = createSpinner();
  spinner.start('Scanning for skills...');

  let skills: Awaited<ReturnType<typeof scanForSkills>>;
  try {
    skills = await scanForSkills({ path: scanPath, targetPath });
  } catch (error) {
    spinner.stop(String(error));
    process.exit(1);
  }

  spinner.stop(`Found ${skills.length} skill${skills.length !== 1 ? 's' : ''}`);

  // Prompt user to select skills
  const selected = await promptSkillSelection(skills);

  if (selected.length === 0) {
    p.cancel('No skills selected');
    return;
  }

  // Confirm before copying
  const confirmed = await promptConfirmation(selected, targetPath, options.dryRun);
  if (!confirmed) {
    p.cancel('Aborted');
    return;
  }

  // Filter and copy selected skills
  const skillsToCopy = skills.filter((s) => selected.includes(s.name));

  spinner.start('Copying skills...');
  const results = await copySkills(skillsToCopy, {
    targetPath,
    dryRun: options.dryRun,
    overwrite: false
  });
  spinner.stop('Done');

  // Display results
  displayResults(results, options.dryRun);
}
