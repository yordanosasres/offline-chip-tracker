import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, PaperPlaneRight, Gift, Heart, Users, Microphone, VideoCamera, X } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  SEED_STREAMS, SEED_PROFILES, LiveStream, ChatMessage, LanguageCode,
} from '../constants';
import { speakText, playChime, translateText } from '../lib/audioTranslator';

interface Props {
  lang: LanguageCode;
  onSendTip: (amount: number) => void;
}

export default function LiveStreamHub({ lang, onSendTip }: Props) {
  const [activeStream, setActiveStream] = useState<LiveStream | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [viewers, setViewers] = useState(0);
  const [showGifts, setShowGifts] = useState(false);
  const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const [isGoLive, setIsGoLive] = useState(false);

  useEffect(() => {
    if (activeStream) {
      setViewers(activeStream.viewers);
      const interval = setInterval(() => {
        setViewers(v => v + Math.floor(Math.random() * 5) - 2);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeStream]);

  useEffect(() => {
    if (activeStream && messages.length === 0) {
      const botMsgs = [
        'Amazing presentation!', 'Love this energy', 'Can you show more details?',
        'This is exactly what I needed', 'Partnership opportunity here!', 'Incredible work',
      ];
      let i = 0;
      const interval = setInterval(() => {
        const bot = SEED_PROFILES[Math.floor(Math.random() * SEED_PROFILES.length)];
        const msg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: bot.name,
          text: botMsgs[i % botMsgs.length],
          timestamp: Date.now(),
          translatedText: translateText(botMsgs[i % botMsgs.length], lang),
          lang,
        };
        setMessages(prev => [...prev.slice(-50), msg]);
        i++;
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeStream, lang, messages.length]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'You',
      text: input,
      timestamp: Date.now(),
      translatedText: translateText(input, lang),
      lang,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const sendGift = (name: string, cost: number) => {
    onSendTip(cost);
    setShowGifts(false);
    playChime('tip');
    const emoji = name === 'Star' ? '⭐' : name === 'Heart' ? '❤' : name === 'Rocket' ? '' : '';
    const newReaction = { id: `r-${Date.now()}`, emoji, x: Math.random() * 80 + 10 };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== newReaction.id)), 3000);
    toast.success(`Sent ${name} gift to ${activeStream?.host.name}!`);
  };

  // Stream Grid
  if (!activeStream && !isGoLive) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-violet-400 bg-clip-text text-transparent">Live Broadcast Hub</h1>
              <p className="text-slate-400 mt-1">Watch and interact with global entrepreneurs</p>
            </div>
            <motion.button
              onClick={() => setIsGoLive(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white font-semibold shadow-lg shadow-red-500/25"
            >
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Go Live
            </motion.button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SEED_STREAMS.map((stream, i) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => { setActiveStream(stream); setMessages([]); }}
                className="cursor-pointer backdrop-blur-xl bg-slate-900/60 border border-slate-700/30 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-colors group"
              >
                <div className="relative h-40 bg-gradient-to-br from-indigo-900/40 to-violet-900/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center text-white font-bold text-lg">
                    {stream.host.avatar}
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 bg-red-500/90 rounded text-[10px] font-bold text-white">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-black/50 rounded text-xs text-white">
                    <Eye size={12} /> {stream.viewers.toLocaleString()}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play size={40} className="text-white" weight="fill" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm line-clamp-2">{stream.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{stream.host.name} - {stream.host.flag} {stream.host.country}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">{stream.category}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Go Live Simulation
  if (isGoLive) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] p-4 md:p-8 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full backdrop-blur-xl bg-slate-900/60 border border-violet-500/20 rounded-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center mb-4">
            <VideoCamera size={40} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Starting Broadcast...</h2>
          <p className="text-slate-400 text-sm mb-6">Your camera and microphone are being activated. Share your ideas with the global community.</p>
          <div className="flex justify-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-emerald-400"><Microphone size={16} /> Mic Ready</div>
            <div className="flex items-center gap-1.5 text-sm text-emerald-400"><VideoCamera size={16} /> Camera Ready</div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setIsGoLive(false)} className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm hover:bg-slate-700 transition-colors">Cancel</button>
            <button
              onClick={() => {
                setIsGoLive(false);
                setActiveStream({
                  id: 'my-stream',
                  host: { id: 'me', name: 'You', zodiac: 'Leo', country: 'Global', flag: '', category: 'Tech', bio: '', avatar: 'ME', online: true },
                  title: 'My Live Broadcast',
                  viewers: 1,
                  isLive: true,
                  category: 'Tech',
                });
                toast.success('You are now live!');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white text-sm font-semibold hover:from-red-500 hover:to-rose-500 transition-colors"
            >
              Start Broadcasting
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Active Stream View
  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-4 h-[calc(100dvh-8rem)]">
        {/* Video Area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative flex-1 min-h-[300px] backdrop-blur-xl bg-slate-900/80 border border-slate-700/30 rounded-2xl overflow-hidden">
            {/* Simulated video */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center text-white font-bold text-2xl mb-3">
                  {activeStream?.host.avatar}
                </div>
                <p className="text-white font-semibold">{activeStream?.host.name}</p>
                <p className="text-slate-400 text-sm">{activeStream?.title}</p>
              </div>
            </div>
            {/* Overlay controls */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-1 bg-red-500/90 rounded text-[10px] font-bold text-white">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
              </span>
              <span className="flex items-center gap-1 px-2 py-1 bg-black/50 rounded text-xs text-white">
                <Users size={12} /> {viewers.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => { setActiveStream(null); setMessages([]); }}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
            >
              <X size={16} />
            </button>
            {/* Floating reactions */}
            <AnimatePresence>
              {reactions.map(r => (
                <motion.div
                  key={r.id}
                  initial={{ y: 100, opacity: 1, x: `${r.x}%` }}
                  animate={{ y: -200, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.5, ease: 'easeOut' }}
                  className="absolute bottom-4 text-3xl pointer-events-none"
                  style={{ left: `${r.x}%` }}
                >
                  {r.emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Stream actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowGifts(!showGifts)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600/20 border border-violet-500/30 rounded-xl text-violet-300 text-sm hover:bg-violet-600/30 transition-colors"
            >
              <Gift size={16} /> Send Gift
            </button>
            <button
              onClick={() => { onSendTip(10); playChime('tip'); toast.success('Tipped $10!'); }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600/20 border border-amber-500/30 rounded-xl text-amber-300 text-sm hover:bg-amber-600/30 transition-colors"
            >
              <Heart size={16} weight="fill" /> Tip $10
            </button>
          </div>
          {/* Gifts Panel */}
          <AnimatePresence>
            {showGifts && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden backdrop-blur-xl bg-slate-900/60 border border-violet-500/20 rounded-xl"
              >
                <div className="p-4 grid grid-cols-4 gap-3">
                  {[{ name: 'Star', cost: 5 }, { name: 'Heart', cost: 10 }, { name: 'Rocket', cost: 25 }, { name: 'Crown', cost: 50 }].map(g => (
                    <button
                      key={g.name}
                      onClick={() => sendGift(g.name, g.cost)}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-800/60 border border-slate-700/30 hover:border-amber-500/40 transition-colors"
                    >
                      <span className="text-2xl">{g.name === 'Star' ? '⭐' : g.name === 'Heart' ? '❤' : g.name === 'Rocket' ? '' : ''}</span>
                      <span className="text-[10px] text-slate-400">${g.cost}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chat Panel */}
        <div className="flex flex-col backdrop-blur-xl bg-slate-900/60 border border-slate-700/30 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-white">Live Chat</h3>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[200px]">
            {messages.map(m => (
              <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-sm">
                <span className={`font-medium ${m.sender === 'You' ? 'text-amber-300' : 'text-violet-300'}`}>{m.sender}: </span>
                <span className="text-slate-300">{m.text}</span>
                {m.translatedText && m.translatedText !== m.text && (
                  <span className="text-[10px] text-slate-500 ml-1">[{m.translatedText}]</span>
                )}
              </motion.div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Say something..."
                className="flex-1 px-3 py-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
              <button onClick={sendMessage} className="p-2 bg-violet-600 rounded-lg text-white hover:bg-violet-500 transition-colors">
                <PaperPlaneRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}