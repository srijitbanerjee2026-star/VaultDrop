import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

interface UploadDropzoneProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  maxSizeBytes?: number;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  selectedFile,
  onFileSelect,
  maxSizeBytes = 50 * 1024 * 1024,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds maximum allowed limit of ${formatBytes(maxSizeBytes)}.`);
      return;
    }
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-vault-accent bg-blue-50/60 scale-[1.01]'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-vault-accent flex items-center justify-center mx-auto mb-4 border border-blue-100/80 shadow-2xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-vault-navy">
            Click to upload <span className="font-normal text-vault-slate">or drag and drop</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">Maximum file size: 50MB</p>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3.5 overflow-hidden">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
              <File className="w-5 h-5 text-vault-accent" />
            </div>
            <div className="truncate space-y-0.5">
              <p className="text-sm font-semibold text-vault-navy truncate">{selectedFile.name}</p>
              <p className="text-xs text-vault-slate">{formatBytes(selectedFile.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onFileSelect(null)}
            className="p-2 hover:bg-slate-200/80 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2.5 text-xs text-red-600 font-medium bg-red-50 p-3.5 rounded-xl border border-red-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};