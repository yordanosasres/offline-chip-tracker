import { motion } from 'framer-motion';
import { Broadcast, Lightbulb, Wallet, Sparkle, Bell, Globe } from '@phosphor-icons/react';
import { TabId, LANGUAGES, LanguageCode } from '../constants';

interface NavbarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  balance: number;
  lang: LanguageCode;
  onLangChange: (lang: LanguageCode) => void;
  notifications: number;
}

const TABS: { id: TabId; label: string; icon: any }[] = [
  { id: 'radar', label: 'Zodiac Radar', icon: Sparkle },
  { id: 'live', label: 'Live Streams', icon: Broadcast },
  { id: 'ideas', label: 'Idea Hub', icon: Lightbulb },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
];

export default function Navbar({ activeTab, onTabChange, balance, lang, onLangChange, notifications }: NavbarProps) {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-indigo-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-violet-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white font-black text-sm tracking-tight">YA</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-400/30 to-violet-600/30 blur-sm -z-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold bg-gradient-to-r from-amber-300 via-orange-300 to-violet-400 bg-clip-text text-transparent leading-tight hidden sm:block">
              Yordnos
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-400/80 tracking-wide uppercase">v2.4 Live</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-indigo-500/20 text-amber-300 border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={18} weight={active ? 'fill' : 'regular'} />
                <span className="hidden md:inline">{tab.label}</span>
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg border border-amber-400/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative">
            <Globe size={16} className="text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={lang}
              onChange={(e) => onLangChange(e.target.value as LanguageCode)}
              className="pl-7 pr-2 py-1.5 text-xs bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-300 appearance-none cursor-pointer hover:border-indigo-500/40 transition-colors"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.code.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-slate-400 hover:text-amber-300 transition-colors">
            <Bell size={18} />
            {notifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                {notifications}
              </span>
            )}
          </button>

          {/* Balance */}
          <motion.button
            onClick={() => onTabChange('wallet')}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-emerald-500/30 rounded-full text-emerald-300 text-sm font-semibold"
          >
            <Wallet size={14} weight="fill" />
            ${balance.toLocaleString()}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}