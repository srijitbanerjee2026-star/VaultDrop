import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '../password.js';

describe('Password Security Utilities', () => {
  it('should generate a valid hash different from plain text', async () => {
    const plain = 'SecretPass123!';
    const hash = await hashPassword(plain);
    
    expect(hash).not.toBe(plain);
    expect(hash.startsWith('$2')).toBe(true);
  });

  it('should return true for correct password verification', async () => {
    const plain = 'MyVaultPassword';
    const hash = await hashPassword(plain);
    const isValid = await verifyPassword(plain, hash);

    expect(isValid).toBe(true);
  });

  it('should return false for incorrect password verification', async () => {
    const plain = 'CorrectPassword';
    const hash = await hashPassword(plain);
    const isValid = await verifyPassword('WrongPassword', hash);

    expect(isValid).toBe(false);
  });
});