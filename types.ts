
export enum MonitorStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  PAUSED = 'PAUSED'
}

export enum Protocol {
  HTTP = 'HTTP',
  KEYWORD = 'Keyword',
  PING = 'Ping'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  method: string;
  statusCode: number;
  statusText: string;
  responseTime: number;
}

export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: MonitorStatus;
  responseTime: number;
  lastCheck: string;
  sslStatus: string;
  sslExpiry: number;
  checkInterval: number;
  logs: LogEntry[];
  incidents: Incident[];
}

export interface Incident {
  id: string;
  monitorName: string;
  time: string;
  duration?: string;
  error: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending';
}

export type PlanType = 'Free' | 'Pro';

export interface User {
  name: string;
  plan: PlanType;
  avatar: string;
}

export type ScreenId = 'dashboard' | 'monitors' | 'billing' | 'account' | 'add-monitor' | 'monitor-detail';
