import { readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import type { SkillMetadata } from '../types/skill.js';

/**
 * Parse a SKILL.md file and extract metadata from YAML front matter
 * @param filePath - Full path to the SKILL.md file
 * @returns Parsed skill metadata
 */
export async function parseSkillFile(filePath: string): Promise<SkillMetadata> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const { data } = matter(content);

    return {
      name: String(data.name || ''),
      description: data.description ? String(data.description) : undefined,
      ...data
    };
  } catch (error) {
    // If file doesn't exist or can't be parsed, return minimal metadata
    return {
      name: '',
      description: undefined
    };
  }
}

/**
 * Check if a file has valid YAML front matter
 * @param content - File content to check
 * @returns True if the file has valid front matter
 */
export function isValidSkillFile(content: string): boolean {
  try {
    const { data } = matter(content);
    return data.name !== undefined;
  } catch {
    return false;
  }
}

/**
 * Extract skill name from directory path
 * @param filePath - Path to the skill file
 * @returns Directory name as skill name
 */
export function extractNameFromDirectory(filePath: string): string {
  const parts = filePath.split('/');
  const dirName = parts[parts.length - 2] || '';
  return dirName;
}
