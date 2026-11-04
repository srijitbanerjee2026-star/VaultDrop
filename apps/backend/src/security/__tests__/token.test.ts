import { describe, it, expect } from 'vitest';
import { validateShareToken } from '../token.js';

describe('Share Token Security Validation', () => {
  it('should accept a valid share token string', () => {
    const validToken = 'abc123xyz-vault-token';
    const result = validateShareToken(validToken);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(validToken);
    }
  });

  it('should reject empty token strings', () => {
    const result = validateShareToken('');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Share token cannot be empty');
    }
  });

  it('should reject non-string input types', () => {
    const result = validateShareToken(12345);

    expect(result.success).toBe(false);
    if (!result.success) {
      // Use toContain to safely validate type mismatch error messages across Zod versions
      expect(result.error).toContain('expected string');
    }
  });
});