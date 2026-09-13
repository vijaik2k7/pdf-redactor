import React, { useRef } from 'react';
import { Upload, Lock } from 'lucide-react';
import { ThemeMode } from '../types/redact';

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  theme: ThemeMode;
}

export const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, theme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === 'dark';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
          isDark
            ? 'border-zinc-800 hover:border-[#FF5500] bg-[#121215] hover:bg-[#18181c]'
            : 'border-[#d8cfbe] hover:border-[#FF5500] bg-[#f5f0e6] hover:bg-[#eae3d5] shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="w-16 h-16 rounded-2xl bg-[#FF5500]/10 text-[#FF5500] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8" />
        </div>

        <h2 className={`text-xl sm:text-2xl font-bold font-mono mb-2 ${isDark ? 'text-white' : 'text-stone-900'}`}>
          Drop PDF file here or click to browse
        </h2>
        <p className={`text-sm max-w-md mx-auto mb-6 ${isDark ? 'text-zinc-400' : 'text-stone-600'}`}>
          Select any PDF document to securely redact sensitive text, SSNs, phone numbers, and images locally.
        </p>

        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
              : 'bg-[#e4ddd0] border-[#c8bca8] text-stone-800'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-emerald-500" />
          <span>100% Client-Side • Files Never Leave Your Device</span>
        </div>
      </div>
    </div>
  );
};
