
import React, { useState } from 'react';
import { ChevronLeft, Info, HelpCircle, Loader2 } from 'lucide-react';
import { Protocol } from '../types';
import { useWatcher } from '../WatcherContext';

interface AddMonitorScreenProps {
  onBack: () => void;
}

const AddMonitorScreen: React.FC<AddMonitorScreenProps> = ({ onBack }) => {
  const { addMonitor, setNotification } = useWatcher();
  const [protocol, setProtocol] = useState<Protocol>(Protocol.HTTP);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (val: string) => {
    if (!val) return '';
    if (!val.includes('.')) return 'Invalid URL format';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlError = validateUrl(url);
    if (urlError) {
      setError(urlError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addMonitor({
        name,
        url: url.startsWith('http') ? url : `https://${url}`,
        status: 0 as any, // Context handles defaults
      });
      setNotification({ message: 'Monitor added successfully!', type: 'success' });
      onBack();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#09090B] animate-in slide-in-from-bottom duration-500 overflow-y-auto pb-32">
      <div className="p-6 pt-12 flex items-center justify-between sticky top-0 bg-[#09090B]/90 backdrop-blur-md z-50">
        <button onClick={onBack} disabled={loading} className="p-2 -ml-2 rounded-xl text-[#A1A1AA] active:bg-zinc-800 disabled:opacity-50">
          <ChevronLeft size={24} />
        </button>
        <h2 className="font-bold">Add Monitor</h2>
        <div className="w-8" />
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Protocol Selector */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-[#A1A1AA] tracking-widest flex items-center justify-between">
            Monitor Type
            <HelpCircle size={14} />
          </label>
          <div className="flex bg-[#18181B] p-1 rounded-xl border border-[#27272A]">
            {[Protocol.HTTP, Protocol.KEYWORD, Protocol.PING].map((p) => (
              <button
                key={p}
                type="button"
                disabled={loading}
                onClick={() => setProtocol(p)}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all ${
                  protocol === p ? 'bg-[#27272A] text-[#10B981]' : 'text-[#A1A1AA]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          <FormGroup label="Friendly Name">
            <input 
              type="text" 
              placeholder="e.g. My Production API"
              value={name}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-xl py-4 px-4 text-sm text-[#FAFAFA] focus:border-[#10B981] outline-none transition-colors"
            />
          </FormGroup>

          <FormGroup label="URL or Hostname">
            <div className="space-y-2">
              <input 
                type="text" 
                placeholder="https://mysite.com"
                value={url}
                disabled={loading}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                className={`w-full bg-[#18181B] border rounded-xl py-4 px-4 text-sm text-[#FAFAFA] focus:border-[#10B981] outline-none transition-colors mono ${error ? 'border-[#EF4444]' : 'border-[#27272A]'}`}
              />
              {error && <p className="text-[10px] text-[#EF4444] font-bold uppercase">{error}</p>}
            </div>
          </FormGroup>

          <div className="space-y-4">
             <label className="text-[10px] font-black uppercase text-[#A1A1AA] tracking-widest flex items-center justify-between">
               Check Interval
               <span className="text-[#10B981] font-black">{interval} minute{interval > 1 ? 's' : ''}</span>
             </label>
             <input 
                type="range" 
                min="1" 
                max="60" 
                step="1"
                value={interval}
                disabled={loading}
                onChange={(e) => setInterval(parseInt(e.target.value))}
                className="w-full h-2 bg-[#18181B] rounded-lg appearance-none cursor-pointer accent-[#10B981] disabled:opacity-50"
             />
             <div className="flex justify-between text-[10px] font-bold text-[#27272A]">
               <span>1 MIN</span>
               <span>60 MIN</span>
             </div>
          </div>
        </div>

        {/* Tip Box */}
        <div className="p-4 bg-[#10B981]/5 border border-[#10B981]/20 rounded-2xl flex gap-3 items-start">
           <Info size={18} className="text-[#10B981] shrink-0 mt-0.5" />
           <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
             We will check your website from 5 different global locations to ensure zero false positives.
           </p>
        </div>

        {/* Action Button */}
        <div className="fixed bottom-10 left-6 right-6 z-50">
           <button 
             type="submit"
             disabled={!name || !url || loading}
             className={`w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 ${
               name && url && !loading
               ? 'bg-[#10B981] text-[#09090B] shadow-[#10B981]/20 active:scale-95' 
               : 'bg-[#18181B] text-[#27272A] border border-[#27272A]'
             }`}
           >
             {loading && <Loader2 className="animate-spin" size={18} />}
             {loading ? 'Creating...' : 'Create Monitor'}
           </button>
        </div>
      </form>
    </div>
  );
};

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-[#A1A1AA] tracking-widest block pl-1">{label}</label>
    {children}
  </div>
);

export default AddMonitorScreen;
