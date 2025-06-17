import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = "https://magen.astroianu.dev"

export type Alert = {
  type: string;
  cities: string[];
  instructions?: string;
};

export function useAlertSocket(selectedZone: string) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const alertsCache = useRef<Record<string, Alert>>({});

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      path: '/api/ws',
      transports: ['websocket'],
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // Update lastUpdate on any message from the server (including keepalives)
    socket.onAny((_event, ..._args) => {
      if (socket.connected) {
        setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    });

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

  return { alert, lastUpdate, isConnected };
} 