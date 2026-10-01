export const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    accentColor: 'border-sky-500',
    dotColor: 'bg-sky-500',
    badgeBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  },
  {
    id: 'doing',
    title: 'Doing',
    accentColor: 'border-amber-500',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  {
    id: 'done',
    title: 'Done',
    accentColor: 'border-emerald-500',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
];

export const PRIORITIES = {
  low: {
    id: 'low',
    label: 'Low',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
    dotClass: 'bg-slate-400',
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  high: {
    id: 'high',
    label: 'High',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-400',
  },
};
