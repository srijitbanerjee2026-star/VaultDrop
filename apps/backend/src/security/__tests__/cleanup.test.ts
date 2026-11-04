import { describe, it, expect, vi } from 'vitest';
import { identifyStaleFiles, UpdatableFileRecord } from '../cleanup.js';

describe('Scheduled Cleanup Service Utility', () => {
  const mockFiles: UpdatableFileRecord[] = [
    {
      id: '1',
      filePath: '/uploads/active.png',
      expiresAt: new Date(Date.now() + 100000), // active
      downloadCount: 0,
      maxDownloads: 3,
      status: 'active',
    },
    {
      id: '2',
      filePath: '/uploads/expired.png',
      expiresAt: new Date(Date.now() - 5000), // expired
      downloadCount: 1,
      maxDownloads: 3,
      status: 'active',
    },
    {
      id: '3',
      filePath: '/uploads/exhausted.png',
      expiresAt: new Date(Date.now() + 100000),
      downloadCount: 3, // exhausted
      maxDownloads: 3,
      status: 'active',
    },
    {
      id: '4',
      filePath: '/uploads/already_deleted.png',
      expiresAt: new Date(Date.now() - 5000),
      downloadCount: 3,
      maxDownloads: 3,
      status: 'deleted',
    },
  ];

  it('should correctly identify expired and download-exhausted files', () => {
    const staleFiles = identifyStaleFiles(mockFiles);

    expect(staleFiles.length).toBe(2);
    expect(staleFiles.map((f) => f.id)).toEqual(['2', '3']);
  });

  it('should ignore files already marked as deleted', () => {
    const staleFiles = identifyStaleFiles(mockFiles);
    const hasDeleted = staleFiles.some((f) => f.id === '4');

    expect(hasDeleted).toBe(false);
  });
});