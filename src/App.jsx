import React, { useState } from 'react';
import { Kanban, Plus } from 'lucide-react';
import { useKanban } from './hooks/useKanban';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import ConfirmDialog from './components/ConfirmDialog';
import { ToastProvider, useToast } from './components/Toast';

function KanbanAppContent() {
  const {
    tasks,
    getColumnTasks,
    addTask,
    updateTask,
    deleteTask,
    dragState,
    ghostRef,
    onCardPointerDown,
  } = useKanban();

  const { showSuccess } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnId, setDefaultColumnId] = useState('todo');
  const [taskToDelete, setTaskToDelete] = useState(null);

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
      updateTask(editingTask.id, formData);
      showSuccess('Task Updated', `"${formData.title}" has been saved successfully.`);
    } else {
      addTask(formData);
      showSuccess('Task Created', `"${formData.title}" was added to the board.`);
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      showSuccess('Task Removed', `"${taskToDelete.title}" has been deleted.`);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Kanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">
                Kanban Studio
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">
                Drag cards across columns or reorder tasks freely
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span>Total Tasks:</span>
              <span className="font-semibold text-slate-200">{tasks.length}</span>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAddModal('todo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Board
          getColumnTasks={getColumnTasks}
          dragState={dragState}
          ghostRef={ghostRef}
          onCardPointerDown={onCardPointerDown}
          onAddTask={handleOpenAddModal}
          onEditTask={handleOpenEditModal}
          onDeleteTask={(task) => setTaskToDelete(task)}
        />
      </main>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialTask={editingTask}
        defaultColumnId={defaultColumnId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
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
