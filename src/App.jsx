import React, { useState } from 'react';
import { Kanban, Plus } from 'lucide-react';
import { loadTasksFromStorage, saveTasksToStorage } from './utils/storage';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import ConfirmDialog from './components/ConfirmDialog';
import { ToastProvider, useToast } from './components/Toast';

function KanbanAppContent() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnId, setDefaultColumnId] = useState('todo');
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { showSuccess } = useToast();

  const getColumnTasks = (colId) => tasks.filter(t => t.columnId === colId);

  const handleOpenAddModal = (columnId = 'todo') => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setDefaultColumnId(task.columnId);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...formData } : t));
      showSuccess('Task Updated', `"${formData.title}" has been saved.`);
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        ...formData,
        order: tasks.filter(t => t.columnId === formData.columnId).length,
        createdAt: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      showSuccess('Task Created', `"${formData.title}" was added to the board.`);
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      showSuccess('Task Removed', `"${taskToDelete.title}" has been deleted.`);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800/80 bg-slate-950/85 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Kanban className="w-6 h-6 text-indigo-400" />
          <h1 className="text-base font-bold text-white">Kanban Studio</h1>
        </div>
        <button onClick={() => handleOpenAddModal('todo')} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600">
          <Plus className="w-4 h-4" /> New Task
        </button>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        <Board getColumnTasks={getColumnTasks} onAddTask={handleOpenAddModal} onEditTask={handleOpenEditModal} onDeleteTask={setTaskToDelete} />
      </main>
      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} initialTask={editingTask} defaultColumnId={defaultColumnId} />
      <ConfirmDialog isOpen={Boolean(taskToDelete)} taskTitle={taskToDelete?.title || ''} onConfirm={handleConfirmDelete} onCancel={() => setTaskToDelete(null)} />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <KanbanAppContent />
    </ToastProvider>
  );
}
