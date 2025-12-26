
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  CreditCard, 
  User as UserIcon, 
  Plus, 
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { ScreenId, Monitor } from './types';
import DashboardScreen from './screens/DashboardScreen';
import MonitorsScreen from './screens/MonitorsScreen';
import BillingScreen from './screens/BillingScreen';
import AccountScreen from './screens/AccountScreen';
import AddMonitorScreen from './screens/AddMonitorScreen';
import MonitorDetailScreen from './screens/MonitorDetailScreen';
import { WatcherProvider, useWatcher } from './WatcherContext';

const AppContent: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [previousScreen, setPreviousScreen] = useState<ScreenId | null>(null);
  const [selectedMonitorId, setSelectedMonitorId] = useState<string | null>(null);
  const { monitors, notification, setNotification } = useWatcher();

  const selectedMonitor = monitors.find(m => m.id === selectedMonitorId) || null;

  const navigateTo = (screen: ScreenId, monitorId?: string) => {
    setPreviousScreen(activeScreen);
    setActiveScreen(screen);
    if (monitorId) setSelectedMonitorId(monitorId);
  };

  const goBack = () => {
    if (previousScreen) {
      setActiveScreen(previousScreen);
      setPreviousScreen(null);
    } else {
      setActiveScreen('dashboard');
    }
  };

  // Clear notification after 5s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen onAddMonitor={() => navigateTo('add-monitor')} onSelectMonitor={(m) => navigateTo('monitor-detail', m.id)} />;
      case 'monitors':
        return <MonitorsScreen onSelectMonitor={(m) => navigateTo('monitor-detail', m.id)} />;
      case 'billing':
        return <BillingScreen />;
      case 'account':
        return <AccountScreen />;
      case 'add-monitor':
        return <AddMonitorScreen onBack={goBack} />;
      case 'monitor-detail':
        return selectedMonitor ? <MonitorDetailScreen monitor={selectedMonitor} onBack={goBack} /> : <DashboardScreen onAddMonitor={() => navigateTo('add-monitor')} onSelectMonitor={(m) => navigateTo('monitor-detail', m.id)} />;
      default:
        return <DashboardScreen onAddMonitor={() => navigateTo('add-monitor')} onSelectMonitor={(m) => navigateTo('monitor-detail', m.id)} />;
    }
  };

  const isModalScreen = activeScreen === 'add-monitor';

  return (
    <div className="flex justify-center bg-[#000] min-h-screen">
      <div className="relative w-full max-w-md h-screen bg-[#09090B] flex flex-col overflow-hidden border-x border-[#27272A]/50 shadow-2xl">
        
        {/* Global Alert Banner */}
        {notification && (
          <div className={`absolute top-12 left-6 right-6 z-[100] p-4 rounded-2xl flex items-center justify-between border shadow-2xl animate-in slide-in-from-top duration-300 ${
            notification.type === 'alert' ? 'bg-[#EF4444] border-[#EF4444] text-white' : 'bg-[#10B981] border-[#10B981] text-[#09090B]'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'alert' ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
              <span className="text-sm font-bold">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1 opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
        )}

        <main className={`flex-1 overflow-y-auto pb-24 transition-all duration-300 ${isModalScreen ? 'translate-y-0' : ''}`}>
          {renderScreen()}
        </main>

        {(activeScreen === 'dashboard' || activeScreen === 'monitors') && (
          <button 
            onClick={() => navigateTo('add-monitor')}
            className="absolute bottom-24 right-6 w-14 h-14 bg-[#10B981] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#10B981]/40 active:scale-90 transition-transform z-50"
          >
            <Plus size={28} />
          </button>
        )}

        {/* Bottom Tab Bar */}
        <nav className="absolute bottom-0 left-0 right-0 h-20 bg-[#18181B]/80 backdrop-blur-xl border-t border-[#27272A] flex items-center justify-around px-6 pb-4 z-40">
          <TabButton active={activeScreen === 'dashboard'} icon={<LayoutDashboard size={24} />} label="Home" onClick={() => navigateTo('dashboard')} />
          <TabButton active={activeScreen === 'monitors'} icon={<Activity size={24} />} label="Monitors" onClick={() => navigateTo('monitors')} />
          <TabButton active={activeScreen === 'billing'} icon={<CreditCard size={24} />} label="Billing" onClick={() => navigateTo('billing')} />
          <TabButton active={activeScreen === 'account'} icon={<UserIcon size={24} />} label="Account" onClick={() => navigateTo('account')} />
        </nav>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-[#10B981] scale-110' : 'text-[#A1A1AA]'}`}
  >
    {icon}
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    {active && (
      <div className="absolute -bottom-1 w-8 h-1 bg-[#10B981] rounded-full blur-[2px] shadow-[0_0_8px_#10B981] animate-in fade-in duration-500" />
    )}
  </button>
);

const App: React.FC = () => (
  <WatcherProvider>
    <AppContent />
  </WatcherProvider>
);

export default App;
