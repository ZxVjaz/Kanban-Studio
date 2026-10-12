import { useState, useEffect, useRef, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/storage';

const DRAG_THRESHOLD_PX = 5;
const HIT_TEST_DISTANCE_PX = 6; // Hit-test threshold: only test if pointer moved >= 6px

const INITIAL_DRAG_STATE = {
  isDragging: false,
  taskId: null,
  taskData: null,
  sourceColumnId: null,
  targetColumnId: null,
  targetIndex: null,
  width: 0,
  height: 0,
};

export function useKanban() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [dragState, setDragState] = useState(INITIAL_DRAG_STATE);

  // Ghost card DOM ref for direct CSS transform manipulation without triggering re-renders
  const ghostRef = useRef(null);

  // Mutable pointer session ref to prevent stale closures and avoid unnecessary re-renders
  const sessionRef = useRef({
    active: false,
    isDragging: false,
    pointerId: null,
    taskId: null,
    taskData: null,
    sourceColumnId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    lastHitTestX: 0,
    lastHitTestY: 0,
    offsetX: 0,
    offsetY: 0,
    width: 0,
    height: 0,
    targetColumnId: null,
    targetIndex: null,
    rafId: null,
  });

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  const getColumnTasks = useCallback(
    (columnId) => {
      return tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.order - b.order);
    },
    [tasks]
  );

  // CRUD Operations

  const addTask = useCallback((taskInput) => {
    setTasks((prev) => {
      const colTasks = prev.filter((t) => t.columnId === taskInput.columnId);
      const newTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: taskInput.title.trim(),
        description: taskInput.description ? taskInput.description.trim() : '',
        priority: taskInput.priority || 'medium',
        dueDate: taskInput.dueDate || '',
        columnId: taskInput.columnId || 'todo',
        order: colTasks.length,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newTask];
    });
  }, []);

  const updateTask = useCallback((taskId, updatedFields) => {
    setTasks((prev) => {
      const existing = prev.find((t) => t.id === taskId);
      if (!existing) return prev;

      const isChangingColumn =
        updatedFields.columnId && updatedFields.columnId !== existing.columnId;

      let nextTasks = prev.map((t) =>
        t.id === taskId ? { ...t, ...updatedFields } : t
      );

      if (isChangingColumn) {
        const oldColTasks = nextTasks
          .filter((t) => t.columnId === existing.columnId)
          .sort((a, b) => a.order - b.order);
        const newColTasks = nextTasks
          .filter(
            (t) => t.columnId === updatedFields.columnId && t.id !== taskId
          )
          .sort((a, b) => a.order - b.order);

        const movedTask = nextTasks.find((t) => t.id === taskId);
        newColTasks.push(movedTask);

        const orderLookup = new Map();
        oldColTasks.forEach((t, idx) => orderLookup.set(t.id, idx));
        newColTasks.forEach((t, idx) => orderLookup.set(t.id, idx));

        nextTasks = nextTasks.map((t) =>
          orderLookup.has(t.id) ? { ...t, order: orderLookup.get(t.id) } : t
        );
      }

      return nextTasks;
    });
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (!target) return prev;

      const remaining = prev.filter((t) => t.id !== taskId);
      const colTasks = remaining
        .filter((t) => t.columnId === target.columnId)
        .sort((a, b) => a.order - b.order);

      const orderMap = new Map();
      colTasks.forEach((t, idx) => orderMap.set(t.id, idx));

      return remaining.map((t) =>
        orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id) } : t
      );
    });
  }, []);

  const moveTask = useCallback((taskId, destColumnId, destIndex) => {
    setTasks((prev) => {
      const draggedTask = prev.find((t) => t.id === taskId);
      if (!draggedTask) return prev;

      const sourceColumnId = draggedTask.columnId;

      if (sourceColumnId === destColumnId) {
        const colTasks = prev
          .filter((t) => t.columnId === sourceColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        const clampedIndex = Math.max(0, Math.min(destIndex, colTasks.length));
        colTasks.splice(clampedIndex, 0, draggedTask);

        const updatedOrderMap = new Map();
        colTasks.forEach((t, idx) => updatedOrderMap.set(t.id, idx));

        return prev.map((t) =>
          t.columnId === sourceColumnId
            ? { ...t, order: updatedOrderMap.get(t.id) }
            : t
        );
      } else {
        const sourceTasks = prev
          .filter((t) => t.columnId === sourceColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        const destTasks = prev
          .filter((t) => t.columnId === destColumnId && t.id !== taskId)
          .sort((a, b) => a.order - b.order);

        const clampedIndex = Math.max(0, Math.min(destIndex, destTasks.length));
        const movedTask = { ...draggedTask, columnId: destColumnId };
        destTasks.splice(clampedIndex, 0, movedTask);

        const updates = new Map();
        sourceTasks.forEach((t, idx) =>
          updates.set(t.id, { columnId: sourceColumnId, order: idx })
        );
        destTasks.forEach((t, idx) =>
          updates.set(t.id, { columnId: destColumnId, order: idx })
        );

        return prev.map((t) =>
          updates.has(t.id) ? { ...t, ...updates.get(t.id) } : t
        );
      }
    });
  }, []);

  // Direct-DOM Drag Engine
  const updateGhostDomPosition = useCallback(() => {
    const s = sessionRef.current;
    if (ghostRef.current && s.isDragging) {
      const x = s.currentX - s.offsetX;
      const y = s.currentY - s.offsetY;
      ghostRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const calculateDropTarget = useCallback((clientX, clientY, draggedTaskId) => {
    const columnNodes = document.querySelectorAll('[data-column-id]');
    let matchedColumnEl = null;
    let matchedColumnId = null;

    for (let i = 0; i < columnNodes.length; i++) {
      const colEl = columnNodes[i];
      const rect = colEl.getBoundingClientRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
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
          const dist =
            clientX < rect.left
              ? rect.left - clientX
              : clientX > rect.right
              ? clientX - rect.right
              : 0;
          if (dist < minHorizontalDist && dist < 90) {
            minHorizontalDist = dist;
            matchedColumnEl = colEl;
            matchedColumnId = colEl.getAttribute('data-column-id');
          }
        }
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

    if (!foundPosition) {
      insertionIndex = validCardIndex;
    }

    return {
      columnId: matchedColumnId,
      index: insertionIndex,
    };
  }, []);

  // Synchronize initial ghost card position when it mounts in the DOM
  useEffect(() => {
    if (dragState.isDragging) {
      updateGhostDomPosition();
    }
  }, [dragState.isDragging, updateGhostDomPosition]);

  // Global window pointer listeners
  useEffect(() => {
    const onWindowPointerMove = (e) => {
      const s = sessionRef.current;
      if (!s.active || e.pointerId !== s.pointerId) return;

      s.currentX = e.clientX;
      s.currentY = e.clientY;

      // Check threshold before entering drag mode
      if (!s.isDragging) {
        const dist = Math.hypot(s.currentX - s.startX, s.currentY - s.startY);
        if (dist < DRAG_THRESHOLD_PX) return;

        s.isDragging = true;
        s.lastHitTestX = s.currentX;
        s.lastHitTestY = s.currentY;
        document.body.classList.add('dragging-active');

        setDragState({
          isDragging: true,
          taskId: s.taskId,
          taskData: s.taskData,
          sourceColumnId: s.sourceColumnId,
          targetColumnId: s.targetColumnId,
          targetIndex: s.targetIndex,
          width: s.width,
          height: s.height,
        });
      }

      if (e.cancelable) e.preventDefault();

      // Schedule visual update and hit-testing in requestAnimationFrame
      if (s.rafId === null) {
        s.rafId = requestAnimationFrame(() => {
          s.rafId = null;
          if (!s.active || !s.isDragging) return;

          // Update ghost card position directly on DOM (60fps without React re-render)
          updateGhostDomPosition();

          // Hit-test only when pointer moved >= HIT_TEST_DISTANCE_PX
          const moveDist = Math.hypot(
            s.currentX - s.lastHitTestX,
            s.currentY - s.lastHitTestY
          );

          if (moveDist >= HIT_TEST_DISTANCE_PX) {
            s.lastHitTestX = s.currentX;
            s.lastHitTestY = s.currentY;

            const dropTarget = calculateDropTarget(
              s.currentX,
              s.currentY,
              s.taskId
            );

            if (
              dropTarget &&
              (dropTarget.columnId !== s.targetColumnId ||
                dropTarget.index !== s.targetIndex)
            ) {
              s.targetColumnId = dropTarget.columnId;
              s.targetIndex = dropTarget.index;

              setDragState((prev) => ({
                ...prev,
                targetColumnId: dropTarget.columnId,
                targetIndex: dropTarget.index,
              }));
            }
          }
        });
      }
    };

    const endPointerSession = (e, shouldCommit) => {
      const s = sessionRef.current;
      if (!s.active || e.pointerId !== s.pointerId) return;

      if (s.rafId !== null) {
        cancelAnimationFrame(s.rafId);
        s.rafId = null;
      }

      const wasDragging = s.isDragging;
      const taskId = s.taskId;
      const finalColumnId = s.targetColumnId;
      const finalIndex = s.targetIndex;

      s.active = false;
      s.isDragging = false;
      document.body.classList.remove('dragging-active');

      if (wasDragging) {
        if (shouldCommit && finalColumnId !== null && finalIndex !== null) {
          moveTask(taskId, finalColumnId, finalIndex);
        }
        setDragState(INITIAL_DRAG_STATE);
      }
    };

    const onWindowPointerUp = (e) => endPointerSession(e, true);
    const onWindowPointerCancel = (e) => endPointerSession(e, false);

    window.addEventListener('pointermove', onWindowPointerMove, {
      passive: false,
    });
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerCancel);

    return () => {
      window.removeEventListener('pointermove', onWindowPointerMove);
      window.removeEventListener('pointerup', onWindowPointerUp);
      window.removeEventListener('pointercancel', onWindowPointerCancel);
    };
  }, [calculateDropTarget, moveTask, updateGhostDomPosition]);

  // Pointer down handler on task card
  const handleCardPointerDown = useCallback(
    (e, task) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      if (e.target.closest('[data-no-drag="true"]')) return;

      const cardEl = e.currentTarget;
      const rect = cardEl.getBoundingClientRect();

      // Release default pointer capture on touch devices so window listeners can track smoothly
      if (cardEl.hasPointerCapture?.(e.pointerId)) {
        try {
          cardEl.releasePointerCapture(e.pointerId);
        } catch {
          // No-op
        }
      }

      const colTasks = tasks
        .filter((t) => t.columnId === task.columnId)
        .sort((a, b) => a.order - b.order);
      const initialIndex = colTasks.findIndex((t) => t.id === task.id);

      sessionRef.current = {
        active: true,
        isDragging: false,
        pointerId: e.pointerId,
        taskId: task.id,
        taskData: task,
        sourceColumnId: task.columnId,
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
        lastHitTestX: e.clientX,
        lastHitTestY: e.clientY,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top,
        width: rect.width,
        height: rect.height,
        targetColumnId: task.columnId,
        targetIndex: initialIndex !== -1 ? initialIndex : 0,
        rafId: null,
      };
    },
    [tasks]
  );

  return {
    tasks,
    getColumnTasks,
    addTask,
    updateTask,
    deleteTask,
    dragState,
    ghostRef,
    onCardPointerDown: handleCardPointerDown,
  };
}
