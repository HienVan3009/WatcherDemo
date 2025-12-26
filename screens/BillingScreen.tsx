
import React, { useState } from 'react';
import { Check, Crown, Zap, Wallet, QrCode, Loader2, CheckCircle2 } from 'lucide-react';
import { useWatcher } from '../WatcherContext';

const BillingScreen: React.FC = () => {
  const { invoices, user, updatePlan } = useWatcher();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async () => {
    if (user.plan === 'Pro') return;
    setIsProcessing(true);
    await updatePlan('Pro');
    setIsProcessing(false);
    setShowSuccess(true);
  };

  return (
    <div className="p-6 pt-12 space-y-8 animate-in slide-in-from-right duration-300">
      <h1 className="text-2xl font-bold">Billing & Plans</h1>

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[200] bg-[#09090B]/95 flex flex-col items-center justify-center space-y-6 backdrop-blur-sm">
           <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#10B981]/20 animate-pulse" />
              <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#10B981] animate-spin" size={48} />
           </div>
           <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Processing Payment</h3>
              <p className="text-sm text-[#A1A1AA]">Securely connecting to provider...</p>
           </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[200] bg-[#09090B]/95 flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in duration-300">
           <div className="w-32 h-32 rounded-full bg-[#10B981] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
              <CheckCircle2 size={64} className="text-[#09090B]" />
           </div>
           <div className="text-center space-y-3">
              <h2 className="text-3xl font-black">PAYMENT SUCCESS!</h2>
              <p className="text-[#A1A1AA]">Your account has been upgraded to Watcher PRO. All premium features are now unlocked.</p>
           </div>
           <button 
             onClick={() => setShowSuccess(false)}
             className="w-full py-5 bg-[#10B981] text-[#09090B] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-[#10B981]/20 active:scale-95 transition-transform"
           >
             Continue to Dashboard
           </button>
        </div>
      )}

      {/* Current Plan Card */}
      <section className="p-6 bg-[#18181B] border border-[#27272A] rounded-3xl space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
           <Zap size={80} className="text-[#A1A1AA]" />
        </div>
        <div>
           <span className="px-3 py-1 bg-zinc-800 text-[#A1A1AA] rounded-full text-[10px] font-black tracking-widest uppercase border border-[#27272A]">Current Status</span>
           <div className="flex items-center gap-2 mt-2">
              <h2 className="text-3xl font-black">{user.plan} Plan</h2>
              {user.plan === 'Pro' && <Crown size={24} className="text-amber-500 fill-amber-500 shadow-amber-500" />}
           </div>
           <p className="text-sm text-[#A1A1AA] mt-1">
             {user.plan === 'Free' ? 'Limited to 5 monitors and 5-min checks.' : 'All features unlocked. 30s checks enabled.'}
           </p>
        </div>
        {user.plan === 'Free' && (
          <button 
            onClick={handlePayment}
            className="w-full py-4 bg-[#FAFAFA] text-[#09090B] font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <Crown size={18} />
            Upgrade to PRO
          </button>
        )}
      </section>

      {/* Upgrade Options */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">Plan Comparison</h3>
        
        {/* Pro Plan */}
        <div className={`p-6 bg-[#18181B] border-2 rounded-3xl space-y-4 relative transition-all ${user.plan === 'Pro' ? 'border-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'border-[#27272A]'}`}>
          {user.plan === 'Pro' && (
            <div className="absolute top-4 right-4 bg-[#10B981] text-[#09090B] px-3 py-1 rounded-full text-[9px] font-black uppercase">Active</div>
          )}
          <div className="flex justify-between items-end">
            <div>
               <h4 className="text-xl font-bold">Watcher PRO</h4>
               <p className="text-xs text-[#A1A1AA]">For active site owners</p>
            </div>
            <div className="text-right">
               <span className="text-2xl font-black">$9</span>
               <span className="text-xs text-[#A1A1AA]">/mo</span>
            </div>
          </div>
          <ul className="space-y-2">
             <FeatureItem text="1 min check interval" />
             <FeatureItem text="SMS & Call alerts" />
             <FeatureItem text="Unlimited Monitors" />
             <FeatureItem text="1-year log retention" />
          </ul>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">Payment Methods</h3>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handlePayment} disabled={user.plan === 'Pro'} className="p-4 bg-[#18181B] border border-[#27272A] rounded-2xl flex items-center gap-3 active:scale-95 transition-transform disabled:opacity-50">
             <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Wallet size={20} /></div>
             <span className="text-xs font-bold uppercase">Momo</span>
          </button>
          <button onClick={handlePayment} disabled={user.plan === 'Pro'} className="p-4 bg-[#18181B] border border-[#27272A] rounded-2xl flex items-center gap-3 active:scale-95 transition-transform disabled:opacity-50">
             <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><QrCode size={20} /></div>
             <span className="text-xs font-bold uppercase">VietQR</span>
          </button>
        </div>
      </section>

      {/* Invoice History */}
      <section className="space-y-4 pb-12">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[#A1A1AA]">Invoices</h3>
        <div className="space-y-2">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-4 bg-[#18181B] border border-[#27272A] rounded-xl">
               <div className="flex flex-col">
                 <span className="mono text-xs font-bold">{inv.id}</span>
                 <span className="text-[10px] text-[#A1A1AA] uppercase font-medium">{inv.date}</span>
               </div>
               <div className="flex items-center gap-4">
                 <span className="font-bold text-sm">{inv.amount}</span>
                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                   inv.status === 'Paid' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                 }`}>
                   {inv.status}
                 </span>
               </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const FeatureItem = ({ text }) => (
  <li className="flex items-center gap-2 text-xs">
    <div className="w-4 h-4 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
       <Check size={10} />
    </div>
    <span className="text-[#A1A1AA]">{text}</span>
  </li>
);

export default BillingScreen;
