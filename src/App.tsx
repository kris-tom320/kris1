/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  TrendingUp, 
  ArrowRightLeft, 
  Bell, 
  Settings, 
  ChevronRight, 
  RefreshCw,
  Search,
  Plus,
  X,
  History,
  AlertCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { CURRENCIES, CurrencyCode, ExchangeRates, RateHistory } from './types';
import { fetchLatestRates, fetchHistoricalRates } from './services/exchangeRateService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const CurrencyCard = ({ 
  code, 
  amount, 
  baseCode, 
  rate, 
  onClick 
}: { 
  code: CurrencyCode; 
  amount: number; 
  baseCode: CurrencyCode;
  rate: number;
  onClick: () => void;
  key?: React.Key;
}) => {
  const currency = CURRENCIES[code];
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-between p-4 mb-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-indigo-100 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl">{currency.flag}</div>
        <div>
          <div className="font-bold text-slate-800">{code}</div>
          <div className="text-xs text-slate-400">{currency.name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono font-semibold text-lg text-slate-900">
          {currency.symbol}{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-[10px] text-slate-400">
          1 {baseCode} = {rate.toFixed(4)} {code}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationModal = ({ isOpen, onClose, time, setTime }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Daily Report Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Bell size={20}/></div>
              <div>
                <div className="font-semibold">Push Notifications</div>
                <div className="text-xs text-slate-500">Daily rate summary</div>
              </div>
            </div>
            <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Report Time</label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('USD');
  const [amount, setAmount] = useState<number>(100);
  const [rates, setRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<RateHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<CurrencyCode>('CNY');
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyTime, setNotifyTime] = useState("08:00");
  const [view, setView] = useState<'dashboard' | 'history'>('dashboard');

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const newRates = await fetchLatestRates(baseCurrency);
    setRates(newRates);
    const hist = await fetchHistoricalRates(baseCurrency, selectedHistory);
    setHistory(hist);
    setLoading(false);
  }, [baseCurrency, selectedHistory]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const displayedCurrencies: CurrencyCode[] = ['CNY', 'USD', 'HKD', 'EUR', 'JPY', 'GBP'];

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 relative pb-24">
      {/* Header */}
      <header className="p-6 pt-12 bg-white border-b border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">X-Rate</h1>
            <p className="text-xs text-slate-400 font-medium">Live Market Data</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsNotifyOpen(true)}
              className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <Bell size={20} />
            </button>
            <button className="p-3 bg-slate-50 rounded-2xl text-slate-600">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-lg">{CURRENCIES[baseCurrency].flag}</span>
              <span className="text-sm font-bold">{baseCurrency}</span>
            </div>
            <button 
              onClick={fetchAllData}
              className={cn("p-2 hover:bg-white/20 rounded-full transition-all", loading && "animate-spin")}
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="mb-2">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-transparent text-4xl font-bold w-full outline-none placeholder:text-white/50"
              placeholder="0.00"
            />
          </div>
          <div className="text-white/60 text-sm font-medium">
            {CURRENCIES[baseCurrency].name}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        {view === 'dashboard' ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-slate-800">Exchange Rates</h2>
              <button className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                Edit List <ChevronRight size={14}/>
              </button>
            </div>
            
            <AnimatePresence mode="popLayout">
              {displayedCurrencies
                .filter(code => code !== baseCurrency)
                .map(code => (
                  <CurrencyCard 
                    key={code}
                    code={code}
                    amount={amount * (rates[code] || 0)}
                    baseCode={baseCurrency}
                    rate={rates[code] || 0}
                    onClick={() => {
                      setBaseCurrency(code);
                      setAmount(amount * (rates[code] || 0));
                    }}
                  />
                ))}
            </AnimatePresence>
            
            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold flex items-center justify-center gap-2 hover:border-indigo-300 hover:text-indigo-400 transition-all">
              <Plus size={20}/> Add Currency
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-bold text-slate-800">{baseCurrency} / {selectedHistory}</h2>
                  <p className="text-xs text-slate-400">Last 7 Days Trend</p>
                </div>
                <div className="text-right">
                  <div className="text-emerald-500 font-bold flex items-center gap-1 justify-end">
                    <TrendingUp size={14}/> +1.2%
                  </div>
                  <div className="text-[10px] text-slate-400">vs last week</div>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fill: '#94a3b8'}} 
                    />
                    <YAxis 
                      hide 
                      domain={['auto', 'auto']} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="rate" 
                      stroke="#4f46e5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRate)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Highest</div>
                <div className="font-bold text-slate-800">
                  {Math.max(...history.map(h => h.rate)).toFixed(4)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-400 mb-1">Lowest</div>
                <div className="font-bold text-slate-800">
                  {Math.min(...history.map(h => h.rate)).toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 h-16 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full shadow-lg flex items-center justify-around px-4 z-40">
        <button 
          onClick={() => setView('dashboard')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            view === 'dashboard' ? "text-indigo-600" : "text-slate-400"
          )}
        >
          <ArrowRightLeft size={20} />
          <span className="text-[10px] font-bold">Convert</span>
        </button>
        <button 
          onClick={() => setView('history')}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            view === 'history' ? "text-indigo-600" : "text-slate-400"
          )}
        >
          <History size={20} />
          <span className="text-[10px] font-bold">Trends</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-400">
          <Search size={20} />
          <span className="text-[10px] font-bold">Search</span>
        </button>
      </nav>

      {/* Notification Simulator */}
      <NotificationModal 
        isOpen={isNotifyOpen} 
        onClose={() => setIsNotifyOpen(false)}
        time={notifyTime}
        setTime={setNotifyTime}
      />

      {/* Simulated Notification Toast */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-50"
          >
            <RefreshCw size={14} className="animate-spin" /> Updating rates...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
