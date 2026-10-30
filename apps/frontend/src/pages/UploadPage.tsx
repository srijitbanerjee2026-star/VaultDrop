import React, { useState } from 'react';
import { Shield, Clock, Download, Lock } from 'lucide-react';
import { UploadDropzone } from '../components/UploadDropzone';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { vaultApi } from '../services/api';
import { UploadResponse } from '../types/api';

interface UploadPageProps {
  onUploadSuccess?: (data: UploadResponse, fileName: string, fileSize: string) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiry, setExpiry] = useState<'10m' | '1h' | '24h'>('1h');
  const [downloadLimit, setDownloadLimit] = useState<1 | 3 | 10>(1);
  const [isPasswordEnabled, setIsPasswordEnabled] = useState(false);
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const result = await vaultApi.uploadFile({
        file: selectedFile,
        expiry,
        downloadLimit,
        password: isPasswordEnabled ? password : undefined,
      });

      const formattedSize = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;

      if (onUploadSuccess) {
        onUploadSuccess(result, selectedFile.name, formattedSize);
      } else {
        alert(`Upload successful! Share Token: ${result.shareToken}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vault-bg text-vault-navy flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-vault-navy text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-vault-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight">VaultDrop</span>
        </div>
        <div className="text-xs text-slate-600 font-medium flex items-center space-x-2 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>End-to-End Encrypted</span>
        </div>
      </header>

      <main className="max-w-2xl w-full mx-auto my-auto py-6">
        <Card className="p-6 sm:p-8 space-y-7 shadow-md border-slate-200/90">
          <div className="space-y-1.5 border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-bold tracking-tight text-vault-navy">Share File Securely</h1>
            <p className="text-sm text-vault-slate">
              Configure temporary expiration limits and encryption passphrases before sharing.
            </p>
          </div>

          <UploadDropzone selectedFile={selectedFile} onFileSelect={setSelectedFile} />

          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-vault-navy flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Expiration Time</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '10 Minutes', value: '10m' },
                  { label: '1 Hour', value: '1h' },
                  { label: '24 Hours', value: '24h' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setExpiry(option.value as any)}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl border transition-all ${
                      expiry === option.value
                        ? 'border-vault-accent bg-blue-50/70 text-vault-accent font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-vault-navy flex items-center space-x-2">
                <Download className="w-4 h-4 text-slate-400" />
                <span>Max Download Limit</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '1 Download', value: 1 },
                  { label: '3 Downloads', value: 3 },
                  { label: '10 Downloads', value: 10 },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDownloadLimit(option.value as any)}
                    className={`py-2.5 px-3 text-xs sm:text-sm font-medium rounded-xl border transition-all ${
                      downloadLimit === option.value
                        ? 'border-vault-accent bg-blue-50/70 text-vault-accent font-semibold shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-vault-navy flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Password Protection</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsPasswordEnabled(!isPasswordEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isPasswordEnabled ? 'bg-vault-accent' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isPasswordEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {isPasswordEnabled && (
                <Input
                  isPassword
                  placeholder="Set access passphrase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            </div>
          </div>

          {error && <div className="text-xs text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}

          <div className="pt-2">
            <Button
              className="w-full py-3.5 text-sm sm:text-base font-semibold shadow-sm"
              disabled={!selectedFile || isUploading}
              isLoading={isUploading}
              onClick={handleUpload}
            >
              Upload Secure File
            </Button>
          </div>
        </Card>
      </main>

      <footer className="text-center text-xs text-slate-400 py-4">
        VaultDrop &copy; {new Date().getFullYear()} — Secure, zero-retention temporary storage.
      </footer>
    </div>
  );
};