# PROJECT OVERVIEW: Kanban Board

## 1. Project Summary
- **Application Name**: Kanban Board (`kanban-pointer-app`)
- **Description**: A modern, responsive, client-side Kanban board designed as a personal task manager. It allows users to organize tasks across custom or standard workflow columns using visual board interactions.
- **Primary Goal**: Provide a lightweight, frictionless, and offline-first personal productivity tool that runs entirely in the browser with local persistence.
- **Target User & Role**:
  - Single User / Personal (No login, no external authentication required).

---

## 2. Tech Stack & Architecture
- **Application Architecture**: Single Page Application (SPA), Client-side only / Offline-first.
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React / SVG
- **Persistence Layer**: Browser `localStorage` (JSON-serialized state)
- **Language**: JavaScript (ES Modules), English UI and codebase
- **Directory Structure**:
```text
Kanban-Board/
├── .agent/
│   ├── rules/
│   └── PROJECT_OVERVIEW.md
├── docs/
├── src/
│   ├── components/       # Reusable UI & Kanban components
│   ├── hooks/            # Custom React hooks (storage, board state)
│   ├── utils/            # Helper utilities and formatters
│   ├── App.jsx           # Root application component
│   ├── index.css         # Tailwind base styles and directives
│   ├── main.jsx          # React DOM root entry point
│   └── types.js          # JSDoc type definitions and data structures
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── GEMINI.md             # AI operational rules and guidelines
```

---

## 3. Core Modules & Key Features
- **Board Management**:
  - Render columns (e.g., To Do, In Progress, Done).
  - Task movement and ordering across columns.
- **Task Management**:
  - Create, view, update, and delete individual tasks.
  - Priority indicators, task descriptions, and date tracking.
- **Local Persistence**:
  - Automatic synchronization with `localStorage`.
  - Fallback initialization with default sample tasks if storage is empty.
- **Validation & Feedback**:
  - Custom structured toast notifications for actions, errors, and input validation without browser default bubbles.

---

## 4. Implementation Roadmap & Status
| Module / Feature | Status | Target / Notes |
| :--- | :---: | :--- |
| Project Initialization & Rules | Completed | `GEMINI.md` and `.agent/PROJECT_OVERVIEW.md` configured |
| Core Kanban Board UI | Completed / In Progress | Basic layout, columns, and pointer interactions |
| Task Persistence Hook | Completed / In Progress | Sync board data with browser `localStorage` |
| Custom Toast Notification System | Planned | Replace default validation alerts with structured toasts |
| Date Formatting & Due Date Tracker | Planned | Standardized `DD MMM YYYY` date badges on task cards |

---

## 5. Technical Notes & Development Environment
- **Development Server**: `npm run dev` (Default URL: `http://localhost:5173`)
- **Production Build**: `npm run build`
- **Preview Build**: `npm run preview`
- **Initial Credentials**: None (Single-user offline app)
- **Documentation**: Root guidelines in [GEMINI.md](file:///c:/Personal_Workspace/Kanban-Board/GEMINI.md), PRDs and specs in `docs/`
