import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function Column({ column, tasks, dragState, onCardPointerDown, onAddTask, onEditTask, onDeleteTask }) {
  const isTargetColumn = dragState?.isDragging && dragState.targetColumnId === column.id;
  const visibleTasks = tasks.filter(t => !(dragState?.isDragging && t.id === dragState.taskId));

  const renderTasksWithPlaceholder = () => {
    const items = [];
    const placeholderElement = (
      <div key="insertion-placeholder" className="h-24 rounded-xl border-2 border-dashed border-indigo-500/70 bg-indigo-500/10 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-medium text-indigo-300/80">Drop card here</span>
      </div>
    );

    visibleTasks.forEach((task, idx) => {
      if (isTargetColumn && dragState.targetIndex === idx) items.push(placeholderElement);
      items.push(<TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} onPointerDown={onCardPointerDown} />);
    });

    if (isTargetColumn && dragState.targetIndex >= visibleTasks.length) {
      items.push(placeholderElement);
    }
    return items;
  };

  return (
    <div data-column-id={column.id} className="flex flex-col rounded-2xl bg-slate-900/60 border border-slate-800/90 min-h-[540px]">
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
        {renderTasksWithPlaceholder()}
      </div>
    </div>
  );
}
