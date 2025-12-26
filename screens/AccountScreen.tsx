
import React from 'react';
import { User, Shield, Bell, Settings, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

const AccountScreen: React.FC = () => {
  return (
    <div className="p-6 pt-12 space-y-8 animate-in slide-in-from-right duration-300">
      <h1 className="text-2xl font-bold">Account</h1>

      {/* User Profile Summary */}
      <section className="flex flex-col items-center gap-3 py-4">
         <div className="w-24 h-24 rounded-3xl border-2 border-[#27272A] overflow-hidden">
            <img src="https://picsum.photos/seed/user/200/200" alt="avatar" />
         </div>
         <div className="text-center">
            <h2 className="text-xl font-bold">Alex Nguyen</h2>
            <p className="text-sm text-[#A1A1AA] mt-0.5">alex.n@watcher.io</p>
         </div>
         <button className="px-6 py-2 bg-[#18181B] border border-[#27272A] rounded-full text-xs font-bold uppercase tracking-wider mt-2">Edit Profile</button>
      </section>

      {/* Settings Sections */}
      <section className="space-y-2">
         <AccountItem icon={<Settings size={20} />} label="General Settings" />
         <AccountItem icon={<Bell size={20} />} label="Notification Preferences" />
         <AccountItem icon={<Shield size={20} />} label="Security & Privacy" />
         <AccountItem icon={<HelpCircle size={20} />} label="Help Center & Support" />
      </section>

      {/* Logout */}
      <section className="pt-4">
         <button className="w-full flex items-center gap-3 p-4 bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl text-[#EF4444] active:bg-[#EF4444]/10 transition-colors">
            <LogOut size={20} />
            <span className="font-bold uppercase text-sm">Sign Out</span>
         </button>
         <div className="text-center mt-6">
            <p className="text-[10px] text-[#27272A] font-bold uppercase tracking-[0.2em]">Watcher v2.4.1 Production</p>
         </div>
      </section>
    </div>
  );
};

const AccountItem = ({ icon, label }) => (
  <button className="w-full flex items-center justify-between p-5 bg-[#18181B] border border-[#27272A] rounded-2xl active:bg-[#27272A] transition-colors">
     <div className="flex items-center gap-4 text-[#FAFAFA]">
        <div className="text-[#A1A1AA]">{icon}</div>
        <span className="text-sm font-semibold">{label}</span>
     </div>
     <ChevronRight size={18} className="text-[#27272A]" />
  </button>
);

export default AccountScreen;
