import React, { useState } from 'react';
import { Shield, Copy, Check, Lock, Clock, Download, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface SharePageProps {
  shareToken?: string;
  fileName?: string;
  fileSize?: string;
  expiryLabel?: string;
  downloadLimit?: number;
  hasPassword?: boolean;
  onUploadAnother?: () => void;
}

export const SharePage: React.FC<SharePageProps> = ({
  shareToken = 'vlt_9x82k1m0a',
  fileName = 'financial_report_q3.pdf',
  fileSize = '4.2 MB',
  expiryLabel = '1 Hour',
  downloadLimit = 3,
  hasPassword = true,
  onUploadAnother,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/download/${shareToken}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <Badge variant="success">File Encrypted & Ready</Badge>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl w-full mx-auto my-auto py-6">
        <Card className="p-6 sm:p-8 space-y-7 shadow-md border-slate-200/90">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/80 shadow-2xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-vault-navy">Secure Share Link Created</h1>
            <p className="text-sm text-vault-slate">Anyone with this link can download the file according to your access rules.</p>
          </div>

          {/* Share Link Input with Copy Button */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-vault-navy">Shareable Link</label>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-mono focus:outline-none"
              />
              <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'} className="shrink-0 px-5">
                {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>

          {/* Configured Rules Summary */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Configured Policy</h3>
            <div className="grid sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-vault-accent shrink-0" />
                <span className="text-slate-600">Expires in: <strong className="text-vault-navy">{expiryLabel}</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Download className="w-4 h-4 text-vault-accent shrink-0" />
                <span className="text-slate-600">Max downloads: <strong className="text-vault-navy">{downloadLimit}</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Lock className="w-4 h-4 text-vault-accent shrink-0" />
                <span className="text-slate-600">Password: <strong className="text-vault-navy">{hasPassword ? 'Enabled' : 'None'}</strong></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-vault-accent shrink-0" />
                <span className="text-slate-600">File: <strong className="text-vault-navy truncate">{fileName} ({fileSize})</strong></span>
              </div>
            </div>
          </div>

          {/* Upload Another Button */}
          <div className="pt-2">
            <Button variant="outline" className="w-full py-3 text-sm font-semibold" onClick={onUploadAnother}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Upload Another File
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-4">
        VaultDrop &copy; {new Date().getFullYear()} — Secure, zero-retention temporary storage.
      </footer>
    </div>
  );
};