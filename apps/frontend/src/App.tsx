import React, { useState } from 'react';
import { UploadPage } from './pages/UploadPage';
import { SharePage } from './pages/SharePage';
import { DownloadPage } from './pages/DownloadPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'upload' | 'share' | 'download'>('upload');

  return (
    <div>
      {/* Prototype Flow Switcher */}
      <div className="bg-vault-navy text-white text-xs py-2.5 px-4 flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 gap-2">
        <span className="font-semibold text-slate-300">VaultDrop Flow Controller:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage('upload')}
            className={`px-3 py-1 rounded-md transition-all ${
              currentPage === 'upload' ? 'bg-vault-accent text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. Upload Page
          </button>
          <button
            onClick={() => setCurrentPage('share')}
            className={`px-3 py-1 rounded-md transition-all ${
              currentPage === 'share' ? 'bg-vault-accent text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. Share Link Page
          </button>
          <button
            onClick={() => setCurrentPage('download')}
            className={`px-3 py-1 rounded-md transition-all ${
              currentPage === 'download' ? 'bg-vault-accent text-white font-medium' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. Recipient Download Page
          </button>
        </div>
      </div>

      {/* Active Page View */}
      {currentPage === 'upload' && <UploadPage />}
      {currentPage === 'share' && <SharePage onUploadAnother={() => setCurrentPage('upload')} />}
      {currentPage === 'download' && <DownloadPage />}
    </div>
  );
}