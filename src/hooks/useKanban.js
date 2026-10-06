import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());

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
    const onMove = (e) => {
      const s = sessionRef.current;
      if (!s.active || e.pointerId !== s.pointerId) return;
      s.currentX = e.clientX;
      s.currentY = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: false });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

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
