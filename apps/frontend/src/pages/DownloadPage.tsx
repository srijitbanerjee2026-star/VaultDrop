import React, { useState } from 'react';
import { Shield, Download, Lock, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

type DownloadState = 'normal' | 'password_required' | 'expired' | 'limit_reached' | 'not_found';

interface DownloadPageProps {
  initialState?: DownloadState;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ initialState = 'password_required' }) => {
  const [viewState, setViewState] = useState<DownloadState>(initialState);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const mockFile = {
    name: 'financial_report_q3.pdf',
    size: '4.2 MB',
    downloadsLeft: 2,
    expiresIn: '42 minutes',
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== 'vault123' && password.trim() !== '') {
      setPasswordError('Incorrect password. Please try again.');
      return;
    }

    setViewState('normal');
  };

  const handleStartDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          alert('Download completed successfully!');
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-vault-bg text-vault-navy flex flex-col justify-between p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <header className="max-w-2xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-vault-navy text-white flex items-center justify-center shadow-md">
            <Shield className="w-5 h-5 text-vault-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight">VaultDrop</span>
        </div>

        {/* State Switcher for Verification */}
        <select
          value={viewState}
          onChange={(e) => setViewState(e.target.value as DownloadState)}
          className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-600 shadow-2xs focus:outline-none"
        >
          <option value="password_required">Test View: Password Protected</option>
          <option value="normal">Test View: Ready for Download</option>
          <option value="expired">Test View: Link Expired</option>
          <option value="limit_reached">Test View: Download Limit Reached</option>
          <option value="not_found">Test View: File Not Found</option>
        </select>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto my-auto py-6">
        <Card className="p-6 sm:p-8 space-y-7 shadow-md border-slate-200/90">
          {/* STATE 1: EXPIRED LINK */}
          {viewState === 'expired' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-2xs">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-vault-navy">Share Link Expired</h1>
                <p className="text-sm text-vault-slate max-w-md mx-auto">
                  This shared link has passed its expiration time limit and its contents have been securely deleted.
                </p>
              </div>
              <Badge variant="warning">Time Exceeded</Badge>
            </div>
          )}

          {/* STATE 2: DOWNLOAD LIMIT REACHED */}
          {viewState === 'limit_reached' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200 shadow-2xs">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-vault-navy">Download Limit Exhausted</h1>
                <p className="text-sm text-vault-slate max-w-md mx-auto">
                  This file has reached the maximum number of downloads permitted by the sender.
                </p>
              </div>
              <Badge variant="danger">0 Downloads Remaining</Badge>
            </div>
          )}

          {/* STATE 3: FILE NOT FOUND */}
          {viewState === 'not_found' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto border border-slate-200 shadow-2xs">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-vault-navy">File Unavailable</h1>
                <p className="text-sm text-vault-slate max-w-md mx-auto">
                  The link you are trying to access does not exist or was removed by the sender.
                </p>
              </div>
            </div>
          )}

          {/* STATE 4: PASSWORD ENTRY REQUIRED */}
          {viewState === 'password_required' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-vault-accent flex items-center justify-center mx-auto border border-blue-200/80 shadow-2xs">
                  <Lock className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-vault-navy">Password Protected File</h1>
                <p className="text-sm text-vault-slate">Enter the access passphrase provided by the sender.</p>
              </div>

              <Input
                isPassword
                label="Passphrase"
                placeholder="Enter password"
                value={password}
                error={passwordError}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" className="w-full py-3.5 text-base font-semibold">
                Unlock File
              </Button>
            </form>
          )}

          {/* STATE 5: READY FOR DOWNLOAD */}
          {viewState === 'normal' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-vault-accent shrink-0 shadow-2xs">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="truncate space-y-0.5">
                  <h2 className="text-base font-bold text-vault-navy truncate">{mockFile.name}</h2>
                  <p className="text-xs text-vault-slate">{mockFile.size}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm bg-white p-4 border border-slate-100 rounded-xl">
                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="w-4 h-4 text-vault-accent" />
                  <span>Expires in: <strong className="text-vault-navy">{mockFile.expiresIn}</strong></span>
                </div>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Download className="w-4 h-4 text-vault-accent" />
                  <span>Remaining: <strong className="text-vault-navy">{mockFile.downloadsLeft} downloads</strong></span>
                </div>
              </div>

              {isDownloading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Decrypting & Downloading...</span>
                    <span className="text-vault-accent font-bold">{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-vault-accent h-2.5 rounded-full transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <Button
                className="w-full py-3.5 text-base font-semibold"
                disabled={isDownloading}
                isLoading={isDownloading}
                onClick={handleStartDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Secure File
              </Button>
            </div>
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4">
        VaultDrop &copy; {new Date().getFullYear()} — Secure, zero-retention temporary storage.
      </footer>
    </div>
  );
};