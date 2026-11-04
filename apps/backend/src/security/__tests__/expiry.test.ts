import { describe, it, expect } from 'vitest';
import { isExpired } from '../expiry.js';

describe('Expiry Validation Utility', () => {
  it('should return true for past dates', () => {
    const pastDate = new Date(Date.now() - 10000);
    expect(isExpired(pastDate)).toBe(true);
  });

  it('should return false for future dates', () => {
    const futureDate = new Date(Date.now() + 60000);
    expect(isExpired(futureDate)).toBe(false);
  });

  it('should correctly evaluate string ISO timestamps', () => {
    const pastISO = new Date(Date.now() - 5000).toISOString();
    expect(isExpired(pastISO)).toBe(true);
  });

  it('should throw an error for invalid date formats', () => {
    expect(() => isExpired('invalid-date')).toThrow('Invalid expiration date provided');
  });
});