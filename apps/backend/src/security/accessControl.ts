import { isExpired } from './expiry.js';
import { verifyPassword } from './password.js';

export interface FileMetadata {
  id: string;
  shareToken: string;
  filePath: string;
  passwordHash: string | null;
  downloadCount: number;
  maxDownloads: number;
  expiresAt: Date | string | number;
}

export type AccessDecision =
  | { allowed: true }
  | { allowed: false; reason: 'NOT_FOUND' | 'EXPIRED' | 'LIMIT_EXHAUSTED' | 'INVALID_PASSWORD' | 'PASSWORD_REQUIRED' };

/**
 * Evaluates security access rules for a file download request.
 */
export async function evaluateDownloadAccess(
  file: FileMetadata | null,
  providedPassword?: string
): Promise<AccessDecision> {
  // 1. Record presence check
  if (!file) {
    return { allowed: false, reason: 'NOT_FOUND' };
  }

  // 2. Link expiration check
  if (isExpired(file.expiresAt)) {
    return { allowed: false, reason: 'EXPIRED' };
  }

  // 3. Download limit check
  if (file.downloadCount >= file.maxDownloads) {
    return { allowed: false, reason: 'LIMIT_EXHAUSTED' };
  }

  // 4. Password security check
  if (file.passwordHash) {
    if (!providedPassword) {
      return { allowed: false, reason: 'PASSWORD_REQUIRED' };
    }

    const isPasswordValid = await verifyPassword(providedPassword, file.passwordHash);
    if (!isPasswordValid) {
      return { allowed: false, reason: 'INVALID_PASSWORD' };
    }
  }

  return { allowed: true };
}