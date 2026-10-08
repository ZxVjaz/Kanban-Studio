import React from 'react';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { PRIORITIES } from '../types';

export default function TaskCard({ task, onEdit, onDelete, onPointerDown, isGhost = false }) {
  const priorityInfo = PRIORITIES[task.priority] || PRIORITIES.medium;
  return (
    <div
      data-task-id={isGhost ? undefined : task.id}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={!isGhost && onPointerDown ? (e) => onPointerDown(e, task) : undefined}
      style={{ touchAction: 'none' }}
      className={`group relative rounded-xl border bg-slate-900/95 p-4 select-none ${
        isGhost
          ? 'border-indigo-500 shadow-2xl shadow-indigo-950/90 ring-2 ring-indigo-500/40 rotate-2 scale-[1.02] cursor-grabbing'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 shadow-sm transition-colors cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-4 h-4 text-slate-600" />
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.badgeClass}`}>
            {priorityInfo.label}
          </span>
        </div>
        {!isGhost && (
          <div data-no-drag="true" className="flex items-center gap-1">
            <button type="button" onClick={() => onEdit?.(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={() => onDelete?.(task)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      <h4 className="font-semibold text-sm text-slate-100 mb-1.5">{task.title}</h4>
      {task.description && <p className="text-xs text-slate-400">{task.description}</p>}
    </div>
  );
}
