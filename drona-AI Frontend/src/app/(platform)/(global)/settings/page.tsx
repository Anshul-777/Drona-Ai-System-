"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storageAdapter } from "@/lib/storageAdapter";

export default function settingsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    isPublic: false,
    notifications: true,
    theme: 'dark'
  });

  useEffect(() => {
    setMounted(true);
    storageAdapter.getProfileSettings().then(setSettings);
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    storageAdapter.updateProfileSettings({ [key]: newValue });
  };

  const handleSelect = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    storageAdapter.updateProfileSettings({ [key]: value });
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-12 animate-fadeIn max-w-[1000px] mx-auto w-full">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-outline-variant/30">
        <div>
          <h1 className="font-display text-4xl font-black text-on-surface mb-2 tracking-tight">Platform Settings</h1>
          <p className="text-on-surface-variant font-medium">Manage your agent environment and privacy preferences.</p>
        </div>
        <button onClick={() => router.push('/profile')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:text-white transition-all hover:bg-surface-container-high bg-surface-container border border-outline-variant/20 shadow-sm">
          <span className="material-symbols-outlined text-lg">person</span>
          View Profile
        </button>
      </div>
      
      <div className="grid gap-6">
        {/* Privacy & Security */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-lowest/50">
            <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary">shield_person</span> Privacy & Identity
            </h2>
          </div>
          <div className="p-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Public Profile Visibility</h3>
              <p className="text-sm text-on-surface-variant max-w-lg">When enabled, your profile, achievements, and tactical data can be viewed by other users on the platform. Keep this disabled to remain anonymous.</p>
            </div>
            <button 
              onClick={() => handleToggle('isPublic')}
              className={`relative shrink-0 inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${settings.isPublic ? 'bg-primary' : 'bg-surface-container-highest'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${settings.isPublic ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-lowest/50">
            <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-amber-400">notifications_active</span> Notifications
            </h2>
          </div>
          <div className="p-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Mission & Agent Alerts</h3>
              <p className="text-sm text-on-surface-variant max-w-lg">Receive important updates from your deployed agents and notifications when mission objectives are completed.</p>
            </div>
            <button 
              onClick={() => handleToggle('notifications')}
              className={`relative shrink-0 inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${settings.notifications ? 'bg-amber-500' : 'bg-surface-container-highest'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${settings.notifications ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Interface */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-lowest/50">
            <h2 className="text-lg font-bold flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-emerald-400">palette</span> Interface Theme
            </h2>
          </div>
          <div className="p-6 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-on-surface mb-1">Color Scheme</h3>
              <p className="text-sm text-on-surface-variant max-w-lg">Choose the visual style for your command center environment.</p>
            </div>
            <div className="flex bg-surface-container-highest rounded-xl p-1 shrink-0">
               <button 
                 onClick={() => handleSelect('theme', 'dark')}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${settings.theme === 'dark' ? 'bg-surface-container-lowest text-on-surface shadow' : 'text-on-surface-variant hover:text-on-surface'}`}>
                 Dark
               </button>
               <button 
                 onClick={() => handleSelect('theme', 'light')}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${settings.theme === 'light' ? 'bg-surface-container-lowest text-on-surface shadow' : 'text-on-surface-variant hover:text-on-surface'}`}>
                 Light
               </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}