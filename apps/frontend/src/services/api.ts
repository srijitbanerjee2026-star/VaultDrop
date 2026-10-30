import {
  UploadPayload,
  UploadResponse,
  FileMetadataResponse,
  DownloadPayload,
  DownloadResponse,
} from '../types/api';

// Set this to true to force live backend calls once your teammate's endpoints are live
const USE_REAL_BACKEND = false;
const API_BASE_URL = 'http://localhost:5000/api';

export const vaultApi = {
  /**
   * Upload a file with retention rules
   */
  async uploadFile(payload: UploadPayload): Promise<UploadResponse> {
    if (USE_REAL_BACKEND) {
      const formData = new FormData();
      formData.append('file', payload.file);
      formData.append('expiry', payload.expiry);
      formData.append('downloadLimit', String(payload.downloadLimit));
      if (payload.password) {
        formData.append('password', payload.password);
      }

      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload file.');
      }

      return response.json();
    }

    // Clean Mock Fallback
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const mockToken = `vlt_${Math.random().toString(36).substring(2, 11)}`;

    return {
      success: true,
      shareToken: mockToken,
      shareUrl: `${window.location.origin}/download/${mockToken}`,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      maxDownloads: payload.downloadLimit,
      hasPassword: Boolean(payload.password),
    };
  },

  /**
   * Fetch public file metadata for the recipient page
   */
  async getFileMetadata(token: string): Promise<FileMetadataResponse> {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/files/${token}`);
      if (!response.ok) {
        throw new Error('File not found or link has expired.');
      }
      return response.json();
    }

    // Clean Mock Fallback
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      success: true,
      shareToken: token,
      fileName: 'quarterly_financial_report.pdf',
      fileSize: 4404019,
      formattedSize: '4.2 MB',
      expiresIn: '45 minutes',
      downloadsLeft: 3,
      hasPassword: true,
      isExpired: false,
      isLimitReached: false,
    };
  },

  /**
   * Request file download verification
   */
  async downloadFile(payload: DownloadPayload): Promise<DownloadResponse> {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/files/${payload.shareToken}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: payload.password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid password or expired file.');
      }

      return response.json();
    }

    // Clean Mock Fallback
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (payload.password && payload.password !== 'vault123') {
      throw new Error('Incorrect password. Access denied.');
    }

    return {
      success: true,
      fileName: 'quarterly_financial_report.pdf',
      message: 'Download authorized.',
    };
  },
};