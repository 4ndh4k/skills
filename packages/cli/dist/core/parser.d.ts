import type { SkillMetadata } from '../types/skill.js';
/**
 * Parse a SKILL.md file and extract metadata from YAML front matter
 * @param filePath - Full path to the SKILL.md file
 * @returns Parsed skill metadata
 */
export declare function parseSkillFile(filePath: string): Promise<SkillMetadata>;
/**
 * Check if a file has valid YAML front matter
 * @param content - File content to check
 * @returns True if the file has valid front matter
 */
export declare function isValidSkillFile(content: string): boolean;
/**
 * Extract skill name from directory path
 * @param filePath - Path to the skill file
 * @returns Directory name as skill name
 */
export declare function extractNameFromDirectory(filePath: string): string;
//# sourceMappingURL=parser.d.ts.map