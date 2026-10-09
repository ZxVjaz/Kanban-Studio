import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

const DRAG_THRESHOLD_PX = 5;

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragState, setDragState] = useState({ isDragging: false, taskId: null, taskData: null, targetColumnId: null, width: 0, height: 0 });
  const ghostRef = useRef(null);

  const calculateDropTarget = useCallback((clientX, clientY) => {
    const columnNodes = document.querySelectorAll('[data-column-id]');
    for (let i = 0; i < columnNodes.length; i++) {
      const colEl = columnNodes[i];
      const rect = colEl.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        return { columnId: colEl.getAttribute('data-column-id'), index: 0 };
      }
    }
    return null;
  }, []);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return { tasks, dragState, ghostRef, getColumnTasks, onCardPointerDown: () => {} };
}
