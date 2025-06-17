# Magen Israel Frontend

A modern, mobile-friendly React app for real-time Home Front Command alerts in Israel.

## Features
- Live alert status for your selected zone
- Animated, visually clear status indicator (safe, warning, danger)
- Zone selection modal with search
- Last update time and instructions
- Responsive design for mobile and desktop
- Dark mode with auto and manual toggle

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Backend server running (see ../magen_israel_be_nest)

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### API/Backend Configuration
- The frontend expects the backend to be running at `http://localhost:3000` (default).
- To change the backend URL, edit the `SOCKET_URL` in `src/hooks/useAlertSocket.ts`.
- REST API and WebSocket requests are proxied via Vite config for local development.

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Project Structure
- `src/` — React components, hooks, and styles
- `src/components/StatusIndicator.tsx` — Animated status indicator
- `src/components/ZoneSelectorModal.tsx` — Zone selection modal
- `src/hooks/useAlertSocket.ts` — WebSocket alert logic

## Notes
- Requires the backend to be running for live alerts and zone list.
- Zone selection modal is fully searchable and mobile-friendly.
- Dark mode is automatic (system) and can be toggled manually.

---

For backend setup, see [magen_israel_be](https:///github.com/adi6409/magen_israel_be)
