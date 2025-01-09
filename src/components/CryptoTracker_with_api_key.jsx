import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { AreaChart, Area, YAxis, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import axios from 'axios';

const CryptoTracker = () => {
  const API_KEY = 'CG-1Q7Dwwf8d8ofd74kHHKaqXY9'; // Replace with your actual API key

  const [searchQuery, setSearchQuery] = useState('');
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState({});

  // Fetch main crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'gbp',
              order: 'market_cap_desc',
              per_page: 20,
              page: 1,
              sparkline: false,
            },
            headers: {
              'Authorization': `Bearer ${API_KEY}`, // Including the API key in the headers
            },
          }
        );

        setCryptos(response.data);

        // Fetch price history for each crypto
        const historyPromises = response.data.map((crypto) =>
          axios.get(
            `https://api.coingecko.com/api/v3/coins/${crypto.id}/market_chart`,
            {
              params: {
                vs_currency: 'gbp',
                days: 7,
                interval: 'daily',
              },
              headers: {
                'Authorization': `Bearer ${API_KEY}`, // Including the API key in the headers
              },
            }
          )
        );

        const histories = await Promise.all(historyPromises);
        const historyData = {};

        histories.forEach((history, index) => {
          const cryptoId = response.data[index].id;
          historyData[cryptoId] = history.data.prices.map((price) => ({
            date: new Date(price[0]).toLocaleDateString(),
            price: price[1],
          }));
        });

        setPriceHistory(historyData);
      } catch (err) {
        setError('Failed to fetch cryptocurrency data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-40 bg-gray-200 rounded mt-4"></div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredCryptos.map((crypto) => (
              <Card key={crypto.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="w-8 h-8 mr-2"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {crypto.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {crypto.symbol.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        crypto.price_change_percentage_24h > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {crypto.price_change_percentage_24h?.toFixed(2)}%
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    £{crypto.current_price.toLocaleString()}
                  </p>
                  <div className="mt-2 text-sm text-gray-500">
                    Market Cap: £{crypto.market_cap.toLocaleString()}
                  </div>

                  {/* Price Chart */}
                  <div className="h-40 mt-4">
                    {priceHistory[crypto.id] && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceHistory[crypto.id]}>
                          <defs>
                            <linearGradient
                              id={`gradient-${crypto.id}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide={true} />
                          <YAxis hide={true} domain={['dataMin', 'dataMax']} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-2 rounded shadow">
                                    <p className="text-sm">£{payload[0].value.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">
                                      {payload[0].payload.date}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#3B82F6"
                            fill={`url(#gradient-${crypto.id})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default CryptoTracker;