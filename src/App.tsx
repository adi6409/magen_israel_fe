import React, { useState, useMemo, useEffect } from 'react';
import { StatusIndicator, type StatusType } from './components/StatusIndicator';
import { ZoneSelectorModal } from './components/ZoneSelectorModal';
import { useAlertSocket } from './hooks/useAlertSocket';
import type { Alert } from './hooks/useAlertSocket';
import './App.css';

const APP_TITLE = '🛡️ מגן ישראל';
const APP_SUBTITLE = 'אפליקציית התראות מתקדמת';

const DANGER_TYPES = [
  'missiles',
  'hostileAircraftIntrusion',
  'earthQuake',
  'radiologicalEvent',
  'tsunami',
  'terroristInfiltration',
  'hazardousMaterials',
]

function getStatusType(alert: Alert | null, selectedZone: string): StatusType {
  let status: StatusType = 'ok';
  if (!alert) return 'ok';
  if (alert.cities.includes(selectedZone)) {
    console.log('alert.type', alert.type);  
    if (DANGER_TYPES.includes(alert.type)) {
      console.log('alert.type is danger');
      status = 'danger';
    } else if (alert.instructions && /בדקות הקרובות/i.test(alert.instructions)) {
      status = 'warning';
    } else if (alert.instructions && alert.instructions.includes("האירוע הסתיים")) {
      status = 'ok';
    }
  }
  console.log('status', status);
  return status;
}

function getSystemDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function App() {
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>(() => {
    return localStorage.getItem('selectedZone') || 'Jerusalem';
  });
  const { alert, lastUpdate } = useAlertSocket(selectedZone);

  // Persist selected zone
  const handleZoneSelect = (zone: string) => {
    setSelectedZone(zone);
    localStorage.setItem('selectedZone', zone);
  };

  const status: StatusType = useMemo(() => getStatusType(alert, selectedZone), [alert, selectedZone]);
  const instructions = useMemo(() => {
    if (!alert || !alert.instructions) return '';
    if (alert.cities.includes(selectedZone)) return alert.instructions;
    return '';
  }, [alert, selectedZone]);

  // Dark mode logic
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return getSystemDarkMode();
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen to system changes if user hasn't set a preference
  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('darkMode', next ? 'dark' : 'light');
      return next;
    });
  };

  // For mockup: use images if you want to display them, or keep SVGs for live
  // const statusImages = {
  //   ok: '/ref/all_is_good.png',
  //   warning: '/ref/stay_near_protected_space.png',
  //   danger: '/ref/stay_in_protected_space.png',
  // };

  return (
    <div className="app-container">
      <div className="header">
        <h1>{APP_TITLE}</h1>
        <div className="subtitle">{APP_SUBTITLE}</div>
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          className="darkmode-toggle"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="main-content">
        <StatusIndicator status={status} />
        <div className="info-section">
          <div className="last-update">עדכון אחרון: {lastUpdate || '--:--'}</div>
          <button className="location" onClick={() => setZoneModalOpen(true)}>
            📍 אזור: {selectedZone}
          </button>
          {instructions && (
            <div className="dashboard-instructions">{instructions}</div>
          )}
        </div>
      </div>
      <ZoneSelectorModal
        open={zoneModalOpen}
        onClose={() => setZoneModalOpen(false)}
        onSelect={handleZoneSelect}
        selectedZone={selectedZone}
      />
    </div>
  );
}
