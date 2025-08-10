import { useState, useEffect, useCallback } from 'react';

const usePriceChart = () => {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const [days, setDays] = useState(7);

    const fetchChartData = useCallback(async (coinId, days = 7, currency = 'aud') => {
        if (!coinId) return;
        
        setIsLoading(true);
        setIsError(null);
        
        try {
            // Use CoinGecko API with automatic granularity (better for 24h data)
            // For 24h (1 day): CoinGecko automatically uses 5-minutely data
            // For 2-90 days: hourly data, Over 90 days: daily data
            const baseEndpoint = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`;
            
            console.log(`Fetching chart data for ${coinId} - ${days} days`);
            
            // Try direct request first (in case CORS is configured)
            let response;
            try {
                response = await fetch(baseEndpoint);
                if (!response.ok) throw new Error('Direct request failed');
            } catch (directError) {
                console.log('Direct request failed, trying proxy...');
                
                // Use allorigins as the most reliable proxy
                const proxyEndpoint = `https://api.allorigins.win/get?url=${encodeURIComponent(baseEndpoint)}`;
                
                response = await fetch(proxyEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Proxy request failed. Status: ${response.status}`);
                }
            }
            
            const rawData = await response.json();
            
            // Handle proxy response format
            let data;
            if (rawData.contents) {
                // allorigins.win format - parse the JSON string
                data = JSON.parse(rawData.contents);
            } else {
                // Direct response format
                data = rawData;
            }
            
            // Validate and format data for recharts
            if (!data || !data.prices || !Array.isArray(data.prices) || data.prices.length === 0) {
                throw new Error(`No price data available for ${days} day${days === 1 ? '' : 's'}`);
            }
            
            const formattedData = data.prices.map(([timestamp, price], index) => ({
                timestamp,
                date: new Date(timestamp).toLocaleDateString(),
                time: new Date(timestamp).toLocaleTimeString(),
                price: parseFloat(price) || 0,
                volume: data.total_volumes?.[index]?.[1] ? parseFloat(data.total_volumes[index][1]) : 0,
                marketCap: data.market_caps?.[index]?.[1] ? parseFloat(data.market_caps[index][1]) : 0
            }));
            
            // Filter out invalid data points
            const validData = formattedData.filter(point => 
                point.price > 0 && 
                !isNaN(point.price) && 
                isFinite(point.price)
            );
            
            if (validData.length === 0) {
                throw new Error(`No valid price data found for ${days} day${days === 1 ? '' : 's'}`);
            }
            
            console.log(`Successfully loaded ${validData.length} data points for ${days} days`);
            setChartData(validData);
            setIsError(null);
            
        } catch (error) {
            console.error('Error fetching chart data:', error);
            const errorMessage = error.message.includes('Failed to fetch') 
                ? 'Unable to fetch chart data. Please check your internet connection.'
                : error.message;
            setIsError(errorMessage);
            setChartData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        chartData,
        isLoading,
        isError,
        days,
        setDays,
        fetchChartData
    };
};

export default usePriceChart;