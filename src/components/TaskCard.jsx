import React from 'react';
import { Calendar, Pencil, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { PRIORITIES } from '../types';
import { formatDisplayDate, isDateOverdue } from '../utils/date';

function TaskCard({
  task,
  onEdit,
  onDelete,
  onPointerDown,
  isGhost = false,
}) {
  const priorityInfo = PRIORITIES[task.priority] || PRIORITIES.medium;

  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || task.columnId === 'done') return false;
    return isDateOverdue(task.dueDate);
  }, [task.dueDate, task.columnId]);

  const formattedDate = React.useMemo(() => {
    return formatDisplayDate(task.dueDate);
  }, [task.dueDate]);

  return (
    <div
      data-task-id={isGhost ? undefined : task.id}
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      onPointerDown={
        !isGhost && onPointerDown ? (e) => onPointerDown(e, task) : undefined
      }
      style={{ touchAction: 'none' }}
      className={`group relative rounded-xl border bg-slate-900/95 p-4 select-none ${
        isGhost
          ? 'border-indigo-500 shadow-2xl shadow-indigo-950/90 ring-2 ring-indigo-500/40 rotate-2 scale-[1.02] cursor-grabbing'
          : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 shadow-sm transition-colors cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Header: Priority Badge & Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors -ml-1" />
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityInfo.badgeClass}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dotClass}`}
            />
            {priorityInfo.label}
          </span>
        </div>

        {!isGhost && (
          <div
            data-no-drag="true"
            className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            <button
              type="button"
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              title="Delete Task"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4
        className={`font-semibold text-sm text-slate-100 mb-1.5 leading-snug break-words ${
          task.columnId === 'done' ? 'line-through text-slate-400' : ''
        }`}
      >
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-3 break-words">
          {task.description}
        </p>
      )}

      {/* Footer: Due Date Display */}
      {formattedDate && (
        <div className="flex items-center justify-between pt-2.5 mt-1 border-t border-slate-800/80">
          <div
            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
              isOverdue ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {isOverdue ? (
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            )}
            <span>{formattedDate}</span>
            {isOverdue && (
              <span className="px-1.5 py-0.5 bg-rose-500/15 border border-rose-500/30 rounded text-[10px] text-rose-300">
                Overdue
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(TaskCard);
