const BASE_URL = import.meta.env.DEV ? '/api' : 'https://api.coingecko.com/api/v3';

const defaultOptions = {
    method: "GET",
    headers: {
        accept: 'application/json', 
        'x-cg-demo-api-key': import.meta.env.VITE_API_KEY
    }
};

const coinGeckoApi = async (params = {}) => {
    const {
        vs_currency = 'aud',
        order = 'market_cap_desc',
        per_page = 25,
        page = 1,
        sparkline = false,
        price_change_percentage = '1h,24h,7d',
        ids = null,
        names = null
    } = params;

    const queryParams = new URLSearchParams({
        vs_currency,
        order,
        per_page: per_page.toString(),
        page: page.toString(),
        sparkline: sparkline.toString(),
        price_change_percentage
    });

    if (ids) {
        queryParams.append('ids', ids);
    }
    
    if (names) {
        queryParams.append('names', encodeURIComponent(names));
    }

    const url = `${BASE_URL}/coins/markets?${queryParams.toString()}`;

    try {
        const res = await fetch(url, defaultOptions);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('CoinGecko API Error:', error);
        throw error;
    }
};

const searchCoinsByName = async (searchTerm) => {
    const url = `${BASE_URL}/search?query=${encodeURIComponent(searchTerm)}`;
    
    try {
        const res = await fetch(url, defaultOptions);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('CoinGecko Search API Error:', error);
        throw error;
    }
};

const getCoinById = async (coinId, options = {}) => {
    const {
        localization = 'false',
        tickers = 'false',
        market_data = 'true',
        community_data = 'true',
        developer_data = 'true',
        sparkline = 'false'
    } = options;

    const queryParams = new URLSearchParams({
        localization,
        tickers,
        market_data,
        community_data,
        developer_data,
        sparkline
    });

    const url = `${BASE_URL}/coins/${coinId}?${queryParams.toString()}`;

    try {
        const res = await fetch(url, defaultOptions);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const result = await res.json();
        return result;
    } catch (error) {
        console.error('CoinGecko Coin Detail API Error:', error);
        throw error;
    }
};

export { coinGeckoApi as default, searchCoinsByName, getCoinById };