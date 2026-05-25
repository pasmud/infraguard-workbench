import { describe, it, expect } from 'vitest';

describe('Export Service', () => {
  it('should have generateMarkdownReport function', async () => {
    const mod = await import('../src/services/export.ts');
    expect(typeof mod.generateMarkdownReport).toBe('function');
  });

  it('should have generateJsonReport function', async () => {
    const mod = await import('../src/services/export.ts');
    expect(typeof mod.generateJsonReport).toBe('function');
  });
});
