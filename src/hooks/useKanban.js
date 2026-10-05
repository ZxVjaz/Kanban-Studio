import { useState, useEffect, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  const handleCardPointerDown = useCallback((e, task) => {
    const cardEl = e.currentTarget;
    try {
      cardEl.setPointerCapture(e.pointerId);
    } catch (err) {
      console.warn('Pointer capture failed:', err);
    }
    setActiveSession({ pointerId: e.pointerId, task, x: e.clientX, y: e.clientY });
  }, []);

  return {
    tasks,
    getColumnTasks,
    activeSession,
    onCardPointerDown: handleCardPointerDown,
  };
}
