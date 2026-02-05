/**
 * Metadata extracted from a SKILL.md file's YAML front matter
 */
export interface SkillMetadata {
    name: string;
    description?: string;
    [key: string]: unknown;
}
/**
 * A discovered skill with its location and metadata
 */
export interface DiscoveredSkill {
    /** Full path to the skill directory */
    directory: string;
    /** Name of the skill (directory name) */
    name: string;
    /** Parsed metadata from SKILL.md */
    metadata: SkillMetadata;
    /** Whether this skill already exists in the target repository */
    existsInTarget: boolean;
}
/**
 * Options for scanning directories
 */
export interface ScanOptions {
    /** Path to scan for skills */
    path: string;
    /** Whether to scan recursively (not yet implemented) */
    recursive?: boolean;
    /** Target repository path (defaults to _4NDH4K_SKILLS_PATH env var) */
    targetPath?: string;
}
/**
 * Options for copying skills
 */
export interface CopyOptions {
    /** Target repository path */
    targetPath: string;
    /** Whether to overwrite existing skills */
    overwrite?: boolean;
    /** Preview changes without copying */
    dryRun?: boolean;
}
/**
 * Result of copying a single skill
 */
export interface CopyResult {
    /** Name of the skill */
    skill: string;
    /** Status of the copy operation */
    status: 'success' | 'skipped' | 'error' | 'dry-run';
    /** Target path (for success/dry-run) */
    target?: string;
    /** Reason for skipping */
    reason?: string;
    /** Error message (for error status) */
    error?: string;
}
/**
 * CLI options from commander
 */
export interface CliOptions {
    /** Path to scan for skills */
    path?: string;
    /** Target repository path */
    target?: string;
    /** Preview changes without copying */
    dryRun?: boolean;
    /** Scan recursively */
    recursive?: boolean;
}
//# sourceMappingURL=skill.d.ts.map