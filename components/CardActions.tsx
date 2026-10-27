'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Share2,
  Palette,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { ThemePreset, DigestData, generateWhatsAppText } from '@/lib/formatter';

interface CardActionsProps {
  data: DigestData;
  theme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
  onDownload: () => void;
  onCopyImage: () => void;
  onShareImage: () => void;
  isDownloading: boolean;
}

const THEME_OPTIONS: { id: ThemePreset; name: string; colorClass: string }[] = [
  { id: 'whatsapp-mint', name: 'WhatsApp Mint', colorClass: 'bg-[#075e54]' },
  { id: 'clean-white', name: 'Crisp White', colorClass: 'bg-slate-900' },
  { id: 'dark-slate', name: 'Dark Slate', colorClass: 'bg-slate-700' },
  { id: 'academic-blue', name: 'Academic Blue', colorClass: 'bg-blue-800' },
  { id: 'warm-paper', name: 'Warm Notebook', colorClass: 'bg-amber-800' },
];

export function CardActions({
  data,
  theme,
  onThemeChange,
  onDownload,
  onCopyImage,
  onShareImage,
  isDownloading,
}: CardActionsProps) {
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyText = async () => {
    try {
      const formatted = generateWhatsAppText(data);
      await navigator.clipboard.writeText(formatted);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {
      const formatted = generateWhatsAppText(data);
      const textarea = document.createElement('textarea');
      textarea.value = formatted;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-none p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      {/* Theme selection */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Palette className="w-4 h-4 text-emerald-600" />
          <span>Card Theme:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {THEME_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onThemeChange(opt.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-none font-medium transition-all ${
                theme === opt.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-none ${opt.colorClass}`} />
              <span>{opt.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary HQ Image Actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Main Download Button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-none shadow-sm transition-all disabled:opacity-60"
            title="Download uncompressed 3x Ultra-HD PNG image"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Rendering HQ...' : 'Download HQ PNG Image'}</span>
          </button>

          {/* Direct Share Image (Mobile/Desktop Web Share) */}
          <button
            type="button"
            onClick={onShareImage}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#075e54] bg-[#25d366]/20 hover:bg-[#25d366]/30 dark:text-emerald-300 dark:bg-emerald-950/60 dark:hover:bg-emerald-950/80 rounded-none transition-colors border border-emerald-300/40 disabled:opacity-60"
            title="Share high quality PNG directly into WhatsApp or other apps"
          >
            <Share2 className="w-4 h-4" />
            <span>Share HQ Image</span>
          </button>
        </div>

        {/* Secondary clipboard shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Copy PNG Image directly to clipboard for Ctrl+V paste into WhatsApp Web */}
          <button
            type="button"
            onClick={onCopyImage}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-none transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-60"
            title="Copy image binary to clipboard to paste directly (Ctrl+V) in WhatsApp Web"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copy Image (Paste in Chat)</span>
          </button>

          {/* Copy WhatsApp Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-none transition-colors border border-slate-200 dark:border-slate-700"
            title="Copy WhatsApp-formatted markdown text"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied Formatted Text!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy WhatsApp Text</span>
              </>
            )}
          </button>
        </div>

        {/* Quality indicator banner */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/80 px-1">
          <span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ultra-HD Quality: 3x Pixel Ratio (1620px Width)</span>
          </span>
          <span className="text-slate-400 font-mono text-[10px]">
            Lossless PNG
          </span>
        </div>
      </div>
    </div>
  );
}
