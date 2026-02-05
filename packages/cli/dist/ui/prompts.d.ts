import type { DiscoveredSkill, CopyResult } from '../types/skill.js';
/**
 * Prompt user to select skills from discovered list
 * @param skills - Array of discovered skills
 * @returns Array of selected skill names
 */
export declare function promptSkillSelection(skills: DiscoveredSkill[]): Promise<string[]>;
/**
 * Prompt user for confirmation before copying
 * @param selectedSkills - Array of selected skill names
 * @param targetPath - Target repository path
 * @param dryRun - Whether this is a dry run
 * @returns True if user confirms
 */
export declare function promptConfirmation(selectedSkills: string[], targetPath: string, dryRun?: boolean): Promise<boolean>;
/**
 * Display copy results summary
 * @param results - Array of copy results
 * @param dryRun - Whether this was a dry run
 */
export declare function displayResults(results: CopyResult[], dryRun?: boolean): void;
/**
 * Create a spinner for progress indication
 * @returns Spinner instance
 */
export declare function createSpinner(): {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
};
//# sourceMappingURL=prompts.d.ts.map