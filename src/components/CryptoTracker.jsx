import React, { useState } from 'react'
import { Search, TrendingUp, Settings } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'

const CryptoTracker = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const sampleCryptos = [
    { name: 'Bitcoin', symbol: 'BTC', price: '45,232.50', change: '+2.34' },
    { name: 'Ethereum', symbol: 'ETH', price: '2,345.67', change: '-1.23' },
    { name: 'Binance Coin', symbol: 'BNB', price: '321.45', change: '+0.89' },
    { name: 'Cardano', symbol: 'ADA', price: '1.23', change: '+4.56' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">CryptoTracker</h1>
            </div>
            <Settings className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Crypto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleCryptos.map((crypto) => (
            <Card key={crypto.symbol} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{crypto.name}</h2>
                    <p className="text-sm text-gray-500">{crypto.symbol}</p>
                  </div>
                  <span 
                    className={`text-sm font-medium ${
                      crypto.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {crypto.change}%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-bold text-gray-900">${crypto.price}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default CryptoTracker