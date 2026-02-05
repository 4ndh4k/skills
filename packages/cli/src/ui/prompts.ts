import * as p from '@clack/prompts';
import type { DiscoveredSkill, CopyResult } from '../types/skill.js';

/**
 * Prompt user to select skills from discovered list
 * @param skills - Array of discovered skills
 * @returns Array of selected skill names
 */
export async function promptSkillSelection(
  skills: DiscoveredSkill[]
): Promise<string[]> {
  if (skills.length === 0) {
    p.intro('No skills found');
    return [];
  }

  const existingCount = skills.filter((s) => s.existsInTarget).length;
  const newCount = skills.length - existingCount;

  p.intro(`Found ${skills.length} skill${skills.length !== 1 ? 's' : ''} (${newCount} new, ${existingCount} already exist)`);

  const selected = await p.multiselect({
    message: 'Select skills to add:',
    options: skills.map((skill) => {
      const existsHint = skill.existsInTarget ? ' — Already exists!' : '';
      return {
        value: skill.name,
        label: skill.metadata.name || skill.name,
        hint: `${skill.metadata.description || 'No description'}${existsHint}`,
        // Disable existing skills by default, user can still select them
        disabled: false
      };
    })
  });

  if (p.isCancel(selected)) {
    p.cancel('Operation cancelled');
    process.exit(0);
  }

  return selected as string[];
}

/**
 * Prompt user for confirmation before copying
 * @param selectedSkills - Array of selected skill names
 * @param targetPath - Target repository path
 * @param dryRun - Whether this is a dry run
 * @returns True if user confirms
 */
export async function promptConfirmation(
  selectedSkills: string[],
  targetPath: string,
  dryRun: boolean = false
): Promise<boolean> {
  const dryRunText = dryRun ? ' (dry run)' : '';
  const confirmed = await p.confirm({
    message: `Add ${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} to ${targetPath}${dryRunText}?`
  });

  if (p.isCancel(confirmed) || !confirmed) {
    return false;
  }

  return true;
}

/**
 * Display copy results summary
 * @param results - Array of copy results
 * @param dryRun - Whether this was a dry run
 */
export function displayResults(results: CopyResult[], dryRun: boolean = false): void {
  const succeeded = results.filter((r) => r.status === 'success').length;
  const skipped = results.filter((r) => r.status === 'skipped').length;
  const errors = results.filter((r) => r.status === 'error').length;
  const dryRuns = results.filter((r) => r.status === 'dry-run').length;

  if (dryRun) {
    p.outro(`Dry run complete: ${dryRuns} skill${dryRuns !== 1 ? 's' : ''} would be added`);
    return;
  }

  if (errors > 0) {
    p.outro(`Completed: ${succeeded} added, ${skipped} skipped, ${errors} failed`);
    // Show errors
    for (const result of results) {
      if (result.status === 'error') {
        console.error(`  ${result.skill}: ${result.error}`);
      }
    }
  } else if (skipped > 0) {
    p.outro(`Completed: ${succeeded} added, ${skipped} skipped`);
  } else {
    p.outro(`Added ${succeeded} skill${succeeded !== 1 ? 's' : ''} successfully`);
  }
}

/**
 * Create a spinner for progress indication
 * @returns Spinner instance
 */
export function createSpinner() {
  return p.spinner();
}
