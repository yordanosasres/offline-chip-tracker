import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUp, Users, CurrencyDollar, X, ChatCircle, Globe } from '@phosphor-icons/react';
import { toast } from 'sonner';
import {
  SEED_IDEAS, CATEGORIES, COUNTRIES, BusinessIdea, BusinessCategory,
  UserProfile, LanguageCode,
} from '../constants';
import { playChime, translateText } from '../lib/audioTranslator';

interface Props {
  lang: LanguageCode;
  onSendTip: (amount: number) => void;
}

export default function IdeaExchangeHub({ lang, onSendTip }: Props) {
  const [ideas, setIdeas] = useState<BusinessIdea[]>(SEED_IDEAS);
  const [categoryFilter, setCategoryFilter] = useState<BusinessCategory | ''>('');
  const [showPost, setShowPost] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [collabOpen, setCollabOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<BusinessCategory>('Tech');
  const [collabMsg, setCollabMsg] = useState('');

  const filtered = categoryFilter ? ideas.filter(i => i.category === categoryFilter) : ideas;

  const postIdea = () => {
    if (!newTitle.trim() || !newDesc.trim()) {
      toast.error('Please fill in title and description');
      return;
    }
    const idea: BusinessIdea = {
      id: `i-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      author: { id: 'me', name: 'You', zodiac: 'Leo', country: 'Global', flag: '', category: newCategory, bio: '', avatar: 'ME', online: true },
      category: newCategory,
      upvotes: 0,
      funding: 0,
      country: 'Global',
      createdAt: Date.now(),
    };
    setIdeas(prev => [idea, ...prev]);
    setShowPost(false);
    setNewTitle('');
    setNewDesc('');
    toast.success('Idea published! The cosmos awaits your vision.');
  };

  const upvote = (id: string) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i));
  };

  const pledge = (idea: BusinessIdea, amount: number) => {
    onSendTip(amount);
    setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, funding: i.funding + amount } : i));
    playChime('success');
    toast.success(`Pledged $${amount} to "${idea.title}"`);
  };

  const sendCollab = () => {
    if (!collabMsg.trim() || !selectedIdea) return;
    const translated = translateText(collabMsg, lang);
    toast.success(`Collaboration message sent to ${selectedIdea.author.name}!`);
    if (translated !== collabMsg) {
      toast.info(`Translated: "${translated}"`);
    }
    setCollabOpen(false);
    setCollabMsg('');
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">Idea Exchange Hub</h1>
            <p className="text-slate-400 mt-1">Cross-border ventures seeking co-founders & funding</p>
          </div>
          <motion.button
            onClick={() => setShowPost(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white text-sm font-semibold shadow-lg shadow-emerald-500/25"
          >
            <Plus size={16} /> Post Idea
          </motion.button>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${!categoryFilter ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/60 text-slate-400 border border-slate-700/30 hover:text-white'}`}
          >
            All
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === c ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800/60 text-slate-400 border border-slate-700/30 hover:text-white'}`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((idea, i) => (
              <motion.div
                key={idea.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedIdea(idea)}
                className="cursor-pointer backdrop-blur-xl bg-slate-900/60 border border-slate-700/30 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-white text-sm leading-tight">{idea.title}</h3>
                  <button onClick={(e) => { e.stopPropagation(); upvote(idea.id); }} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800 text-amber-300 text-xs font-bold hover:bg-amber-900/30 transition-colors flex-shrink-0">
                    <ArrowUp size={12} /> {idea.upvotes}
                  </button>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">{idea.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-[9px] text-white font-bold">
                      {idea.author.avatar}
                    </div>
                    <span className="text-xs text-slate-400">{idea.author.flag} {idea.author.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/20">{idea.category}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/20">
                      <CurrencyDollar size={9} className="inline" /> ${idea.funding.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg">No ideas found in this category</p>
            <p className="text-sm mt-1">Be the first to post one!</p>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      <AnimatePresence>
        {selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedIdea(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg backdrop-blur-xl bg-slate-900 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-lg font-bold text-white pr-4">{selectedIdea.title}</h2>
                <button onClick={() => setSelectedIdea(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">{selectedIdea.description}</p>
              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/40 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-amber-400 flex items-center justify-center text-white font-bold text-sm">
                  {selectedIdea.author.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{selectedIdea.author.name}</p>
                  <p className="text-xs text-slate-400">{selectedIdea.author.flag} {selectedIdea.author.country} - {selectedIdea.author.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCollabOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-violet-600/20 border border-violet-500/30 rounded-xl text-violet-300 text-sm hover:bg-violet-600/30 transition-colors"
                >
                  <ChatCircle size={16} /> Collaborate
                </button>
                <button
                  onClick={() => pledge(selectedIdea, 50)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm hover:bg-emerald-600/30 transition-colors"
                >
                  <CurrencyDollar size={16} /> Pledge $50
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Idea Modal */}
      <AnimatePresence>
        {showPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPost(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md backdrop-blur-xl bg-slate-900 border border-emerald-500/20 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-white">Post New Idea</h2>
                <button onClick={() => setShowPost(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Idea title"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Describe your cross-border venture..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
                />
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as BusinessCategory)}
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={postIdea} className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white text-sm font-semibold hover:from-emerald-500 hover:to-teal-500 transition-colors">
                  Publish to the Cosmos
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collaboration Modal */}
      <AnimatePresence>
        {collabOpen && selectedIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCollabOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm backdrop-blur-xl bg-slate-900 border border-violet-500/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-2">Collaborate with {selectedIdea.author.name}</h3>
              <p className="text-xs text-slate-400 mb-4">Your message will be auto-translated to their preferred language.</p>
              <textarea
                value={collabMsg}
                onChange={e => setCollabMsg(e.target.value)}
                placeholder="Tell them why you are a great fit..."
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none mb-3"
              />
              {collabMsg && (
                <p className="text-xs text-slate-500 mb-3 italic">Will translate to: "{translateText(collabMsg, lang)}"</p>
              )}
              <button onClick={sendCollab} className="w-full py-2.5 bg-violet-600 rounded-xl text-white text-sm font-semibold hover:bg-violet-500 transition-colors">
                Send Collaboration Request
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}