import { useEffect, useState } from "react";
// import coinGeckoAPI from "../../services/coinGeckoAPI";
import useCryptoData from "../../hooks/useCryptoData";
import CryptoCard from "../CryptoCard/CryptoCard";

const CryptoTable =( {searchTerm} )=>{
    const [cryptoRes, setCryptoRes]= useState([]);
    const [err,setErr]=useState('');
    const {isLoading,isError,handleCoinGekcoApi} = useCryptoData ();

    useEffect(()=>{
        const loadCrypto = async()=>{
        const res= await handleCoinGekcoApi();
        if (!res){
            setErr("Could not fetch any crypto results")
        }
        setCryptoRes(res);
    }
    loadCrypto();
    },[])

    const handleSearch = ()=>{
        const c = cryptoRes.filter((cryptoName)=>cryptoName.name===searchTerm)
        setCryptoRes(c);
    }

    return (
        <div>
            {isError  && <div>{isError}</div>}
            <button onClick={handleSearch}>Click</button>
            {cryptoRes.length>0 && (
                <ol>
                    {cryptoRes.map((crypto,key)=>
                        (
                            <li key={key}>
                            <CryptoCard>
                                {crypto.name} - {crypto.current_price} AUD :   {crypto.market_cap}
                            </CryptoCard>
                            </li>
                        )
                    )}
                </ol>
            )}
        </div>
    )
}

export default CryptoTable