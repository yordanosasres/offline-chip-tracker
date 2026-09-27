import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import Navbar from './components/Navbar';
import ZodiacRadarMatch from './components/ZodiacRadarMatch';
import LiveStreamHub from './components/LiveStreamHub';
import IdeaExchangeHub from './components/IdeaExchangeHub';
import WalletBankingModal from './components/WalletBankingModal';
import {
  TabId, ZodiacSign, LanguageCode, WalletState,
  ZODIAC_SIGNS, DEFAULT_WALLET, STORAGE_KEY,
} from './constants';

function loadWallet(): WalletState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.wallet) return parsed.wallet;
    }
  } catch { /* ignore */ }
  return DEFAULT_WALLET;
}

function loadZodiac(): ZodiacSign {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.zodiac) return parsed.zodiac;
    }
  } catch { /* ignore */ }
  return 'Leo';
}

function saveState(zodiac: ZodiacSign, wallet: WalletState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ zodiac, wallet }));
  } catch { /* ignore */ }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('radar');
  const [myZodiac, setMyZodiac] = useState<ZodiacSign>(loadZodiac);
  const [lang, setLang] = useState<LanguageCode>('en');
  const [wallet, setWallet] = useState<WalletState>(loadWallet);
  const [showWallet, setShowWallet] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [onboarding, setOnboarding] = useState(() => !localStorage.getItem(STORAGE_KEY));

  useEffect(() => {
    saveState(myZodiac, wallet);
  }, [myZodiac, wallet]);

  const handleSendTip = useCallback((amount: number) => {
    if (wallet.balance < amount) {
      toast.error('Insufficient balance. Please deposit more funds.');
      return;
    }
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [{
        id: `tx-${Date.now()}`,
        type: 'tip' as const,
        amount,
        currency: prev.currency,
        description: `Tip sent during live session`,
        timestamp: Date.now(),
        status: 'completed' as const,
      }, ...prev.transactions],
    }));
  }, [wallet.balance]);

  const handleWalletUpdate = useCallback((w: WalletState) => {
    setWallet(w);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-200 overflow-hidden">
      <Toaster position="top-right" richColors theme="dark" />

      {/* Background Aurora */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl" />
      </div>

      {/* Onboarding */}
      <AnimatePresence>
        {onboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full backdrop-blur-xl bg-slate-900/90 border border-violet-500/30 rounded-2xl p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-violet-400 bg-clip-text text-transparent mb-2">
                Welcome to Yordnos
              </h1>
              <p className="text-slate-400 text-sm mb-6">Select your zodiac sign to begin your cosmic journey</p>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {ZODIAC_SIGNS.map(sign => (
                  <button
                    key={sign}
                    onClick={() => { setMyZodiac(sign); setOnboarding(false); toast.success(`Welcome, ${sign}! Your cosmic journey begins.`); }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${myZodiac === sign ? 'bg-violet-600 text-white border border-violet-400' : 'bg-slate-800/60 text-slate-400 border border-slate-700/30 hover:border-violet-500/40 hover:text-violet-300'}`}
                  >
                    {sign}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setOnboarding(false); toast.success('Welcome! Your sign is set to ' + myZodiac); }}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-colors"
              >
                Enter the Cosmos as {myZodiac}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'wallet') { setShowWallet(true); return; }
          setActiveTab(tab);
          setNotifications(0);
        }}
        balance={wallet.balance}
        lang={lang}
        onLangChange={setLang}
        notifications={notifications}
      />

      <AnimatePresence mode="wait">
        {activeTab === 'radar' && (
          <motion.div key="radar" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <ZodiacRadarMatch myZodiac={myZodiac} lang={lang} onSendTip={handleSendTip} />
          </motion.div>
        )}
        {activeTab === 'live' && (
          <motion.div key="live" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <LiveStreamHub lang={lang} onSendTip={handleSendTip} />
          </motion.div>
        )}
        {activeTab === 'ideas' && (
          <motion.div key="ideas" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
            <IdeaExchangeHub lang={lang} onSendTip={handleSendTip} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWallet && (
          <WalletBankingModal wallet={wallet} onUpdate={handleWalletUpdate} onClose={() => setShowWallet(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}