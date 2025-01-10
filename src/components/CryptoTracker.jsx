import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Settings } from "lucide-react";
import { AreaChart, Area, YAxis, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";

const CryptoTracker = () => {
  const API_KEY = '681e644fee8fa6f8bce5a145e930b1fb39174b7d58b43636c1758a6b2256dd63';
  const [searchQuery, setSearchQuery] = useState('');
  const [cryptos, setCryptos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceHistory, setPriceHistory] = useState({});

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

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
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
                  filteredCryptos.map((crypto) => (
                    <div
                      key={crypto.id}
                      className="bg-[#081b29] rounded-lg shadow-sm hover:shadow-lg transition-shadow p-4"
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
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
  );
};

export default CryptoTracker;