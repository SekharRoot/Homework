export interface SubjectItem {
  id: string;
  name: string;
  key: 'physics' | 'chemistry' | 'biology' | 'math' | 'english' | 'custom';
  content: string;
  enabled: boolean;
  color: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
    whatsappEmoji: string;
  };
}

export interface DigestData {
  title: string;
  date: string;
  announcement: string;
  footerNote?: string;
  subjects: SubjectItem[];
}

export type ThemePreset = 'whatsapp-mint' | 'clean-white' | 'dark-slate' | 'academic-blue' | 'warm-paper';

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  {
    id: 'physics',
    name: 'Physics',
    key: 'physics',
    content: '',
    enabled: true,
    color: {
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      border: 'border-sky-200 dark:border-sky-800/60',
      text: 'text-sky-900 dark:text-sky-200',
      badgeBg: 'bg-sky-100 dark:bg-sky-900/60',
      badgeText: 'text-sky-800 dark:text-sky-300',
      accent: '#0284c7',
      whatsappEmoji: '⚛️',
    },
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    key: 'chemistry',
    content: '',
    enabled: true,
    color: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800/60',
      text: 'text-purple-900 dark:text-purple-200',
      badgeBg: 'bg-purple-100 dark:bg-purple-900/60',
      badgeText: 'text-purple-800 dark:text-purple-300',
      accent: '#9333ea',
      whatsappEmoji: '🧪',
    },
  },
  {
    id: 'biology',
    name: 'Biology',
    key: 'biology',
    content: '',
    enabled: true,
    color: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-900 dark:text-emerald-200',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-900/60',
      badgeText: 'text-emerald-800 dark:text-emerald-300',
      accent: '#059669',
      whatsappEmoji: '🧬',
    },
  },
  {
    id: 'math',
    name: 'Math',
    key: 'math',
    content: '',
    enabled: true,
    color: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-900 dark:text-amber-200',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/60',
      badgeText: 'text-amber-800 dark:text-amber-300',
      accent: '#d97706',
      whatsappEmoji: '📐',
    },
  },
  {
    id: 'english',
    name: 'English',
    key: 'english',
    content: '',
    enabled: true,
    color: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      border: 'border-rose-200 dark:border-rose-800/60',
      text: 'text-rose-900 dark:text-rose-200',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/60',
      badgeText: 'text-rose-800 dark:text-rose-300',
      accent: '#e11d48',
      whatsappEmoji: '📖',
    },
  },
];

export const SAMPLE_DATA: DigestData = {
  title: 'Homework',
  date: new Date().toISOString().split('T')[0],
  announcement: 'Reminder: Unit assessment begins next Monday. Complete pending assignments.',
  footerNote: '',
  subjects: [
    {
      ...DEFAULT_SUBJECTS[0],
      content: 'Ch 4: Laws of Motion - Friction concepts\nSolve numerical problems 12 to 18 (Page 145)\nSubmit lab notebook tomorrow',
    },
    {
      ...DEFAULT_SUBJECTS[1],
      content: 'Periodic Table: Group 17 Halogen trends\nBalance redox equations 1-5 from worksheet\nBring periodic chart for next class',
    },
    {
      ...DEFAULT_SUBJECTS[2],
      content: 'Cell Division: Mitosis stages & diagram\nDraw neatly labeled Prophase and Metaphase diagrams in homework copy',
    },
    {
      ...DEFAULT_SUBJECTS[3],
      content: 'Quadratic Equations: Exercise 4.3 (Q3, Q5, Q7)\nMemorize quadratic formula and discriminant conditions',
    },
    {
      ...DEFAULT_SUBJECTS[4],
      content: 'Poem: The Road Not Taken - Stanza 3 analysis\nWrite short paragraph on symbolic meaning of choices (100 words)',
    },
  ],
};

