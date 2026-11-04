import fs from 'fs/promises';

export interface UpdatableFileRecord {
  id: string;
  filePath: string;
  expiresAt: Date | string | number;
  downloadCount: number;
  maxDownloads: number;
  status: 'active' | 'expired' | 'deleted';
}

export interface CleanupResult {
  identified: number;
  deletedFiles: number;
  failedDeletions: number;
}

/**
 * Safely deletes a file from the local filesystem if it exists.
 */
export async function deleteLocalFile(filePath: string): Promise<boolean> {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error: any) {
    // If the file is already missing from disk, treat deletion as non-blocking
    if (error.code === 'ENOENT') {
      return true;
    }
    console.error(`[Cleanup Error] Failed to delete file at ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Filters records ready for cleanup based on expiry or download exhaustion.
 */
export function identifyStaleFiles(records: UpdatableFileRecord[], referenceTime: Date = new Date()): UpdatableFileRecord[] {
  const refTimeMs = referenceTime.getTime();

  return records.filter((file) => {
    if (file.status === 'deleted') return false;

    const isExpired = new Date(file.expiresAt).getTime() <= refTimeMs;
    const isExhausted = file.downloadCount >= file.maxDownloads;

    return isExpired || isExhausted;
  });
}