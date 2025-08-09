import { useState, useCallback } from "react";
import coinGeckoApi, { searchCoinsByName } from "../services/coinGeckoAPI";

const useCryptoData = () => {
    const [cryptoData, setCryptoData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState('');

    const fetchCryptoData = useCallback(async (params = {}) => {
        try {
            setIsLoading(true);
            setIsError('');
            const result = await coinGeckoApi(params);
            if (!result) {
                setIsError("There was an error while fetching the crypto data");
                setCryptoData([]);
                return;
            }
            setCryptoData(result);
        } catch (error) {
            setIsError("Server error while fetching crypto data");
            console.error(error);
            setCryptoData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchCrypto = useCallback(async (searchTerm) => {
        try {
            setIsLoading(true);
            setIsError('');
            const searchResult = await searchCoinsByName(searchTerm);
            if (searchResult?.coins?.length > 0) {
                const coinIds = searchResult.coins.slice(0, 20).map(coin => coin.id).join(',');
                const result = await coinGeckoApi({ ids: coinIds });
                setCryptoData(result || []);
            } else {
                setCryptoData([]);
            }
        } catch (error) {
            setIsError("Server error while searching crypto");
            console.error(error);
            setCryptoData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { 
        isLoading, 
        isError, 
        fetchCryptoData, 
        searchCrypto,
        cryptoData,
        setCryptoData
    };
};

export default useCryptoData;