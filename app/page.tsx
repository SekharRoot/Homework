'use client';

import React, { useState, useRef } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Navbar } from '@/components/Navbar';
import { SubjectEditor } from '@/components/SubjectEditor';
import { SubjectCardPreview } from '@/components/SubjectCardPreview';
import { CardActions } from '@/components/CardActions';
import {
  DigestData,
  ThemePreset,
  DEFAULT_SUBJECTS,
  SAMPLE_DATA,
} from '@/lib/formatter';
import {
  Smartphone,
  Edit3,
  Eye,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

export default function HomePage() {
  const [data, setData] = useState<DigestData>(() => ({
    title: 'Homework',
    date: new Date().toISOString().split('T')[0],
    announcement: '',
    subjects: DEFAULT_SUBJECTS.map(s => ({ ...s, content: '' })),
  }));

  const [theme, setTheme] = useState<ThemePreset>('whatsapp-mint');
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previewCardRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLoadSample = () => {
    setData({
      ...SAMPLE_DATA,
      title: 'Homework',
      date: new Date().toISOString().split('T')[0],
    });
    showToast('Loaded sample subjects & topics!');
  };

  const handleReset = () => {
    setData({
      title: 'Homework',
      date: new Date().toISOString().split('T')[0],
      announcement: '',
      subjects: DEFAULT_SUBJECTS.map(s => ({ ...s, content: '' })),
    });
    showToast('Cleared all inputs');
  };

  const handleDownloadImage = async () => {
    if (!previewCardRef.current) return;
    setIsDownloading(true);

    try {
      // 3x pixel ratio produces an ultra-crisp, high-definition PNG image (1620px wide)
      const dataUrl = await toPng(previewCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1.0,
      });

      const dateStr = data.date || new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.download = `homework-${dateStr}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('High-quality PNG image downloaded!');
    } catch (err) {
      console.error('Failed to export high quality PNG:', err);
      showToast('Could not export image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    if (!previewCardRef.current) return;
    setIsDownloading(true);

    try {
      const blob = await toBlob(previewCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1.0,
      });

      if (!blob) throw new Error('Blob generation failed');

      if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        showToast('Image copied to clipboard! Paste directly (Ctrl+V) in WhatsApp.');
      } else {
        await handleDownloadImage();
        showToast('Clipboard image write not supported in this browser. Downloaded PNG instead!');
      }
    } catch (err) {
      console.error('Clipboard write error:', err);
      showToast('Clipboard access denied. Downloading PNG instead.');
      await handleDownloadImage();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareImage = async () => {
    if (!previewCardRef.current) return;
    setIsDownloading(true);

    try {
      const blob = await toBlob(previewCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        quality: 1.0,
      });

      if (!blob) throw new Error('Blob generation failed');

      const dateStr = data.date || new Date().toISOString().split('T')[0];
      const file = new File([blob], `homework-${dateStr}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: data.title || 'Homework',
          text: `Homework update for ${dateStr}`,
        });
        showToast('Shared successfully!');
      } else {
        await handleDownloadImage();
        showToast('Direct file share not supported in this browser. Downloaded HQ PNG!');
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Share error:', err);
        showToast('Could not share image. Please use Download.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onLoadSample={handleLoadSample}
        onReset={handleReset}
        onDownload={handleDownloadImage}
        isDownloading={isDownloading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Intro Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Homework
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter topics for Physics, Chemistry, Biology, Math, and English. Export high-quality PNG image for group.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-none bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fill Example Data</span>
            </button>
          </div>
        </div>

        {/* Mobile Viewport Toggle (Edit vs Preview) */}
        <div className="lg:hidden flex p-1 bg-slate-200 dark:bg-slate-800 mb-6 rounded-none">
          <button
            type="button"
            onClick={() => setActiveMobileTab('edit')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-none transition-all ${
              activeMobileTab === 'edit'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Notes</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-none transition-all ${
              activeMobileTab === 'preview'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Preview Card</span>
          </button>
        </div>

        {/* Grid Layout: Left is Editor, Right is Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Editor Inputs */}
          <section
            className={`lg:col-span-6 space-y-6 ${
              activeMobileTab === 'edit' ? 'block' : 'hidden lg:block'
            }`}
          >
            <SubjectEditor data={data} onChange={setData} />
          </section>

          {/* Right Column: Live Card & Actions */}
          <section
            className={`lg:col-span-6 lg:sticky lg:top-24 space-y-5 ${
              activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            {/* Actions Bar (Download, Copy Image, Share HQ Image, Theme switcher) */}
            <CardActions
              data={data}
              theme={theme}
              onThemeChange={setTheme}
              onDownload={handleDownloadImage}
              onCopyImage={handleCopyImage}
              onShareImage={handleShareImage}
              isDownloading={isDownloading}
            />

            {/* Live Card Target (No rounded corners) */}
            <div className="relative">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  Live Preview Card (Export Target)
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">
                  3x Ultra-HD PNG
                </span>
              </div>

              <div className="p-2 sm:p-4 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex justify-center overflow-x-auto rounded-none">
                <SubjectCardPreview
                  ref={previewCardRef}
                  data={data}
                  theme={theme}
                />
              </div>

              {/* WhatsApp Quality Guidance Tip */}
              <div className="mt-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 rounded-none space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Is the PNG High Quality (HQ)?</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-700 dark:text-slate-200">Yes, it is rendered in 3x Ultra-HD (1620px width)</strong> with lossless PNG compression. 
                  When sending in WhatsApp:
                </p>
                <ul className="text-[11px] list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400 pl-1">
                  <li><strong>Standard Photo:</strong> Text remains crisp and sharp even with WhatsApp preview compression.</li>
                  <li><strong>HD Toggle:</strong> Tap the <em>&quot;HD&quot;</em> icon before sending in WhatsApp for high-definition clarity.</li>
                  <li><strong>Document Mode:</strong> Attach as a <em>&quot;Document&quot;</em> in WhatsApp for 100% original pixel-perfect quality with zero compression.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 shadow-lg border border-slate-700 rounded-none text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
