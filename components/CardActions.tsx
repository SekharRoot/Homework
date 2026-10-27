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
  Type,
} from 'lucide-react';
import {
  ThemePreset,
  FontStyle,
  FONT_OPTIONS,
  DigestData,
  generateWhatsAppText,
} from '@/lib/formatter';

interface CardActionsProps {
  data: DigestData;
  theme: ThemePreset;
  onThemeChange: (theme: ThemePreset) => void;
  fontStyle: FontStyle;
  onFontStyleChange: (font: FontStyle) => void;
  onDownload: () => void;
  onCopyImage: () => void;
  onShareImage: () => void;
  isDownloading: boolean;
}

const THEME_OPTIONS: { id: ThemePreset; name: string; colorClass: string }[] = [
  { id: 'clean-white', name: 'Crisp White', colorClass: 'bg-white border border-neutral-400' },
  { id: 'dark-slate', name: 'Dark Black', colorClass: 'bg-black border border-neutral-750' },
  { id: 'whatsapp-mint', name: 'WhatsApp Mint', colorClass: 'bg-[#075e54]' },
  { id: 'academic-blue', name: 'Academic Blue', colorClass: 'bg-blue-800' },
  { id: 'warm-paper', name: 'Warm Notebook', colorClass: 'bg-amber-800' },
];

export function CardActions({
  data,
  theme,
  onThemeChange,
  fontStyle,
  onFontStyleChange,
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
    <div className="bg-white dark:bg-black rounded-none p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
      {/* Visual Customization: Theme and Font */}
      <div className="space-y-3">
        {/* Theme selection */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <Palette className="w-4 h-4 text-black dark:text-white" />
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
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-transparent'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-none ${opt.colorClass}`} />
                <span>{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Style Selection (Serif, Sans, Mono) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-neutral-100 dark:border-neutral-850">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <Type className="w-4 h-4 text-black dark:text-white" />
            <span>Font Style:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {FONT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onFontStyleChange(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-none transition-all ${opt.previewClass} ${
                  fontStyle === opt.id
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 font-medium'
                }`}
                title={`Switch card font to ${opt.name}`}
              >
                <span className="text-[11px] opacity-80">
                  {opt.id === 'serif' ? 'Ag' : opt.id === 'mono' ? '</>' : 'Aa'}
                </span>
                <span>{opt.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary HQ Image Actions */}
      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Main Download Button */}
          <button
            type="button"
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-black hover:bg-neutral-800 active:bg-neutral-900 dark:text-black dark:bg-white dark:hover:bg-neutral-200 rounded-none shadow-sm transition-all disabled:opacity-60"
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
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 active:bg-black dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white rounded-none transition-colors border border-neutral-700 disabled:opacity-60"
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
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-none transition-colors border border-neutral-200 dark:border-neutral-800 disabled:opacity-60"
            title="Copy image binary to clipboard to paste directly (Ctrl+V) in WhatsApp Web"
          >
            <ImageIcon className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
            <span>Copy Image (Paste in Chat)</span>
          </button>

          {/* Copy WhatsApp Text */}
          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 rounded-none transition-colors border border-neutral-200 dark:border-neutral-800"
            title="Copy WhatsApp-formatted markdown text"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-black dark:text-white" />
                <span className="text-black dark:text-white font-semibold">Copied Formatted Text!</span>
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
        <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-850 px-1">
          <span className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span>Ultra-HD Quality: 3x Pixel Ratio (1620px Width)</span>
          </span>
          <span className="text-neutral-400 font-mono text-[10px]">
            Lossless PNG
          </span>
        </div>
      </div>
    </div>
  );
}
