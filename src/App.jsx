import React, { useState } from 'react';
import { Kanban, Plus } from 'lucide-react';
import { loadTasksFromStorage } from './utils/storage';
import Board from './components/Board';

export default function App() {
  const [tasks] = useState(() => loadTasksFromStorage());
  const getColumnTasks = (colId) => tasks.filter(t => t.columnId === colId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/85 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Kanban className="w-6 h-6 text-indigo-400" />
          <h1 className="text-base font-bold text-white">Kanban Studio</h1>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <Board getColumnTasks={getColumnTasks} />
      </main>
    </div>
  );
}
