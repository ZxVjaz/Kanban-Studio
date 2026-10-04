import { useState, useEffect, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragCoords, setDragCoords] = useState(null);

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  const handleCardPointerDown = useCallback((e, task) => {
    setDragCoords({ x: e.clientX, y: e.clientY, task });
  }, []);

  useEffect(() => {
    if (!dragCoords) return;
    const onMove = (e) => {
      setDragCoords(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    };
    const onUp = () => setDragCoords(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragCoords]);

  return {
    tasks,
    getColumnTasks,
    dragCoords,
    onCardPointerDown: handleCardPointerDown,
  };
}
