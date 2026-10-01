import React from 'react';
import { COLUMNS } from '../types';
import Column from './Column';

export default function Board({ getColumnTasks, onAddTask, onEditTask, onDeleteTask }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map(column => (
        <Column
          key={column.id}
          column={column}
          tasks={getColumnTasks(column.id)}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}
