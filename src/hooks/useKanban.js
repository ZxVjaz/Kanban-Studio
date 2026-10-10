import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

const DRAG_THRESHOLD_PX = 5;

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragState, setDragState] = useState({ isDragging: false, taskId: null, taskData: null, targetColumnId: null, targetIndex: 0, width: 0, height: 0 });
  const ghostRef = useRef(null);

  const calculateDropTarget = useCallback((clientX, clientY, draggedTaskId) => {
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

    if (!matchedColumnEl || !matchedColumnId) return null;

    const cardNodes = matchedColumnEl.querySelectorAll('[data-task-id]');
    let insertionIndex = 0;
    let validCardIndex = 0;
    let foundPosition = false;

    for (let i = 0; i < cardNodes.length; i++) {
      const node = cardNodes[i];
      if (node.getAttribute('data-task-id') === draggedTaskId) continue;

      const cardRect = node.getBoundingClientRect();
      const cardMiddleY = cardRect.top + cardRect.height / 2;

      if (!foundPosition && clientY < cardMiddleY) {
        insertionIndex = validCardIndex;
        foundPosition = true;
      }
      validCardIndex++;
    }

    if (!foundPosition) insertionIndex = validCardIndex;

    return { columnId: matchedColumnId, index: insertionIndex };
  }, []);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return { tasks, dragState, ghostRef, getColumnTasks, onCardPointerDown: () => {} };
}
