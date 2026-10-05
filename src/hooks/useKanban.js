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
    // Discovered issue: on mobile touch devices, default pointer capture locks events to the element,
    // preventing window listeners from receiving continuous drag updates when finger moves fast.
    // Explicitly release pointer capture to allow smooth window listener tracking.
    if (cardEl.hasPointerCapture?.(e.pointerId)) {
      try {
        cardEl.releasePointerCapture(e.pointerId);
      } catch {}
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
