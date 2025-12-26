
import { Monitor, MonitorStatus, Incident, Invoice } from './types';

export const MOCK_MONITORS: Monitor[] = [
  {
    id: '1',
    name: 'Google Production',
    url: 'https://google.com',
    status: MonitorStatus.UP,
    responseTime: 120,
    lastCheck: '30s ago',
    sslStatus: 'Valid',
    sslExpiry: 245,
    // Fix: Added missing required properties to satisfy Monitor interface
    checkInterval: 5,
    logs: [],
    incidents: []
  },
  {
    id: '2',
    name: 'Internal API Gateway',
    url: 'https://api.internal.dev',
    status: MonitorStatus.DOWN,
    responseTime: 0,
    lastCheck: '12s ago',
    sslStatus: 'Expired',
    sslExpiry: 0,
    // Fix: Added missing required properties to satisfy Monitor interface
    checkInterval: 5,
    logs: [],
    incidents: []
  },
  {
    id: '3',
    name: 'Shopify Storefront',
    url: 'https://myshop.vn',
    status: MonitorStatus.UP,
    responseTime: 45,
    lastCheck: '45s ago',
    sslStatus: 'Valid',
    sslExpiry: 12,
    // Fix: Added missing required properties to satisfy Monitor interface
    checkInterval: 5,
    logs: [],
    incidents: []
  },
  {
    id: '4',
    name: 'Staging Environment',
    url: 'https://staging.app.io',
    status: MonitorStatus.PAUSED,
    responseTime: 0,
    lastCheck: '2h ago',
    sslStatus: 'Valid',
    sslExpiry: 89,
    // Fix: Added missing required properties to satisfy Monitor interface
    checkInterval: 5,
    logs: [],
    incidents: []
  },
  {
    id: '5',
    name: 'Backup Storage',
    url: 'https://s3.backup.com',
    status: MonitorStatus.UP,
    responseTime: 310,
    lastCheck: '1m ago',
    sslStatus: 'Valid',
    sslExpiry: 156,
    // Fix: Added missing required properties to satisfy Monitor interface
    checkInterval: 5,
    logs: [],
    incidents: []
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    monitorName: 'MyShop.vn',
    time: '10 mins ago',
    error: '502 Bad Gateway'
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: '#INV-001', date: 'Dec 25, 2024', amount: '$9.00', status: 'Paid' },
  { id: '#INV-002', date: 'Nov 25, 2024', amount: '$9.00', status: 'Paid' },
  { id: '#INV-003', date: 'Oct 25, 2024', amount: '$9.00', status: 'Paid' }
];

export const CHART_DATA = [
  { time: '00:00', ms: 120 },
  { time: '04:00', ms: 140 },
  { time: '08:00', ms: 110 },
  { time: '12:00', ms: 160 },
  { time: '16:00', ms: 130 },
  { time: '20:00', ms: 125 },
  { time: '23:59', ms: 120 },
];
