const STORAGE_KEY = 'kanban_pointer_tasks_v1';

const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Architect Pointer Events Drag & Drop Engine',
    description: 'Implement pointer capture, 5px gesture threshold, and dynamic card mid-point calculation for seamless insertion.',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    columnId: 'done',
    order: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Synchronize Board State with LocalStorage',
    description: 'Ensure all card position and column updates persist reliably across browser sessions.',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    columnId: 'doing',
    order: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Visual Insertion Indicator & Drop Placeholder',
    description: 'Render responsive dashed drop indicator at target position during card movement.',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
    columnId: 'doing',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Design Task Creation & Edit Modal',
    description: 'Provide intuitive input forms with priority selection, column assignment, and due date picking.',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    columnId: 'todo',
    order: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Cross-device Touch & Mouse Testing',
    description: 'Verify smooth pointer interactions across desktop mouse and mobile touch viewports.',
    priority: 'low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    columnId: 'todo',
    order: 1,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Validates and sanitizes a task object to ensure required schema fields exist.
 * @param {unknown} task 
 * @returns {boolean}
 */
function isValidTask(task) {
  if (!task || typeof task !== 'object') return false;
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.columnId === 'string' &&
    typeof task.order === 'number'
  );
}

/**
 * Loads and sanitizes tasks from browser localStorage.
 * Always falls back to INITIAL_TASKS if data is corrupt or missing.
 * @returns {Array<object>}
 */
export function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Storage data is not an array, falling back to initial tasks.');
      return INITIAL_TASKS;
    }

    const sanitized = parsed.filter(isValidTask);
    return sanitized.length > 0 ? sanitized : INITIAL_TASKS;
  } catch (error) {
    console.error('Failed to parse tasks from localStorage:', error);
    return INITIAL_TASKS;
  }
}

/**
 * Persists tasks array to browser localStorage with error handling for quota limits.
 * @param {Array<object>} tasks 
 * @returns {boolean} Returns true if successfully saved, false otherwise.
 */
export function saveTasksToStorage(tasks) {
  if (!Array.isArray(tasks)) {
    console.warn('Attempted to save non-array tasks to localStorage.');
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    if (
      error.name === 'QuotaExceededError' ||
      error.code === 22 ||
      error.code === 1014
    ) {
      console.error('LocalStorage quota exceeded. Unable to persist task updates:', error);
    } else {
      console.error('Failed to save tasks to localStorage:', error);
    }
    return false;
  }
}
