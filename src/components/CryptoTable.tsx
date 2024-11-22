import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { CryptoData } from '../types/crypto';

interface Props {
  cryptoData: CryptoData[];
  onSelectCrypto: (crypto: CryptoData) => void;
}

export default function CryptoTable({ cryptoData, onSelectCrypto }: Props) {
  return (
    <div className="overflow-x-auto bg-white/10 backdrop-blur-lg rounded-lg shadow-xl border border-purple-500/20">
      <table className="min-w-full divide-y divide-purple-200/20">
        <thead className="bg-purple-900/40">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">24h %</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Market Cap</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-purple-200/20">
          {cryptoData.map((crypto) => (
            <tr key={crypto.id} className="hover:bg-purple-900/20 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                {crypto.market_cap_rank}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src={crypto.image} alt={crypto.name} />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-purple-100">{crypto.name}</div>
                    <div className="text-sm text-purple-300">{crypto.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-100">
                ${crypto.current_price.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center text-sm ${
                  crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <ArrowUpCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownCircle className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                ${crypto.market_cap.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  onClick={() => onSelectCrypto(crypto)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors shadow-lg hover:shadow-xl"
                >
                  Analyze
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}