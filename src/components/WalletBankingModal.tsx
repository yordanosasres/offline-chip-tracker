import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDownLeft, ArrowUpRight, ArrowsLeftRight, Bank, CreditCard, Globe, Check } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { WalletState, Transaction, BankAccount, COUNTRIES } from '../constants';
import { playChime } from '../lib/audioTranslator';

interface Props {
  wallet: WalletState;
  onUpdate: (w: WalletState) => void;
  onClose: () => void;
}

type ModalTab = 'overview' | 'transfer' | 'banks';

export default function WalletBankingModal({ wallet, onUpdate, onClose }: Props) {
  const [tab, setTab] = useState<ModalTab>('overview');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [depositMethod, setDepositMethod] = useState<'card' | 'bank'>('card');

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    const newTx: Transaction = { ...tx, id: `tx-${Date.now()}`, timestamp: Date.now(), status: 'completed' };
    const newBalance = tx.type === 'deposit' ? wallet.balance + tx.amount : wallet.balance - tx.amount;
    if (newBalance < 0) {
      toast.error('Insufficient funds');
      return false;
    }
    onUpdate({ ...wallet, balance: newBalance, transactions: [newTx, ...wallet.transactions] });
    playChime('success');
    return true;
  };

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Enter a valid amount'); return; }
    if (addTransaction({ type: 'deposit', amount: val, currency: wallet.currency, description: `Deposit via ${depositMethod === 'card' ? 'Credit Card' : 'Bank Transfer'}` })) {
      toast.success(`$${val.toLocaleString()} deposited!`);
      setAmount('');
    }
  };

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Enter a valid amount'); return; }
    if (addTransaction({ type: 'withdraw', amount: val, currency: wallet.currency, description: 'Withdrawal to linked bank' })) {
      toast.success(`$${val.toLocaleString()} withdrawal initiated`);
      setAmount('');
    }
  };

  const handleTransfer = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { toast.error('Enter a valid amount'); return; }
    if (!recipient.trim()) { toast.error('Enter a recipient'); return; }
    if (addTransaction({ type: 'transfer', amount: val, currency: wallet.currency, description: `Sent to ${recipient}${transferNote ? ': ' + transferNote : ''}` })) {
      toast.success(`$${val.toLocaleString()} sent to ${recipient}`);
      setAmount('');
      setRecipient('');
      setTransferNote('');
    }
  };

  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: `bank-${Date.now()}`,
      label: `Account ${wallet.bankAccounts.length + 1}`,
      iban: `XX00 0000 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      swift: 'YORDNOS',
      country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)].name,
      currency: ['USD', 'EUR', 'GBP', 'JPY', 'AUD'][Math.floor(Math.random() * 5)],
    };
    onUpdate({ ...wallet, bankAccounts: [...wallet.bankAccounts, newAccount] });
    toast.success('Bank account linked!');
  };

  const txIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft size={16} className="text-emerald-400" />;
      case 'withdraw': return <ArrowUpRight size={16} className="text-red-400" />;
      case 'transfer': return <ArrowsLeftRight size={16} className="text-violet-400" />;
      case 'tip': return <CreditCard size={16} className="text-amber-400" />;
      case 'pledge': return <Check size={16} className="text-emerald-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85dvh] backdrop-blur-xl bg-slate-900 border border-emerald-500/20 rounded-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bank size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Astra Wallet</h2>
              <p className="text-xs text-slate-400">Global banking & payments</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Balance */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border-b border-slate-800">
          <p className="text-xs text-slate-400 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-white">${wallet.balance.toLocaleString()}<span className="text-lg text-slate-400 ml-1">{wallet.currency}</span></p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800">
          {(['overview', 'transfer', 'banks'] as ModalTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-medium capitalize transition-colors ${tab === t ? 'text-emerald-300 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleDeposit} className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-sm font-medium hover:bg-emerald-600/30 transition-colors">
                  <ArrowDownLeft size={16} /> Deposit
                </button>
                <button onClick={handleWithdraw} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 border border-red-500/30 rounded-xl text-red-300 text-sm font-medium hover:bg-red-600/30 transition-colors">
                  <ArrowUpRight size={16} /> Withdraw
                </button>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-slate-400">Amount ({wallet.currency})</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDepositMethod('card')} className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${depositMethod === 'card' ? 'bg-violet-600/20 border-violet-500/30 text-violet-300' : 'bg-slate-800/60 border-slate-700/30 text-slate-400'}`}>
                  <CreditCard size={12} className="inline mr-1" /> Card
                </button>
                <button onClick={() => setDepositMethod('bank')} className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${depositMethod === 'bank' ? 'bg-violet-600/20 border-violet-500/30 text-violet-300' : 'bg-slate-800/60 border-slate-700/30 text-slate-400'}`}>
                  <Bank size={12} className="inline mr-1" /> Bank
                </button>
              </div>
              {/* Recent Transactions */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Recent Transactions</h3>
                <div className="space-y-2">
                  {wallet.transactions.slice(0, 6).map(tx => (
                    <div key={tx.id} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">{txIcon(tx.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">{tx.description}</p>
                        <p className="text-[10px] text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-sm font-semibold ${tx.type === 'deposit' || tx.type === 'pledge' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'transfer' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Recipient</label>
                <input
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="Username or email"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Amount ({wallet.currency})</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Note (optional)</label>
                <input
                  value={transferNote}
                  onChange={e => setTransferNote(e.target.value)}
                  placeholder="Payment for..."
                  className="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
                />
              </div>
              <button onClick={handleTransfer} className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition-colors">
                Send Payment
              </button>
              <div className="p-3 bg-slate-800/40 rounded-xl flex items-center gap-2 text-xs text-slate-400">
                <Globe size={14} className="text-violet-400" />
                Cross-border transfers processed instantly with auto-currency conversion
              </div>
            </div>
          )}

          {tab === 'banks' && (
            <div className="space-y-4">
              {wallet.bankAccounts.map(acc => (
                <div key={acc.id} className="p-4 bg-slate-800/40 border border-slate-700/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{acc.label}</span>
                    <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">{acc.currency}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-1">{acc.iban}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1"><Globe size={10} /> {acc.country} - SWIFT: {acc.swift}</p>
                </div>
              ))}
              <button onClick={addBankAccount} className="w-full py-3 bg-slate-800/60 border border-dashed border-slate-600 rounded-xl text-slate-400 text-sm hover:border-emerald-500/40 hover:text-emerald-300 transition-colors">
                + Link New Bank Account
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}