# Kanban Board

A lightweight, modern, and responsive personal task manager built with React 18, Tailwind CSS, and standard Pointer Events. It provides a frictionless Kanban workflow that runs entirely client-side with offline-first persistence in `localStorage`.

---

## Features

- **Direct-DOM Drag & Drop**: Smooth card dragging and reordering powered by native Pointer Events, gesture thresholds, and direct DOM transform manipulation.
- **Workflow Columns**: Organize tasks across standard workflow stages: *To Do*, *Doing*, and *Done*.
- **Comprehensive Task Details**: Set titles, markdown-like task descriptions, priority levels (Low, Medium, High), and due dates.
- **Smart Due Date Tracking**: Automatic overdue detection with standardized date formatting (`DD MMM YYYY`).
- **Structured Toast Notifications**: Non-intrusive feedback for validations and actions without default browser alert popups.
- **Offline-First Persistence**: Real-time state synchronization with browser `localStorage`, complete with corruption fallback and quota management.
- **Modern Dark UI**: Minimalist aesthetic crafted with Tailwind CSS and scalable Lucide React icons.

---

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React
- **Storage**: Browser `localStorage` (JSON-serialized)
- **Language**: JavaScript (ES Modules)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [npm](https://www.npmjs.com/) or another preferred package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/kanban-board.git
   cd kanban-board
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Available Scripts

- `npm run dev`: Runs Vite in development mode with Hot Module Replacement (HMR).
- `npm run build`: Compiles production assets into the `dist/` directory.
- `npm run preview`: Locally previews the production build.

---

## Project Structure

```text
Kanban-Board/
├── .agent/
│   ├── rules/
│   └── PROJECT_OVERVIEW.md  # Architectural overview and roadmap
├── docs/                     # Modular documentation and specifications
├── src/
│   ├── components/           # UI components (Board, Column, TaskCard, TaskModal, Toast, etc.)
│   ├── hooks/                # Custom React hooks (useKanban, useToast)
│   ├── utils/                # Date formatting and localStorage resilience utilities
│   ├── App.jsx               # Main application container
│   ├── index.css             # Tailwind base styles and directives
│   ├── main.jsx              # React DOM entry point
│   └── types.js              # Column configurations and priority definitions
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── GEMINI.md                 # Project operational rules and engineering guidelines
```

---

## License

This project is licensed under the [MIT License](LICENSE).
