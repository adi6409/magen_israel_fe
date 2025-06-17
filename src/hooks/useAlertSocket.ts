import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'http://localhost:3000';
// get the address of the host from the current url
const SOCKET_URL = window.location.origin.split('://')[1].split(':')[0] + ':3000';

export type Alert = {
  type: string;
  cities: string[];
  instructions?: string;
};

export function useAlertSocket(selectedZone: string) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const alertsCache = useRef<Record<string, Alert>>({});

  useEffect(() => {
    console.log('SOCKET_URL', SOCKET_URL);
    const socket: Socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('all-latest-alerts', (allAlerts: Record<string, Alert>) => {
      alertsCache.current = allAlerts || {};
      if (selectedZone && allAlerts[selectedZone]) {
        setAlert(allAlerts[selectedZone]);
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    });

    socket.on('alert', (data: Alert) => {
      // Update cache for all affected zones
      if (Array.isArray(data.cities)) {
        data.cities.forEach(zone => {
          alertsCache.current[zone] = data;
        });
        // If the current selected zone is affected, update the alert
        if (data.cities.includes(selectedZone)) {
          setAlert(data);
          setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [selectedZone]);

  // When selectedZone changes, update alert from cache if available
  useEffect(() => {
    if (alertsCache.current[selectedZone]) {
      setAlert(alertsCache.current[selectedZone]);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [selectedZone]);

  return { alert, lastUpdate };
} 