import { describe, it, expect } from 'vitest';
import { evaluateDownloadAccess, FileMetadata } from '../accessControl.js';
import { hashPassword } from '../password.js';

describe('Access Control Service', () => {
  const mockValidFile: FileMetadata = {
    id: '1',
    shareToken: 'valid-token',
    filePath: '/uploads/sample.txt',
    passwordHash: null,
    downloadCount: 0,
    maxDownloads: 3,
    expiresAt: new Date(Date.now() + 60000), // 1 min in future
  };

  it('should grant access to valid, unprotected file', async () => {
    const decision = await evaluateDownloadAccess(mockValidFile);
    expect(decision.allowed).toBe(true);
  });

  it('should reject non-existent file records', async () => {
    const decision = await evaluateDownloadAccess(null);
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe('NOT_FOUND');
    }
  });

  it('should reject access to expired files', async () => {
    const expiredFile = {
      ...mockValidFile,
      expiresAt: new Date(Date.now() - 10000),
    };
    const decision = await evaluateDownloadAccess(expiredFile);
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe('EXPIRED');
    }
  });

  it('should reject access when download limit is reached', async () => {
    const exhaustedFile = {
      ...mockValidFile,
      downloadCount: 3,
      maxDownloads: 3,
    };
    const decision = await evaluateDownloadAccess(exhaustedFile);
    expect(decision.allowed).toBe(false);
    if (!decision.allowed) {
      expect(decision.reason).toBe('LIMIT_EXHAUSTED');
    }
  });

  it('should enforce password protection checks', async () => {
    const hash = await hashPassword('Secret123');
    const protectedFile = {
      ...mockValidFile,
      passwordHash: hash,
    };

    const decisionNoPass = await evaluateDownloadAccess(protectedFile);
    expect(decisionNoPass.allowed).toBe(false);
    if (!decisionNoPass.allowed) {
      expect(decisionNoPass.reason).toBe('PASSWORD_REQUIRED');
    }

    const decisionWrongPass = await evaluateDownloadAccess(protectedFile, 'Wrong123');
    expect(decisionWrongPass.allowed).toBe(false);
    if (!decisionWrongPass.allowed) {
      expect(decisionWrongPass.reason).toBe('INVALID_PASSWORD');
    }

    const decisionCorrectPass = await evaluateDownloadAccess(protectedFile, 'Secret123');
    expect(decisionCorrectPass.allowed).toBe(true);
  });
});