import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';
import { parseSkillFile, isValidSkillFile } from '../src/core/parser.js';

// Mock fs module
vi.mock('node:fs/promises', () => ({
  readFile: async (path: string) => {
    const fs = (await import('memfs')).vol;
    return fs.readFileSync(path, 'utf-8');
  }
}));

describe('parser', () => {
  beforeEach(() => {
    vol.reset();
  });

  describe('parseSkillFile', () => {
    it('should parse valid skill file with name and description', async () => {
      vol.fromJSON({
        '/test/skill/SKILL.md': `---
name: test-skill
description: A test skill
---
# Test Skill

This is a test skill.`
      });

      const result = await parseSkillFile('/test/skill/SKILL.md');

      expect(result.name).toBe('test-skill');
      expect(result.description).toBe('A test skill');
    });

    it('should handle skill file without description', async () => {
      vol.fromJSON({
        '/test/skill/SKILL.md': `---
name: test-skill
---
# Test Skill`
      });

      const result = await parseSkillFile('/test/skill/SKILL.md');

      expect(result.name).toBe('test-skill');
      expect(result.description).toBeUndefined();
    });

    it('should handle missing front matter gracefully', async () => {
      vol.fromJSON({
        '/test/skill/SKILL.md': `# Test Skill

This has no front matter.`
      });

      const result = await parseSkillFile('/test/skill/SKILL.md');

      expect(result.name).toBe('');
    });

    it('should handle non-existent file gracefully', async () => {
      const result = await parseSkillFile('/test/missing/SKILL.md');

      expect(result.name).toBe('');
    });
  });

  describe('isValidSkillFile', () => {
    it('should return true for valid skill file', () => {
      const content = `---
name: test-skill
---
# Test`;

      expect(isValidSkillFile(content)).toBe(true);
    });

    it('should return false for file without name', () => {
      const content = `---
description: A skill
---
# Test`;

      expect(isValidSkillFile(content)).toBe(false);
    });

    it('should return false for file without front matter', () => {
      const content = `# Test Skill\n\nContent`;

      expect(isValidSkillFile(content)).toBe(false);
    });
  });
});
