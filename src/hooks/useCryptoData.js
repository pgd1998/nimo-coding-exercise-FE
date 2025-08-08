import { useState } from "react";
import coinGeckoApi from "../services/coinGeckoAPI";

const useCryptoData = ()=>{
    const [cryptoData,setCryptoData] = useState([]);
    const [isLoading, setIsLoading]=useState(false);
    const [isError,setIsError]= useState('');

    const handleCoinGekcoApi=async()=>{
    try {
        setIsLoading(true);
        setIsError('');
        const result = await coinGeckoApi();
        if (!result){
            setIsError("There was an error while fetching the crypto data")
        };
        return result;
    } catch (error) {
        setIsError("Server error in the hook");
        throw error;
    }
    finally{
        setIsLoading(false);
        setIsError('')
    }
}

return {isLoading,isError,handleCoinGekcoApi};
}

export default useCryptoData;