import { useState, useCallback } from "react";
import { getCoinById } from "../services/coinGeckoAPI";

const useCoinDetail = () => {
    const [coinDetail, setCoinDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState('');

    const fetchCoinDetail = useCallback(async (coinId, options = {}) => {
        try {
            setIsLoading(true);
            setIsError('');
            setCoinDetail(null);
            
            const result = await getCoinById(coinId, options);
            if (!result) {
                setIsError("Could not fetch cryptocurrency details");
                return null;
            }
            
            setCoinDetail(result);
            return result;
        } catch (error) {
            setIsError("Error fetching cryptocurrency details");
            console.error(error);
            setCoinDetail(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearCoinDetail = useCallback(() => {
        setCoinDetail(null);
        setIsError('');
        setIsLoading(false);
    }, []);

    return { 
        coinDetail, 
        isLoading, 
        isError, 
        fetchCoinDetail,
        clearCoinDetail
    };
};

export default useCoinDetail;