import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());

  // Mutable pointer session ref to prevent stale closures and avoid unnecessary re-renders
  const sessionRef = useRef({
    active: false,
    isDragging: false,
    pointerId: null,
    taskId: null,
    taskData: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    offsetX: 0,
    offsetY: 0,
  });

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return {
    tasks,
    getColumnTasks,
    sessionRef,
    onCardPointerDown: () => {},
  };
}
