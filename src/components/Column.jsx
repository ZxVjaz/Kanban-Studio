import React from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

export default function Column({
  column,
  tasks,
  dragState,
  onCardPointerDown,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) {
  const isTargetColumn =
    dragState.isDragging && dragState.targetColumnId === column.id;

  // Exclude dragged card from normal column flow
  const visibleTasks = tasks.filter(
    (t) => !(dragState.isDragging && t.id === dragState.taskId)
  );

  const renderTasksWithPlaceholder = () => {
    const items = [];
    const placeholderHeight = dragState.height
      ? `${dragState.height}px`
      : '108px';

    const placeholderElement = (
      <div
        key="insertion-placeholder"
        style={{ height: placeholderHeight }}
        className="rounded-xl border-2 border-dashed border-indigo-500/70 bg-indigo-500/10 flex items-center justify-center pointer-events-none"
      >
        <span className="text-xs font-medium text-indigo-300/80 tracking-wide">
          Drop card here
        </span>
      </div>
    );

    visibleTasks.forEach((task, idx) => {
      if (isTargetColumn && dragState.targetIndex === idx) {
        items.push(placeholderElement);
      }

      items.push(
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onPointerDown={onCardPointerDown}
        />
      );
    });

    if (isTargetColumn && dragState.targetIndex >= visibleTasks.length) {
      items.push(placeholderElement);
    }

    return items;
  };

  return (
    <div
      data-column-id={column.id}
      className={`flex flex-col rounded-2xl bg-slate-900/60 border transition-colors min-h-[540px] max-h-[calc(100vh-11rem)] ${
        isTargetColumn
          ? 'border-indigo-500/60 bg-slate-900/90 ring-1 ring-indigo-500/30'
          : 'border-slate-800/90'
      }`}
    >
      {/* Column Header */}
      <div
        className={`flex items-center justify-between px-4 py-3.5 border-b border-slate-800/80 border-t-2 rounded-t-2xl ${column.accentColor}`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
          <h3 className="font-semibold text-sm text-slate-100 tracking-wide">
            {column.title}
          </h3>
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${column.badgeBg}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onAddTask(column.id)}
          title={`Add task to ${column.title}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {visibleTasks.length === 0 && !isTargetColumn ? (
          <div className="h-44 rounded-xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs text-slate-500 mb-2">
              No tasks in {column.title}
            </p>
            <button
              type="button"
              onClick={() => onAddTask(column.id)}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              + Create a new task
            </button>
          </div>
        ) : (
          renderTasksWithPlaceholder()
        )}
      </div>
    </div>
  );
}
