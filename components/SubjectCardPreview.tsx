'use client';

import React, { forwardRef } from 'react';
import {
  Calendar,
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  BookOpen,
  Bookmark,
  BellRing,
} from 'lucide-react';
import {
  DigestData,
  ThemePreset,
  FontStyle,
  getFontFamily,
  formatDisplayDate,
  cleanBulletLines,
} from '@/lib/formatter';

interface SubjectCardPreviewProps {
  data: DigestData;
  theme: ThemePreset;
  fontStyle?: FontStyle;
}

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  physics: <Atom className="w-3.5 h-3.5" />,
  chemistry: <FlaskConical className="w-3.5 h-3.5" />,
  biology: <Dna className="w-3.5 h-3.5" />,
  math: <Calculator className="w-3.5 h-3.5" />,
  english: <BookOpen className="w-3.5 h-3.5" />,
  custom: <Bookmark className="w-3.5 h-3.5" />,
};

export const SubjectCardPreview = forwardRef<HTMLDivElement, SubjectCardPreviewProps>(
  ({ data, theme, fontStyle = 'sans' }, ref) => {
    const formattedDate = formatDisplayDate(data.date);
    const activeSubjects = data.subjects.filter(s => s.enabled);
    const fontFamilyStyle = getFontFamily(fontStyle);
    const fontClass =
      fontStyle === 'serif'
        ? 'font-serif'
        : fontStyle === 'mono'
        ? 'font-mono'
        : 'font-sans';

    // Theme style mappings
    const isDark = theme === 'dark-slate';
    const isMint = theme === 'whatsapp-mint';
    const isBlue = theme === 'academic-blue';
    const isWarm = theme === 'warm-paper';

    // Theme background classes
    const cardBgClass = isMint
      ? 'bg-[#f4f7f6] text-slate-800'
      : isDark
      ? 'bg-[#0f172a] text-slate-100'
      : isBlue
      ? 'bg-[#f8fafc] text-slate-800'
      : isWarm
      ? 'bg-[#fefce8] text-amber-950'
      : 'bg-white text-slate-800';

    const headerBgClass = isMint
      ? 'bg-[#075e54] text-white'
      : isDark
      ? 'bg-[#1e293b] text-white'
      : isBlue
      ? 'bg-[#1e3a8a] text-white'
      : isWarm
      ? 'bg-[#78350f] text-amber-50'
      : 'bg-slate-900 text-white';

    const dateBannerClass = isMint
      ? 'bg-[#128c7e] text-white'
      : isDark
      ? 'bg-slate-800 text-slate-200 border border-slate-700'
      : isBlue
      ? 'bg-blue-800 text-white'
      : isWarm
      ? 'bg-amber-800 text-amber-100'
      : 'bg-slate-800 text-slate-100';

    return (
      <div
        ref={ref}
        id="whatsapp-preview-card"
        className={`w-full max-w-[540px] mx-auto rounded-none overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-700 transition-all ${fontClass} ${cardBgClass}`}
        style={{ fontFamily: fontFamilyStyle }}
      >
        {/* Compact Header Bar - No rounded corners */}
        <div className={`px-5 py-4 ${headerBgClass} rounded-none`}>
          {/* Compact Title Row (No 'whatsapp digest' text) */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base leading-none">📚</span>
            <h2 className="text-sm sm:text-base font-bold tracking-tight uppercase leading-snug">
              {data.title || 'HOMEWORK'}
            </h2>
          </div>

          {/* Date Banner - Compact & No rounded corners */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-semibold shadow-inner ${dateBannerClass}`}
          >
            <Calendar className="w-3.5 h-3.5 shrink-0 opacity-90" />
            <span className="tracking-wide">
              {formattedDate || 'Date Not Selected'}
            </span>
          </div>
        </div>

        {/* Notice / Announcement if provided - No rounded corners */}
        {data.announcement && data.announcement.trim().length > 0 && (
          <div className="px-5 pt-3.5 pb-0.5">
            <div
              className={`p-2.5 rounded-none border text-xs flex items-start gap-2 ${
                isDark
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : isWarm
                  ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <BellRing className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div>
                <span className="font-semibold block text-[10px] uppercase tracking-wider mb-0.5 text-amber-800 dark:text-amber-300">
                  Notice
                </span>
                <p className="leading-relaxed">{data.announcement.trim()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Subjects List - No rounded corners */}
        <div className="p-5 space-y-3">
          {activeSubjects.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
              No subjects enabled. Enable subjects to see preview.
            </div>
          ) : (
            activeSubjects.map(sub => {
              const bullets = cleanBulletLines(sub.content);
              const icon = SUBJECT_ICONS[sub.key] || <Bookmark className="w-3.5 h-3.5" />;

              return (
                <div
                  key={sub.id}
                  className={`rounded-none border transition-all ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700'
                      : isWarm
                      ? 'bg-white border-amber-200/80 shadow-sm'
                      : 'bg-white border-slate-200 shadow-sm'
                  } overflow-hidden`}
                >
                  {/* Subject Title Bar - Compact */}
                  <div
                    className="px-3.5 py-1.5 flex items-center justify-between border-b"
                    style={{
                      borderBottomColor: isDark ? '#334155' : '#f1f5f9',
                      backgroundColor: isDark
                        ? 'rgba(30, 41, 59, 0.7)'
                        : `${sub.color.accent}0d`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-none flex items-center justify-center text-white"
                        style={{ backgroundColor: sub.color.accent }}
                      >
                        {icon}
                      </div>
                      <span
                        className="font-bold text-xs sm:text-sm tracking-wide"
                        style={{
                          color: isDark ? '#f8fafc' : sub.color.accent,
                        }}
                      >
                        {sub.name}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {bullets.length === 0 ? 'No notes' : `${bullets.length} topic${bullets.length === 1 ? '' : 's'}`}
                    </span>
                  </div>

                  {/* Bullet points or empty placeholder */}
                  <div className="p-3">
                    {bullets.length === 0 ? (
                      <p className="text-xs italic text-slate-400 dark:text-slate-500">
                        No homework or topics added for {sub.name} today.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {bullets.map((bullet, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-snug"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-none mt-1.5 shrink-0"
                              style={{ backgroundColor: sub.color.accent }}
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer has been removed completely per request */}
      </div>
    );
  }
);

SubjectCardPreview.displayName = 'SubjectCardPreview';
