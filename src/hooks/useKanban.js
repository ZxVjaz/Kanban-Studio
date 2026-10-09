import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

const DRAG_THRESHOLD_PX = 5;

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragState, setDragState] = useState({ isDragging: false, taskId: null, taskData: null, targetColumnId: null, width: 0, height: 0 });
  const ghostRef = useRef(null);

  const calculateDropTarget = useCallback((clientX, clientY) => {
    const columnNodes = document.querySelectorAll('[data-column-id]');
    let matchedColumnEl = null;
    let matchedColumnId = null;

    for (let i = 0; i < columnNodes.length; i++) {
      const colEl = columnNodes[i];
      const rect = colEl.getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
        matchedColumnEl = colEl;
        matchedColumnId = colEl.getAttribute('data-column-id');
        break;
      }
    }

    if (!matchedColumnEl) {
      let minHorizontalDist = Infinity;
      for (let i = 0; i < columnNodes.length; i++) {
        const colEl = columnNodes[i];
        const rect = colEl.getBoundingClientRect();
        if (clientY >= rect.top - 60 && clientY <= rect.bottom + 60) {
          const dist = clientX < rect.left ? rect.left - clientX : clientX > rect.right ? clientX - rect.right : 0;
          if (dist < minHorizontalDist && dist < 90) {
            minHorizontalDist = dist;
            matchedColumnEl = colEl;
            matchedColumnId = colEl.getAttribute('data-column-id');
          }
        }
      }
    }

    if (!matchedColumnEl || !matchedColumnId) return null;
    return { columnId: matchedColumnId, index: 0 };
  }, []);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return { tasks, dragState, ghostRef, getColumnTasks, onCardPointerDown: () => {} };
}
