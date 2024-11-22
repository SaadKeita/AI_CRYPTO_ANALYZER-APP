import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coins, TrendingUp, UserCircle2, AlertTriangle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import type { CryptoData } from './types/crypto';
import { auth } from './lib/firebase';
import CryptoTable from './components/CryptoTable';
import InvestmentGrowthCalculator from './components/InvestmentGrowthCalculator';
import MarketSentiment from './components/MarketSentiment';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import { saveCryptoData, getLatestCryptoData } from './services/cryptoService';

export default function App() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const storedData = await getLatestCryptoData();
        
        if (storedData.length > 0) {
          setCryptoData(storedData as CryptoData[]);
          setLoading(false);
        }

        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
              price_change_percentage: '24h,7d,30d'
            }
          }
        );
        
        await saveCryptoData(response.data);
        setCryptoData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch crypto data. Please try again later.');
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-purple-900 to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-300"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-purple-900 to-navy-900 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-purple-900 to-navy-900">
      <Toaster position="top-right" />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <nav className="bg-navy-900/50 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Coins className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-xl font-bold text-white">AI Crypto Analyzer</span>
            </div>
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-6 w-6 text-purple-400" />
              <span className="text-sm text-white">Live Market Data</span>
              {user ? (
                <UserMenu user={user} onSignOut={() => setUser(null)} />
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 text-white hover:text-purple-400 transition-colors"
                >
                  <UserCircle2 className="h-6 w-6" />
                  <span className="text-sm">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-navy-900/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-purple-400 mr-2" />
              <h1 className="text-2xl font-bold text-white">
                Important Disclaimer
              </h1>
            </div>
            <p className="text-white/90 leading-relaxed">
              Please note that cryptocurrency markets are highly volatile and unpredictable. 
              The predictions provided here are based on historical data and market indicators, 
              but should not be considered as financial advice. Always conduct thorough research, 
              diversify your investments, and consult with qualified financial advisors before 
              making any investment decisions.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-purple-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">
              Investment Growth Calculator
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <InvestmentGrowthCalculator 
                cryptoData={cryptoData} 
                onSelectCrypto={setSelectedCrypto}
              />
            </div>
            <div>
              <MarketSentiment selectedCrypto={selectedCrypto} />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center mb-6">
            <Coins className="w-6 h-6 text-purple-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">
              Live Market Data
            </h2>
          </div>
          <CryptoTable 
            cryptoData={cryptoData} 
            onSelectCrypto={setSelectedCrypto} 
          />
        </div>
      </main>

      <footer className="bg-navy-900/50 backdrop-blur-lg mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-white/80 text-sm">
            Data provided by CoinGecko API. Investment predictions are estimates and should not be considered as financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}