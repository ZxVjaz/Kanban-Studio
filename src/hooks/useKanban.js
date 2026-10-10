import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

const DRAG_THRESHOLD_PX = 5;
const HIT_TEST_DISTANCE_PX = 6; // Hit-test threshold: only test if pointer moved >= 6px

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragState, setDragState] = useState({ isDragging: false, taskId: null, taskData: null, targetColumnId: null, targetIndex: 0, width: 0, height: 0 });
  const ghostRef = useRef(null);

  const getColumnTasks = useCallback((columnId) => {
    return tasks.filter(t => t.columnId === columnId).sort((a, b) => a.order - b.order);
  }, [tasks]);

  return { tasks, dragState, ghostRef, getColumnTasks, onCardPointerDown: () => {} };
}