export function cleanBulletLines(raw: string): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map(line => line.trim())
    .map(line => line.replace(/^[-*•–—]\s*/, ''))
    .filter(line => line.length > 0);
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function generateWhatsAppText(data: DigestData): string {
  const dateFormatted = formatDisplayDate(data.date);
  const lines: string[] = [];

  lines.push(`📚 *${data.title.toUpperCase() || 'HOMEWORK'}*`);
  if (dateFormatted) {
    lines.push(`📅 *Date:* ${dateFormatted}`);
  }
  lines.push('────────────────────────');

  if (data.announcement && data.announcement.trim()) {
    lines.push(`📢 *Notice:* ${data.announcement.trim()}`);
    lines.push('────────────────────────');
  }

  let activeSubjectsCount = 0;
  for (const sub of data.subjects) {
    if (!sub.enabled) continue;
    const items = cleanBulletLines(sub.content);
    if (items.length === 0) continue;

    activeSubjectsCount++;
    lines.push(`${sub.color.whatsappEmoji} *${sub.name.toUpperCase()}*`);
    for (const item of items) {
      lines.push(`   • ${item}`);
    }
    lines.push('');
  }

  if (activeSubjectsCount === 0) {
    lines.push('(No subject notes entered yet)');
    lines.push('');
  }

  return lines.join('\n').trim();
}

export function getThemeStyles(theme: ThemePreset) {
  switch (theme) {
    case 'whatsapp-mint':
      return {
        cardBg: 'bg-[#f0fdf4]',
        headerBg: 'bg-[#075e54]',
        headerText: 'text-white',
        border: 'border-[#25d366]/40',
        titleColor: 'text-white',
        dateBadge: 'bg-[#128c7e] text-white',
        noticeBg: 'bg-emerald-100/70 border-emerald-300 text-emerald-950',
        sectionDivider: 'border-emerald-200',
        subjectCardBg: 'bg-white',
      };
    case 'clean-white':
      return {
        cardBg: 'bg-white',
        headerBg: 'bg-slate-900',
        headerText: 'text-white',
        border: 'border-slate-200 shadow-xl',
        titleColor: 'text-white',
        dateBadge: 'bg-slate-800 text-slate-100',
        noticeBg: 'bg-amber-50 border-amber-200 text-amber-950',
        sectionDivider: 'border-slate-200',
        subjectCardBg: 'bg-slate-50/70',
      };
    case 'dark-slate':
      return {
        cardBg: 'bg-[#0f172a]',
        headerBg: 'bg-[#1e293b]',
        headerText: 'text-slate-100',
        border: 'border-slate-700/80 shadow-2xl',
        titleColor: 'text-white',
        dateBadge: 'bg-slate-700 text-slate-200',
        noticeBg: 'bg-amber-950/40 border-amber-800/50 text-amber-200',
        sectionDivider: 'border-slate-800',
        subjectCardBg: 'bg-slate-800/80',
      };
    case 'academic-blue':
      return {
        cardBg: 'bg-[#f8fafc]',
        headerBg: 'bg-[#1e3a8a]',
        headerText: 'text-white',
        border: 'border-blue-200 shadow-xl',
        titleColor: 'text-white',
        dateBadge: 'bg-[#1d4ed8] text-white',
        noticeBg: 'bg-blue-50 border-blue-200 text-blue-950',
        sectionDivider: 'border-blue-200',
        subjectCardBg: 'bg-white',
      };
    case 'warm-paper':
      return {
        cardBg: 'bg-[#fffbeb]',
        headerBg: 'bg-[#78350f]',
        headerText: 'text-amber-50',
        border: 'border-amber-200/80 shadow-xl',
        titleColor: 'text-amber-50',
        dateBadge: 'bg-[#92400e] text-amber-100',
        noticeBg: 'bg-amber-100/60 border-amber-300 text-amber-950',
        sectionDivider: 'border-amber-200',
        subjectCardBg: 'bg-white/90',
      };
  }
}
