
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Monitor, User, Invoice, MonitorStatus, LogEntry, Incident } from './types';
import { MOCK_MONITORS, MOCK_INVOICES } from './constants';

interface WatcherContextType {
  user: User;
  monitors: Monitor[];
  invoices: Invoice[];
  addMonitor: (monitor: Omit<Monitor, 'id' | 'lastCheck' | 'responseTime' | 'sslStatus' | 'sslExpiry' | 'logs' | 'incidents' | 'checkInterval'>) => Promise<void>;
  updateMonitor: (id: string, updates: Partial<Monitor>) => Promise<void>;
  updatePlan: (plan: 'Pro') => Promise<void>;
  refreshMonitors: () => Promise<void>;
  toggleMonitorStatus: (id: string) => void;
  manualCheck: (id: string) => Promise<LogEntry>;
  notification: { message: string; type: 'alert' | 'success' } | null;
  setNotification: (notif: { message: string; type: 'alert' | 'success' } | null) => void;
}

const WatcherContext = createContext<WatcherContextType | undefined>(undefined);

const createMockLogs = (): LogEntry[] => {
  const logs: LogEntry[] = [];
  const now = new Date();
  for (let i = 0; i < 20; i++) {
    const time = new Date(now.getTime() - i * 60000 * 5);
    logs.push({
      id: Math.random().toString(36).substr(2, 5),
      timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      method: 'GET',
      statusCode: 200,
      statusText: 'OK',
      responseTime: Math.floor(Math.random() * 100) + 30
    });
  }
  return logs;
};

const INITIAL_MONITORS: Monitor[] = MOCK_MONITORS.map(m => ({
  ...m,
  checkInterval: 5,
  logs: createMockLogs(),
  incidents: [
    { id: 'inc-old-1', monitorName: m.name, time: '2 days ago', duration: '5m 20s', error: '502 Bad Gateway' }
  ]
}));

export const WatcherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    name: "Admin User",
    plan: "Free",
    avatar: "https://picsum.photos/seed/watcher/200/200"
  });
  const [monitors, setMonitors] = useState<Monitor[]>(INITIAL_MONITORS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [notification, setNotification] = useState<{ message: string; type: 'alert' | 'success' } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMonitors(prev => {
        if (prev.length === 0) return prev;
        const randomIndex = Math.floor(Math.random() * prev.length);
        const newMonitors = [...prev];
        const m = newMonitors[randomIndex];
        
        if (m.status === MonitorStatus.PAUSED) return prev;

        const oldStatus = m.status;
        const newStatus = Math.random() > 0.95 ? MonitorStatus.DOWN : MonitorStatus.UP;
        
        const newLog: LogEntry = {
          id: Math.random().toString(36).substr(2, 5),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          method: 'GET',
          statusCode: newStatus === MonitorStatus.UP ? 200 : 500,
          statusText: newStatus === MonitorStatus.UP ? 'OK' : 'Internal Server Error',
          responseTime: newStatus === MonitorStatus.UP ? Math.floor(Math.random() * 200) + 50 : 0
        };

        newMonitors[randomIndex] = {
          ...m,
          status: newStatus,
          responseTime: newLog.responseTime,
          logs: [newLog, ...m.logs].slice(0, 50),
          lastCheck: 'Just now'
        };

        if (newStatus === MonitorStatus.DOWN && oldStatus !== MonitorStatus.DOWN) {
          setNotification({ message: `Alert: ${m.name} is DOWN!`, type: 'alert' });
        }
        
        return newMonitors;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const addMonitor = async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newMonitor: Monitor = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      status: MonitorStatus.UP,
      responseTime: 85,
      lastCheck: 'Just now',
      sslStatus: 'Valid',
      sslExpiry: 365,
      checkInterval: 5,
      logs: createMockLogs(),
      incidents: []
    };
    setMonitors(prev => [newMonitor, ...prev]);
  };

  const updateMonitor = async (id: string, updates: Partial<Monitor>) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMonitors(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const manualCheck = async (id: string): Promise<LogEntry> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      method: 'GET',
      statusCode: 200,
      statusText: 'OK',
      responseTime: Math.floor(Math.random() * 100) + 40
    };
    
    setMonitors(prev => prev.map(m => m.id === id ? {
      ...m,
      status: MonitorStatus.UP,
      responseTime: newLog.responseTime,
      lastCheck: 'Just now',
      logs: [newLog, ...m.logs].slice(0, 50)
    } : m));

    return newLog;
  };

  const updatePlan = async (plan: 'Pro') => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    setUser(prev => ({ ...prev, plan }));
    const newInvoice: Invoice = {
      id: `#INV-00${invoices.length + 1}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: '$9.00',
      status: 'Paid'
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const refreshMonitors = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMonitors(prev => prev.map(m => ({
      ...m,
      responseTime: m.status === MonitorStatus.UP ? Math.floor(Math.random() * 300) + 20 : 0,
      lastCheck: 'Just now'
    })));
  };

  const toggleMonitorStatus = (id: string) => {
    setMonitors(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === MonitorStatus.PAUSED ? MonitorStatus.UP : MonitorStatus.PAUSED;
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  return (
    <WatcherContext.Provider value={{ 
      user, monitors, invoices, addMonitor, updateMonitor, updatePlan, 
      refreshMonitors, toggleMonitorStatus, manualCheck, notification, setNotification 
    }}>
      {children}
    </WatcherContext.Provider>
  );
};

export const useWatcher = () => {
  const context = useContext(WatcherContext);
  if (!context) throw new Error('useWatcher must be used within WatcherProvider');
  return context;
};
