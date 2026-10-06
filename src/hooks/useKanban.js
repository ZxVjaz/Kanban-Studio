import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  // Performance bottleneck observed: calling setState(coords) at 120Hz/60Hz fires
  // full component tree reconciliation on every pointer move event, causing jittery lag.
  const [activeSession, setActiveSession] = useState(null);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return {
    tasks,
    getColumnTasks,
    activeSession,
    onCardPointerDown: () => {},
  };
}
