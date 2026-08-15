import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface RealtimeContextType {
  lastEvent: any;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType>({
  lastEvent: null,
  isConnected: false,
});

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsConnected(false);
      return;
    }

    const getApiUrl = (): string => {
      const envUrl = (import.meta as any).env?.VITE_API_URL;
      if (envUrl) return envUrl;
      const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return `http://${hostname}:4000/api/v1`;
    };

    const streamUrl = `${getApiUrl()}/events/stream`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('⚡ Real-time SSE Connection established');
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setLastEvent(parsed);
      } catch (e) {
        console.error('Failed to parse real-time event', e);
      }
    };

    eventSource.onerror = (err) => {
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [user]);

  return (
    <RealtimeContext.Provider value={{ lastEvent, isConnected }}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
