import { useEffect, useState } from "react";
// import coinGeckoAPI from "../../services/coinGeckoAPI";
import useCryptoData from "../../hooks/useCryptoData";
import CryptoCard from "../CryptoCard/CryptoCard";

const CryptoTable = ({searchTerm}) => {
    const [cryptoRes, setCryptoRes]= useState([]);
    const [err,setErr]=useState('');
    const [sortField, setSortField] = useState('market_cap');
    const [sortDirection, setSortDirection] = useState('desc');
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

    const handleSort = (fieldName) => {
    setSortField(fieldName);
    let sortedResult = [...cryptoRes];
    if (sortDirection === 'desc') {
        setSortDirection('asc');
        sortedResult.sort((a, b) => {
            if (typeof a[fieldName] === 'string') {
                return a[fieldName].localeCompare(b[fieldName]);
            }
            return a[fieldName] - b[fieldName];
        });
    } else {
        setSortDirection('desc');
        sortedResult.sort((a, b) => {
            if (typeof a[fieldName] === 'string') {
                return b[fieldName].localeCompare(a[fieldName]);
            }
            return b[fieldName] - a[fieldName];
        });
    }
    setCryptoRes(sortedResult);
};

    return (
        <div>
            {isError  && <div>{isError}</div>}
            <button onClick={handleSearch}>Click</button>
            <button onClick={()=>handleSort('name')}>Name</button>
            <button onClick={()=>handleSort('current_price')}>Price</button>
            <button onClick={()=>handleSort('market_cap')}>Market Cap</button>
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