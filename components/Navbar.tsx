'use client';

import React from 'react';
import { BookOpen, Sparkles, RotateCcw, Download } from 'lucide-react';

interface NavbarProps {
  onLoadSample: () => void;
  onReset: () => void;
  onDownload: () => void;
  isDownloading: boolean;
}

export function Navbar({ onLoadSample, onReset, onDownload, isDownloading }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-none bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-sm">
            <BookOpen className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
          <span className="text-sm sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
            SubjectDigest
          </span>
        </div>

        {/* Zone 2: Navigation / Quick actions */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={onLoadSample}
            type="button"
            className="flex items-center gap-1 px-2 py-1.5 rounded-none hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors whitespace-nowrap border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
            title="Load sample daily notes for all 5 subjects"
            aria-label="Load Sample"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
            <span className="hidden sm:inline">Sample</span>
          </button>
          <button
            onClick={onReset}
            type="button"
            className="flex items-center gap-1 px-2 py-1.5 rounded-none hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700"
            title="Clear all fields"
            aria-label="Clear All"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onDownload}
            disabled={isDownloading}
            type="button"
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-black hover:bg-neutral-800 active:bg-neutral-900 dark:text-black dark:bg-white dark:hover:bg-neutral-200 rounded-none shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">{isDownloading ? 'Saving...' : 'Download Image'}</span>
            <span className="sm:hidden">{isDownloading ? 'Saving...' : 'Download'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
