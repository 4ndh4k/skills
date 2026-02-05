import type { DiscoveredSkill, CopyOptions, CopyResult } from '../types/skill.js';
/**
 * Copy selected skills to the target repository
 * @param skills - Array of discovered skills to copy
 * @param options - Copy options
 * @returns Array of copy results
 */
export declare function copySkills(skills: DiscoveredSkill[], options: CopyOptions): Promise<CopyResult[]>;
//# sourceMappingURL=copier.d.ts.map