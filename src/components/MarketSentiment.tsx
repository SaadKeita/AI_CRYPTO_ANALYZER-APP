import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Gauge } from 'lucide-react';
import type { CryptoData } from '../types/crypto';

interface Props {
  selectedCrypto: CryptoData | null;
}

export default function MarketSentiment({ selectedCrypto }: Props) {
  const [sentiment, setSentiment] = useState<{
    overall: 'Bullish' | 'Bearish' | 'Neutral';
    technicalScore: number;
    marketTrend: string;
    riskFactors: string[];
    fearGreedIndex: {
      value: number;
      status: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
    };
  } | null>(null);

  useEffect(() => {
    if (!selectedCrypto) {
      setSentiment(null);
      return;
    }

    const shortTermTrend = selectedCrypto.price_change_percentage_24h;
    const mediumTermTrend = selectedCrypto.price_change_percentage_7d;
    const longTermTrend = selectedCrypto.price_change_percentage_30d;

    const technicalScore = (shortTermTrend + mediumTermTrend + longTermTrend) / 3;

    // Calculate Fear & Greed Index based on multiple factors
    const volatilityScore = Math.min(Math.abs(shortTermTrend) * 2, 100);
    const marketCapScore = Math.max(100 - (selectedCrypto.market_cap_rank * 2), 0);
    const momentumScore = shortTermTrend > 0 ? Math.min(shortTermTrend * 3, 100) : Math.max(shortTermTrend * 3, -100);
    
    const fearGreedValue = (volatilityScore + marketCapScore + (momentumScore + 100) / 2) / 3;
    
    let fearGreedStatus: 'Extreme Fear' | 'Fear' | 'Neutral' | 'Greed' | 'Extreme Greed';
    if (fearGreedValue <= 20) fearGreedStatus = 'Extreme Fear';
    else if (fearGreedValue <= 40) fearGreedStatus = 'Fear';
    else if (fearGreedValue <= 60) fearGreedStatus = 'Neutral';
    else if (fearGreedValue <= 80) fearGreedStatus = 'Greed';
    else fearGreedStatus = 'Extreme Greed';

    const riskFactors = [];
    if (Math.abs(shortTermTrend) > 10) riskFactors.push('High 24h volatility');
    if (selectedCrypto.market_cap_rank > 50) riskFactors.push('Lower market cap');
    if (Math.abs(mediumTermTrend - longTermTrend) > 20) riskFactors.push('Inconsistent price trend');

    let overall: 'Bullish' | 'Bearish' | 'Neutral';
    let marketTrend = '';

    if (technicalScore > 5) {
      overall = 'Bullish';
      marketTrend = 'Strong upward momentum with positive market sentiment';
    } else if (technicalScore < -5) {
      overall = 'Bearish';
      marketTrend = 'Downward pressure with cautious market outlook';
    } else {
      overall = 'Neutral';
      marketTrend = 'Sideways movement with mixed market signals';
    }

    setSentiment({
      overall,
      technicalScore,
      marketTrend,
      riskFactors,
      fearGreedIndex: {
        value: fearGreedValue,
        status: fearGreedStatus
      }
    });
  }, [selectedCrypto]);

  if (!selectedCrypto || !sentiment) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
        <div className="text-center text-purple-200">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-purple-300" />
          <p>Select a cryptocurrency to view market sentiment analysis</p>
        </div>
      </div>
    );
  }

  const getFearGreedColor = (status: string) => {
    switch (status) {
      case 'Extreme Fear': return 'text-red-500';
      case 'Fear': return 'text-red-400';
      case 'Neutral': return 'text-yellow-400';
      case 'Greed': return 'text-green-400';
      case 'Extreme Greed': return 'text-green-500';
      default: return 'text-purple-200';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 shadow-xl">
      <h3 className="text-xl font-bold text-purple-100 mb-4">Market Sentiment Analysis</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-purple-200">Overall Sentiment:</span>
          <span className={`flex items-center font-semibold ${
            sentiment.overall === 'Bullish' ? 'text-green-400' :
            sentiment.overall === 'Bearish' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {sentiment.overall === 'Bullish' ? <TrendingUp className="w-5 h-5 mr-1" /> :
             sentiment.overall === 'Bearish' ? <TrendingDown className="w-5 h-5 mr-1" /> :
             <AlertCircle className="w-5 h-5 mr-1" />}
            {sentiment.overall}
          </span>
        </div>

        {/* Fear & Greed Index */}
        <div className="bg-purple-900/30 p-4 rounded-md mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-purple-100">
              <Gauge className="w-5 h-5 mr-2" />
              <span>Fear & Greed Index</span>
            </div>
            <span className={`font-bold ${getFearGreedColor(sentiment.fearGreedIndex.status)}`}>
              {sentiment.fearGreedIndex.status}
            </span>
          </div>
          <div className="w-full bg-purple-900/50 rounded-full h-2.5 mb-1">
            <div
              className={`h-2.5 rounded-full ${
                sentiment.fearGreedIndex.status === 'Extreme Fear' ? 'bg-red-500' :
                sentiment.fearGreedIndex.status === 'Fear' ? 'bg-red-400' :
                sentiment.fearGreedIndex.status === 'Neutral' ? 'bg-yellow-400' :
                sentiment.fearGreedIndex.status === 'Greed' ? 'bg-green-400' :
                'bg-green-500'
              }`}
              style={{ width: `${sentiment.fearGreedIndex.value}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-purple-300">
            <span>Extreme Fear</span>
            <span>Neutral</span>
            <span>Extreme Greed</span>
          </div>
        </div>

        <div className="bg-purple-900/30 p-4 rounded-md mb-4">
          <div className="text-sm text-purple-200 mb-2">Technical Analysis Score</div>
          <div className="w-full bg-purple-900/50 rounded-full h-2.5 mb-1">
            <div
              className={`h-2.5 rounded-full ${
                sentiment.technicalScore > 0 ? 'bg-green-400' :
                sentiment.technicalScore < 0 ? 'bg-red-400' : 'bg-yellow-400'
              }`}
              style={{ width: `${Math.min(Math.abs(sentiment.technicalScore) * 5, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-purple-300">
            Score: {sentiment.technicalScore.toFixed(2)}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-purple-100 mb-2">Market Trend</h4>
          <p className="text-sm text-purple-200">{sentiment.marketTrend}</p>
        </div>

        {sentiment.riskFactors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-purple-100 mb-2">Risk Factors</h4>
            <ul className="list-disc list-inside text-sm text-purple-200">
              {sentiment.riskFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-xs text-purple-300">
        Analysis based on price action, market trends, and technical indicators.
        This should not be considered as financial advice.
      </div>
    </div>
  );
}