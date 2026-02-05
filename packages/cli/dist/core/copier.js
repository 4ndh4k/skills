import { mkdir, cp } from 'node:fs/promises';
import { join } from 'node:path';
/**
 * Copy selected skills to the target repository
 * @param skills - Array of discovered skills to copy
 * @param options - Copy options
 * @returns Array of copy results
 */
export async function copySkills(skills, options) {
    const results = [];
    // Ensure skills directory exists in target
    const skillsDir = join(options.targetPath, 'skills');
    try {
        await mkdir(skillsDir, { recursive: true });
    }
    catch (error) {
        // Ignore error if directory already exists
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
    for (const skill of skills) {
        const targetDir = join(skillsDir, skill.name);
        try {
            // Check if skill already exists in target
            if (skill.existsInTarget && !options.overwrite) {
                results.push({
                    skill: skill.name,
                    status: 'skipped',
                    reason: 'Already exists in target (use --overwrite to replace)'
                });
                continue;
            }
            // Dry run mode
            if (options.dryRun) {
                results.push({
                    skill: skill.name,
                    status: 'dry-run',
                    target: targetDir
                });
                continue;
            }
            // Copy the skill directory
            await cp(skill.directory, targetDir, { recursive: true, force: true });
            results.push({
                skill: skill.name,
                status: 'success',
                target: targetDir
            });
        }
        catch (error) {
            results.push({
                skill: skill.name,
                status: 'error',
                error: String(error)
            });
        }
    }
    return results;
}
//# sourceMappingURL=copier.js.map