import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';
import { scanForSkills } from '../src/core/scanner.js';

// Mock fs module
vi.mock('node:fs/promises', async () => {
  const memfs = await import('memfs');
  return {
    readdir: memfs.fs.promises.readdir,
    stat: memfs.fs.promises.stat,
    readFile: memfs.fs.promises.readFile
  };
});

describe('scanner', () => {
  beforeEach(() => {
    vol.reset();
  });

  it('should discover skills in a directory', async () => {
    vol.fromJSON({
      '/scan/my-skill/SKILL.md': `---
name: my-skill
description: My test skill
---
Content`,
      '/scan/other-skill/SKILL.md': `---
name: other-skill
---
Content`,
      '/scan/not-a-skill.txt': 'Not a skill'
    });

    const skills = await scanForSkills({ path: '/scan' });

    expect(skills).toHaveLength(2);
    expect(skills[0].name).toBe('my-skill');
    expect(skills[1].name).toBe('other-skill');
  });

  it('should skip directories without SKILL.md', async () => {
    vol.fromJSON({
      '/scan/valid-skill/SKILL.md': '---\nname: valid\n---\nContent',
      '/scan/invalid-skill/README.md': 'No SKILL.md here'
    });

    const skills = await scanForSkills({ path: '/scan' });

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('valid-skill'); // Uses directory name
    expect(skills[0].metadata.name).toBe('valid'); // Metadata name for display
  });

  it('should mark existing skills in target', async () => {
    vol.fromJSON({
      '/scan/my-skill/SKILL.md': '---\nname: my-skill\n---\nContent',
      '/target/skills/my-skill/SKILL.md': '---\nname: my-skill\n---\nExisting'
    });

    const skills = await scanForSkills({ path: '/scan', targetPath: '/target' });

    expect(skills).toHaveLength(1);
    expect(skills[0].existsInTarget).toBe(true);
  });

  it('should handle non-existent directory', async () => {
    await expect(scanForSkills({ path: '/nonexistent' })).rejects.toThrow();
  });

  it('should return empty array for directory with no skills', async () => {
    vol.fromJSON({
      '/scan/empty-dir/README.md': 'Nothing here'
    });

    const skills = await scanForSkills({ path: '/scan' });

    expect(skills).toHaveLength(0);
  });
});
