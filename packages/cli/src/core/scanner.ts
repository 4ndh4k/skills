import { readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { DiscoveredSkill, ScanOptions } from '../types/skill.js';
import { parseSkillFile, extractNameFromDirectory } from './parser.js';

/**
 * Check if a file or directory exists
 * @param path - Path to check
 * @returns True if the path exists
 */
async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a skill already exists in the target repository
 * @param skillName - Name of the skill (directory name)
 * @param targetPath - Path to the target repository
 * @returns True if the skill exists in the target
 */
async function checkExistsInTarget(
  skillName: string,
  targetPath: string | undefined
): Promise<boolean> {
  if (!targetPath) {
    return false;
  }
  const targetSkillDir = join(targetPath, 'skills', skillName);
  return await fileExists(targetSkillDir);
}

/**
 * Scan a directory for skills (directories containing SKILL.md)
 * @param options - Scan options
 * @returns Array of discovered skills
 */
export async function scanForSkills(
  options: ScanOptions
): Promise<DiscoveredSkill[]> {
  const skills: DiscoveredSkill[] = [];
  const scanPath = resolve(options.path);

  try {
    const entries = await readdir(scanPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const skillPath = join(scanPath, entry.name);
      const skillFilePath = join(skillPath, 'SKILL.md');

      // Check if SKILL.md exists in this directory
      if (!(await fileExists(skillFilePath))) {
        continue;
      }

      // Parse the skill file
      const metadata = await parseSkillFile(skillFilePath);

      // Use directory name as the skill name (for consistency with target repo structure)
      // Metadata.name is for display purposes
      skills.push({
        directory: skillPath,
        name: entry.name,
        metadata,
        existsInTarget: await checkExistsInTarget(entry.name, options.targetPath)
      });
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`Directory not found: ${scanPath}`);
    }
    throw error;
  }

  return skills;
}
