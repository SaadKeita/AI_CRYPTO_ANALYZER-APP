import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, DollarSign, Clock } from 'lucide-react';
import type { CryptoData } from '../types/crypto';

interface Props {
  cryptoData: CryptoData[];
  onSelectCrypto: (crypto: CryptoData) => void;
}

export default function InvestmentPredictor({ cryptoData, onSelectCrypto }: Props) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoData | null>(null);
  const [investment, setInvestment] = useState('1000');
  const [duration, setDuration] = useState('12');
  const [prediction, setPrediction] = useState<{
    potentialReturn: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    confidence: number;
    description: string;
  } | null>(null);

  const handleCryptoSelect = (crypto: CryptoData) => {
    setSelectedCrypto(crypto);
    onSelectCrypto(crypto);
  };

  const calculatePrediction = () => {
    if (!selectedCrypto) return;

    const amount = parseFloat(investment);
    const months = parseInt(duration);
    
    const volatility = Math.abs(selectedCrypto.price_change_percentage_24h);
    const marketCapRisk = selectedCrypto.market_cap_rank / 100;
    
    let riskLevel: 'Low' | 'Medium' | 'High';
    let baseReturn: number;
    let confidence: number;

    if (marketCapRisk < 0.1 && volatility < 5) {
      riskLevel = 'Low';
      baseReturn = 0.08;
      confidence = 0.8;
    } else if (marketCapRisk < 0.3 && volatility < 10) {
      riskLevel = 'Medium';
      baseReturn = 0.15;
      confidence = 0.6;
    } else {
      riskLevel = 'High';
      baseReturn = 0.25;
      confidence = 0.4;
    }

    const expectedReturn = amount * (1 + (baseReturn * months / 12));

    setPrediction({
      potentialReturn: expectedReturn,
      riskLevel,
      confidence: confidence * 100,
      description: `Based on ${selectedCrypto.name}'s historical performance and current market conditions, this investment carries a ${riskLevel.toLowerCase()} risk level.`
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
        <div className="text-blue-300 font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-purple-400" />
          Important Disclaimer
        </div>
        <p className="text-sm text-blue-300 leading-relaxed">
          Please note that cryptocurrency markets are highly volatile and unpredictable. 
          The predictions provided here are based on historical data and market indicators, 
          but should not be considered as financial advice. Always conduct thorough research, 
          diversify your investments, and consult with qualified financial advisors before 
          making any investment decisions.
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Select Cryptocurrency
            </label>
            <select
              className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-blue-300 focus:outline-none focus:border-blue-400 transition-colors"
              onChange={(e) => {
                const crypto = cryptoData.find(c => c.id === e.target.value);
                if (crypto) handleCryptoSelect(crypto);
              }}
              value={selectedCrypto?.id || ''}
            >
              <option value="">Choose a cryptocurrency</option>
              {cryptoData.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                <DollarSign className="w-4 h-4 inline-block mr-1" />
                Investment Amount (USD)
              </label>
              <input
                type="number"
                className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-blue-300 focus:outline-none focus:border-blue-400 transition-colors"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                <Clock className="w-4 h-4 inline-block mr-1" />
                Investment Duration (Months)
              </label>
              <input
                type="number"
                className="w-full bg-purple-900/50 border border-purple-500/30 rounded-lg px-4 py-3 text-blue-300 focus:outline-none focus:border-blue-400 transition-colors"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="60"
              />
            </div>
          </div>

          <button
            onClick={calculatePrediction}
            disabled={!selectedCrypto}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Calculate Potential Returns
          </button>
        </div>

        {prediction && (
          <div className="mt-8 space-y-4">
            <div className="p-6 rounded-lg bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                Investment Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300">Potential Return:</span>
                  <span className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    ${prediction.potentialReturn.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-blue-300">Risk Level:</span>
                  <span className={`font-semibold ${
                    prediction.riskLevel === 'Low' ? 'text-green-400' :
                    prediction.riskLevel === 'Medium' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {prediction.riskLevel}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-blue-300">Confidence Score:</span>
                  <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    {prediction.confidence.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-4 text-sm text-blue-300">
                  {prediction.description}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}