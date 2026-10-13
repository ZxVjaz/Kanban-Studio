import React from 'react';
import { COLUMNS } from '../types';
import Column from './Column';
import TaskCard from './TaskCard';

export default function Board({
  getColumnTasks,
  dragState,
  ghostRef,
  onCardPointerDown,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) {
  return (
    <div className="relative">
      {/* 3-Column Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={getColumnTasks(column.id)}
            dragState={dragState}
            onCardPointerDown={onCardPointerDown}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      {/* Hardware-Accelerated Floating Ghost Card (Direct DOM Transform via ghostRef) */}
      {dragState.isDragging && dragState.taskData && (
        <div
          ref={ghostRef}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: `${dragState.width}px`,
            willChange: 'transform',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <TaskCard task={dragState.taskData} isGhost={true} />
        </div>
      )}
    </div>
  );
}
