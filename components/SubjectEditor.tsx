'use client';

import React, { memo, useCallback } from 'react';
import {
  Calendar,
  Atom,
  FlaskConical,
  Dna,
  Calculator,
  BookOpen,
  Trash2,
  ListPlus,
  Bookmark,
} from 'lucide-react';
import { SubjectItem, DigestData } from '@/lib/formatter';

interface SubjectEditorProps {
  data: DigestData;
  onChange: (updated: DigestData) => void;
}

const SUBJECT_ICONS: Record<string, React.ReactNode> = {
  physics: <Atom className="w-4 h-4" />,
  chemistry: <FlaskConical className="w-4 h-4" />,
  biology: <Dna className="w-4 h-4" />,
  math: <Calculator className="w-4 h-4" />,
  english: <BookOpen className="w-4 h-4" />,
  custom: <Bookmark className="w-4 h-4" />,
};

interface SubjectItemCardProps {
  subject: SubjectItem;
  onContentChange: (id: string, text: string) => void;
  onToggle: (id: string) => void;
  onAddBullet: (id: string) => void;
  onClear: (id: string) => void;
}

const SubjectItemCard = memo(function SubjectItemCard({
  subject,
  onContentChange,
  onToggle,
  onAddBullet,
  onClear,
}: SubjectItemCardProps) {
  const icon = SUBJECT_ICONS[subject.key] || <Bookmark className="w-4 h-4" />;
  const lineCount = subject.content
    ? subject.content.split('\n').filter(l => l.trim().length > 0).length
    : 0;

  return (
    <div
      className={`border rounded-none transition-all ${
        subject.enabled
          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-60'
      }`}
    >
      {/* Header */}
      <div className="p-3 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-none flex items-center justify-center text-white"
            style={{ backgroundColor: subject.color.accent }}
          >
            {icon}
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {subject.name}
            </span>
            <span className="ml-2 text-[11px] text-slate-400 font-mono">
              {lineCount} {lineCount === 1 ? 'line' : 'lines'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAddBullet(subject.id)}
            className="p-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none transition-colors"
            title="Insert bullet point"
          >
            <ListPlus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onClear(subject.id)}
            className="p-1.5 text-xs text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-none transition-colors"
            title="Clear text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <label className="flex items-center gap-1.5 ml-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              checked={subject.enabled}
              onChange={() => onToggle(subject.id)}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded-none focus:ring-emerald-500 cursor-pointer"
            />
            <span className="hidden sm:inline">Include</span>
          </label>
        </div>
      </div>

      {/* Textarea */}
      {subject.enabled && (
        <div className="p-3">
          <textarea
            rows={3}
            value={subject.content}
            onChange={e => onContentChange(subject.id, e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                const target = e.currentTarget;
                const pos = target.selectionStart;
                const beforePos = subject.content.substring(0, pos);
                const lastLine = beforePos.split('\n').pop() || '';
                if (lastLine.trim().startsWith('•') || lastLine.trim().startsWith('-')) {
                  e.preventDefault();
                  const bulletPrefix = '\n• ';
                  const afterPos = subject.content.substring(target.selectionEnd);
                  const newText = beforePos + bulletPrefix + afterPos;
                  onContentChange(subject.id, newText);
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = pos + bulletPrefix.length;
                  }, 0);
                }
              }
            }}
            placeholder={`Enter ${subject.name} homework, assignments, or chapter topics...`}
            className="w-full text-sm leading-relaxed px-3 py-2 border rounded-none border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
          />
        </div>
      )}
    </div>
  );
});

export function SubjectEditor({ data, onChange }: SubjectEditorProps) {
  const handleTitleChange = useCallback(
    (val: string) => {
      onChange({ ...data, title: val });
    },
    [data, onChange]
  );

  const handleDateChange = useCallback(
    (val: string) => {
      onChange({ ...data, date: val });
    },
    [data, onChange]
  );

  const handleSetQuickDate = useCallback(
    (offsetDays: number) => {
      const d = new Date();
      d.setDate(d.getDate() + offsetDays);
      const dateStr = d.toISOString().split('T')[0];
      onChange({ ...data, date: dateStr });
    },
    [data, onChange]
  );

  const handleAnnouncementChange = useCallback(
    (val: string) => {
      onChange({ ...data, announcement: val });
    },
    [data, onChange]
  );

  const handleSubjectContentChange = useCallback(
    (id: string, text: string) => {
      const updatedSubjects = data.subjects.map(s => {
        if (s.id === id) {
          return { ...s, content: text };
        }
        return s;
      });
      onChange({ ...data, subjects: updatedSubjects });
    },
    [data, onChange]
  );

  const handleToggleSubject = useCallback(
    (id: string) => {
      const updatedSubjects = data.subjects.map(s => {
        if (s.id === id) {
          return { ...s, enabled: !s.enabled };
        }
        return s;
      });
      onChange({ ...data, subjects: updatedSubjects });
    },
    [data, onChange]
  );

  const handleAddBullet = useCallback(
    (id: string) => {
      const updatedSubjects = data.subjects.map(s => {
        if (s.id === id) {
          const trimmed = s.content.trim();
          const prefix = trimmed.length > 0 ? '\n• ' : '• ';
          return { ...s, content: s.content + prefix };
        }
        return s;
      });
      onChange({ ...data, subjects: updatedSubjects });
    },
    [data, onChange]
  );

  const handleClearSubject = useCallback(
    (id: string) => {
      const updatedSubjects = data.subjects.map(s => {
        if (s.id === id) {
          return { ...s, content: '' };
        }
        return s;
      });
      onChange({ ...data, subjects: updatedSubjects });
    },
    [data, onChange]
  );

  return (
    <div className="space-y-6">
      {/* Title & Date Section */}
      <div className="bg-white dark:bg-slate-900 p-5 border rounded-none border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Card Title & Date</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="group-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title
            </label>
            <input
              id="group-title"
              type="text"
              value={data.title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="e.g. Homework"
              className="w-full px-3.5 py-2 text-sm border rounded-none border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="group-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Date
            </label>
            <div className="flex items-center gap-2">
              <input
                id="group-date"
                type="date"
                value={data.date}
                onChange={e => handleDateChange(e.target.value)}
                className="flex-1 px-3.5 py-2 text-sm border rounded-none border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleSetQuickDate(0)}
                className="px-2.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shrink-0 rounded-none border border-slate-200 dark:border-slate-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleSetQuickDate(1)}
                className="px-2.5 py-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shrink-0 rounded-none border border-slate-200 dark:border-slate-700"
              >
                Tomorrow
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="announcement" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Special Notice <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <input
            id="announcement"
            type="text"
            value={data.announcement}
            onChange={e => handleAnnouncementChange(e.target.value)}
            placeholder="e.g. Unit test starts Monday. Complete pending assignments."
            className="w-full px-3.5 py-2 text-sm border rounded-none border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 5 Subject Input Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Subject Inputs
          </h3>
          <span className="text-xs text-slate-500">
            Press Enter on bullets to auto-continue
          </span>
        </div>

        {data.subjects.map(subject => (
          <SubjectItemCard
            key={subject.id}
            subject={subject}
            onContentChange={handleSubjectContentChange}
            onToggle={handleToggleSubject}
            onAddBullet={handleAddBullet}
            onClear={handleClearSubject}
          />
        ))}
      </div>
    </div>
  );
}
