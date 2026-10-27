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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-none bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            SubjectDigest
          </span>
        </div>

        {/* Zone 2: Navigation / Quick actions */}
        <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={onLoadSample}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            title="Load sample daily notes for all 5 subjects"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden xs:inline sm:inline">Sample</span>
          </button>
          <button
            onClick={onReset}
            type="button"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors whitespace-nowrap border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            title="Clear all fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onDownload}
            disabled={isDownloading}
            type="button"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-none shadow-sm transition-all whitespace-nowrap disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{isDownloading ? 'Saving...' : 'Download Image'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
