import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Settings, X, ArrowLeft, Clock, DollarSign, BarChart2, ArrowUpDown } from "lucide-react";
import { AreaChart, Area, YAxis, XAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import axios from "axios";

const SortControls = ({ sortConfig, onSortChange }) => {
  const sortOptions = [
    { value: 'market_cap', label: 'Market Cap' },
    { value: 'current_price', label: 'Price' },
    { value: 'price_change_percentage_24h', label: '24h Change' },
    { value: 'volume_24h', label: 'Volume' }
  ];

  return (
    <div className="flex items-center space-x-4 mb-6 bg-[#081b29] p-4 rounded-lg">
      <div className="flex items-center">
        <ArrowUpDown className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-white font-medium">Sort by:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => {
              const newDirection = 
                sortConfig.key === option.value && sortConfig.direction === 'desc'
                  ? 'asc'
                  : 'desc';
              onSortChange({ key: option.value, direction: newDirection });
            }}
            className={`px-3 py-1 rounded-md transition-colors ${
              sortConfig.key === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-[#0a2334] text-gray-300 hover:bg-[#0c2842]'
            }`}
          >
            {option.label}
            {sortConfig.key === option.value && (
              <span className="ml-1">
                {sortConfig.direction === 'desc' ? '↓' : '↑'}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const DetailModal = ({ crypto, onClose, timeframe, setTimeframe, historicalData }) => {
  const DetailModal = ({ crypto, onClose, timeframe, setTimeframe, historicalData }) => {
    const timeframeOptions = [
      { value: '24h', label: '24H' },
      { value: '7d', label: '7D' },
      { value: '30d', label: '30D' },
      { value: '90d', label: '90D' },
      { value: '1y', label: '1Y' }
    ];
  
    const formatTooltipValue = (value) => {
      return `£${value.toFixed(2)}`;
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#081b29] rounded-lg w-full max-w-4xl mx-4 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white flex items-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Back</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          {/* Crypto Info */}
          <div className="flex items-center mb-8">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-12 h-12 mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{crypto.name}</h2>
              <p className="text-gray-400">{crypto.symbol.toUpperCase()}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-2xl font-bold text-white">
                £{crypto.current_price.toLocaleString()}
              </p>
              <p
                className={`text-sm font-medium ${
                  crypto.price_change_percentage_24h > 0
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}
              >
                {crypto.price_change_percentage_24h?.toFixed(2)}%
              </p>
            </div>
          </div>
  
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#0a2334] p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">Market Cap</span>
              </div>
              <p className="text-xl font-bold text-white">
                £{crypto.market_cap.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#0a2334] p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart2 className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">Volume (24h)</span>
              </div>
              <p className="text-xl font-bold text-white">
                £{crypto.volume_24h.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#0a2334] p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-400">Last Updated</span>
              </div>
              <p className="text-xl font-bold text-white">
                Just now
              </p>
            </div>
          </div>
  
          {/* Price Chart */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Price Chart</h3>
              <div className="flex space-x-2">
                {timeframeOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setTimeframe(option.value)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      timeframe === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-[#0a2334] text-gray-300 hover:bg-[#0c2842]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
  
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                  />
                  <YAxis
                    stroke="#6B7280"
                    tick={{ fill: '#6B7280' }}
                    domain={['auto', 'auto']}
                    tickFormatter={formatTooltipValue}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a2334',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: '#fff'
                    }}
                    formatter={formatTooltipValue}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#3B82F6"
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

const CryptoTracker = () => {
  const API_KEY = import.meta.env.VITE_CRYPTO_API_KEY;
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [timeframe, setTimeframe] = useState('24h');
  const [historicalData, setHistoricalData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: 'market_cap',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);

        // First, get the list of top cryptocurrencies
        const topCoinsResponse = await axios.get(
          'https://min-api.cryptocompare.com/data/top/totalvolfull',
          {
            params: {
              limit: 20,
              tsym: 'GBP'
            },
            headers: {
              'authorization': `Apikey ${API_KEY}`
            }
          }
        );

        if (!topCoinsResponse.data.Data) {
          throw new Error('Invalid API response structure');
        }

        // Get detailed price data for each coin
        const symbols = topCoinsResponse.data.Data.map(item => item.CoinInfo.Name);
        const priceDataResponse = await axios.get(
          'https://min-api.cryptocompare.com/data/pricemultifull',
          {
            params: {
              fsyms: symbols.join(','),
              tsyms: 'GBP'
            },
            headers: {
              'authorization': `Apikey ${API_KEY}`
            }
          }
        );

        const formattedData = topCoinsResponse.data.Data.map(item => {
          const priceData = priceDataResponse.data.RAW?.[item.CoinInfo.Name]?.GBP;
          
          return {
            id: item.CoinInfo.Name.toLowerCase(),
            name: item.CoinInfo.FullName,
            symbol: item.CoinInfo.Name,
            current_price: priceData?.PRICE || 0,
            price_change_percentage_24h: priceData?.CHANGEPCT24HOUR || 0,
            market_cap: priceData?.MKTCAP || 0,
            volume_24h: priceData?.VOLUME24HOUR || 0,
            image: `https://www.cryptocompare.com${item.CoinInfo.ImageUrl}`
          };
        });

        setCryptos(formattedData);
      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to fetch cryptocurrency data. Please check your API key and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] === b[sortConfig.key]) {
        return 0;
      }
      
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      
      // Handle potential null or undefined values
      const aValue = a[sortConfig.key] ?? -Infinity;
      const bValue = b[sortConfig.key] ?? -Infinity;
      
      return aValue < bValue ? -1 * modifier : 1 * modifier;
    });
  };

  const filteredAndSortedCryptos = sortData(
    cryptos.filter((crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-customGray">
      <header className="bg-customBlue shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-white" />
              <h1 className="ml-2 text-2xl font-bold text-white">CryptoTracker</h1>
            </div>
            <Settings className="h-6 w-6 text-white cursor-pointer hover:text-gray-300" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center text-red-500 mt-10 p-4 bg-red-50 rounded-lg">
            <p className="font-semibold">{error}</p>
            <p className="text-sm mt-2">Please ensure your API key is correctly configured.</p>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search cryptocurrencies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-customBlue focus:border-transparent"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <SortControls 
              sortConfig={sortConfig} 
              onSortChange={setSortConfig}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                [...Array(6)].map((_, index) => (
                  <div key={index} className="bg-customBlue rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))
              ) : (
                filteredAndSortedCryptos.map((crypto) => (
                  <div
                    key={crypto.id}
                    className="bg-[#081b29] rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4 cursor-pointer"
                    onClick={() => setSelectedCrypto(crypto)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <img
                          src={crypto.image}
                          alt={crypto.name}
                          className="w-8 h-8 mr-2"
                        />
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            {crypto.name}
                          </h2>
                          <p className="text-sm text-gray-300">
                            {crypto.symbol.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          crypto.price_change_percentage_24h > 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-white">
                      £{crypto.current_price.toLocaleString()}
                    </p>
                    <div className="mt-2 text-sm text-gray-300">
                      Market Cap: £{crypto.market_cap.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-gray-300">
                      Volume (24h): £{crypto.volume_24h.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>

      {selectedCrypto && (
        <DetailModal
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          historicalData={historicalData}
        />
      )}
    </div>
  );
};

export default CryptoTracker;