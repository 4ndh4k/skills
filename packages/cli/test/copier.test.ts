import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';
import { copySkills } from '../src/core/copier.js';
import type { DiscoveredSkill } from '../src/types/skill.js';

// Mock fs module
vi.mock('node:fs/promises', async () => {
  const memfs = await import('memfs');
  return {
    mkdir: memfs.fs.promises.mkdir,
    cp: memfs.fs.promises.cp
  };
});

describe('copier', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should copy skills to target', async () => {
    vol.fromJSON({
      '/source/my-skill/SKILL.md': '---\nname: my-skill\n---\nContent'
    });

    const skills: DiscoveredSkill[] = [
      {
        directory: '/source/my-skill',
        name: 'my-skill',
        metadata: { name: 'my-skill', description: 'Test' },
        existsInTarget: false
      }
    ];

    const results = await copySkills(skills, { targetPath: '/target' });

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('success');
    expect(results[0].target).toBe('/target/skills/my-skill');
  });

  it('should skip existing skills without overwrite', async () => {
    vol.fromJSON({
      '/source/my-skill/SKILL.md': '---\nname: my-skill\n---\nNew',
      '/target/skills/my-skill/SKILL.md': '---\nname: my-skill\n---\nOld'
    });

    const skills: DiscoveredSkill[] = [
      {
        directory: '/source/my-skill',
        name: 'my-skill',
        metadata: { name: 'my-skill' },
        existsInTarget: true
      }
    ];

    const results = await copySkills(skills, { targetPath: '/target', overwrite: false });

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('skipped');
    expect(results[0].reason).toContain('Already exists');
  });

  it('should handle dry-run mode', async () => {
    vol.fromJSON({
      '/source/my-skill/SKILL.md': '---\nname: my-skill\n---\nContent'
    });

    const skills: DiscoveredSkill[] = [
      {
        directory: '/source/my-skill',
        name: 'my-skill',
        metadata: { name: 'my-skill' },
        existsInTarget: false
      }
    ];

    const results = await copySkills(skills, { targetPath: '/target', dryRun: true });

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe('dry-run');
    expect(results[0].target).toBe('/target/skills/my-skill');
  });

  it('should create skills directory if it does not exist', async () => {
    vol.fromJSON({
      '/source/my-skill/SKILL.md': '---\nname: my-skill\n---\nContent'
    });

    const skills: DiscoveredSkill[] = [
      {
        directory: '/source/my-skill',
        name: 'my-skill',
        metadata: { name: 'my-skill' },
        existsInTarget: false
      }
    ];

    await copySkills(skills, { targetPath: '/target' });

    // Check that the skills directory was created
    expect(vol.existsSync('/target/skills')).toBe(true);
  });
});
