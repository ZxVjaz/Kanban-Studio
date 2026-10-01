import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function Column({ column, tasks, onAddTask, onEditTask, onDeleteTask }) {
  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/90 min-h-[540px]">
      <div className={`flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 border-t-2 rounded-t-2xl ${column.accentColor}`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
          <h3 className="font-semibold text-sm text-slate-100">{column.title}</h3>
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${column.badgeBg}`}>{tasks.length}</span>
        </div>
        <button type="button" onClick={() => onAddTask?.(column.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="flex-1 p-3 space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>
    </div>
  );
}
