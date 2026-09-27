import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowClockwise, ChatCircle, X, Star, MapPin } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  ZODIAC_SIGNS, ZODIAC_ELEMENTS, ZODIAC_SYMBOLS, ELEMENT_COLORS,
  COUNTRIES, CATEGORIES, SEED_PROFILES, getCompatibilityScore, getChemistryLabel,
  UserProfile, ZodiacSign, BusinessCategory, ChatMessage, LanguageCode,
} from '../constants';
import { translateText, speakText } from '../lib/audioTranslator';

interface Props {
  myZodiac: ZodiacSign;
  lang: LanguageCode;
  onSendTip: (amount: number) => void;
}

export default function ZodiacRadarMatch({ myZodiac, lang, onSendTip }: Props) {
  const [match, setMatch] = useState<UserProfile | null>(null);
  const [searching, setSearching] = useState(false);
  const [countryFilter, setCountryFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<BusinessCategory | ''>('');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');

  const findMatch = useCallback(() => {
    setSearching(true);
    setMatch(null);
    setTimeout(() => {
      let pool = SEED_PROFILES.filter(p => p.id !== 'me');
      if (countryFilter) pool = pool.filter(p => p.country === countryFilter);
      if (categoryFilter) pool = pool.filter(p => p.category === categoryFilter);
      if (pool.length === 0) {
        toast.error('No matches found with these filters. Try broadening your search.');
        setSearching(false);
        return;
      }
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setMatch(picked);
      setSearching(false);
      setMessages([]);
      const score = getCompatibilityScore(myZodiac, picked.zodiac);
      toast.success(`Cosmic match found! ${picked.name} - ${score}% compatible`);
    }, 1800);
  }, [countryFilter, categoryFilter, myZodiac]);

  const sendMessage = () => {
    if (!input.trim() || !match) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      text: input,
      timestamp: Date.now(),
      translatedText: translateText(input, lang),
      lang,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
    // Simulate reply
    setTimeout(() => {
      const replies = [
        'Great idea! Lets collaborate',
        'Interested in learning more',
        'Welcome aboard! This could be a partnership opportunity',
        'Thank you for reaching out',
        'Hello! I love what you are building',
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const replyMsg: ChatMessage = {
        id: `msg-${Date.now()}-r`,
        sender: match.name,
        text: reply,
        timestamp: Date.now(),
        translatedText: translateText(reply, lang),
        lang,
      };
      setMessages(prev => [...prev, replyMsg]);
    }, 1200);
  };

  const score = match ? getCompatibilityScore(myZodiac, match.zodiac) : 0;

  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            Cosmic Matchmaking Radar
          </h1>
          <p className="text-slate-400 mt-2">Find your perfect business partner across the stars</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <select
            value={countryFilter}
            onChange={e => setCountryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-300"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as BusinessCategory | '')}
            className="px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-slate-300"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <motion.button
            onClick={findMatch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={searching}
            className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/25"
          >
            <ArrowClockwise size={16} className={searching ? 'animate-spin' : ''} />
            {searching ? 'Scanning Cosmos...' : 'Random Match'}
          </motion.button>
        </div>

        {/* Radar Animation */}
        <AnimatePresence mode="wait">
          {searching && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center mb-8"
            >
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30" />
                <div className="absolute inset-4 rounded-full border border-violet-500/20" />
                <div className="absolute inset-8 rounded-full border border-amber-500/20" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0"
                >
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent origin-left" />
                </motion.div>
                {ZODIAC_SIGNS.map((sign, i) => {
                  const angle = (i / 12) * 360;
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <span
                      key={sign}
                      className="absolute text-lg text-slate-400"
                      style={{ top: `${50 + 45 * Math.sin(rad)}%`, left: `${50 + 45 * Math.cos(rad)}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {ZODIAC_SYMBOLS[sign]}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {match && !searching && (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Match Card */}
              <div className="backdrop-blur-xl bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center text-white font-bold text-xl">
                    {match.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{match.name}</h3>
                    <p className="text-slate-400 flex items-center gap-1 text-sm">
                      <MapPin size={14} /> {match.flag} {match.country}
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{match.bio}</p>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${ELEMENT_COLORS[ZODIAC_ELEMENTS[match.zodiac]]} bg-slate-800/80 border border-current/20`}>
                    {ZODIAC_SYMBOLS[match.zodiac]} {match.zodiac} ({ZODIAC_ELEMENTS[match.zodiac]})
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {match.category}
                  </span>
                </div>

                {/* Compatibility */}
                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Compatibility Score</span>
                    <span className="text-lg font-bold text-amber-300">{score}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-violet-500 via-amber-400 to-emerald-400 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{getChemistryLabel(score)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setChatOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-medium hover:bg-indigo-600/50 transition-colors"
                  >
                    <ChatCircle size={16} /> Chat
                  </button>
                  <button
                    onClick={() => { onSendTip(25); toast.success('Sent 25 stars to ' + match.name); }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm font-medium hover:bg-amber-600/40 transition-colors"
                  >
                    <Star size={16} weight="fill" /> Tip 25
                  </button>
                </div>
              </div>

              {/* Your Profile */}
              <div className="backdrop-blur-xl bg-slate-900/60 border border-violet-500/20 rounded-2xl p-6">
                <h4 className="text-sm text-slate-400 mb-3">Your Cosmic Profile</h4>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    You
                  </div>
                  <div>
                    <p className="font-semibold text-white">{myZodiac} {ZODIAC_SYMBOLS[myZodiac]}</p>
                    <p className={`text-xs ${ELEMENT_COLORS[ZODIAC_ELEMENTS[myZodiac]]}`}>{ZODIAC_ELEMENTS[myZodiac]} element</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Element match</span>
                    <span className="text-white">{ZODIAC_ELEMENTS[myZodiac]} + {ZODIAC_ELEMENTS[match.zodiac]}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Shared interest</span>
                    <span className="text-white">{match.category}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Distance</span>
                    <span className="text-white">Global</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Modal */}
        <AnimatePresence>
          {chatOpen && match && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setChatOpen(false)}
            >
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-slate-900 border border-indigo-500/20 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/60 border-b border-slate-700/50">
                  <span className="text-sm font-medium text-white">Chat with {match.name}</span>
                  <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && <p className="text-center text-slate-500 text-sm py-8">Start the conversation!</p>}
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                        m.sender === 'You' ? 'bg-indigo-600/40 text-indigo-100' : 'bg-slate-800 text-slate-200'
                      }`}>
                        <p>{m.text}</p>
                        {m.translatedText && m.translatedText !== m.text && (
                          <p className="text-[11px] text-slate-400 mt-1 italic">{m.translatedText}</p>
                        )}
                        {m.sender !== 'You' && (
                          <button onClick={() => speakText(m.text, m.lang || 'en')} className="text-[10px] text-amber-400 mt-1 hover:underline">Play audio</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 p-3 border-t border-slate-700/50">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                  <button onClick={sendMessage} className="px-4 py-2 bg-indigo-600 rounded-lg text-white text-sm font-medium hover:bg-indigo-500 transition-colors">
                    Send
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
