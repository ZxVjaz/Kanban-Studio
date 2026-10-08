import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

const DRAG_THRESHOLD_PX = 5;

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragState, setDragState] = useState({ isDragging: false, taskId: null, taskData: null, width: 0, height: 0 });
  const ghostRef = useRef(null);

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
  });

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return { tasks, dragState, ghostRef, getColumnTasks, onCardPointerDown: () => {} };
}
