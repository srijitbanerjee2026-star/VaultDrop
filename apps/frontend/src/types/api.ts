export interface UploadPayload {
  file: File;
  expiry: '10m' | '1h' | '24h';
  downloadLimit: 1 | 3 | 10;
  password?: string;
}

export interface UploadResponse {
  success: boolean;
  shareToken: string;
  shareUrl: string;
  expiresAt: string;
  maxDownloads: number;
  hasPassword: boolean;
  message?: string;
}

export interface FileMetadataResponse {
  success: boolean;
  shareToken: string;
  fileName: string;
  fileSize: number;
  formattedSize: string;
  expiresIn: string;
  downloadsLeft: number;
  hasPassword: boolean;
  isExpired: boolean;
  isLimitReached: boolean;
}

export interface DownloadPayload {
  shareToken: string;
  password?: string;
}

export interface DownloadResponse {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  message?: string;
}