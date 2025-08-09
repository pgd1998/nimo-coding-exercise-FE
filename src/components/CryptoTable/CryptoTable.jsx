import { useEffect, useState } from "react";
// import coinGeckoAPI from "../../services/coinGeckoAPI";
import useCryptoData from "../../hooks/useCryptoData";
import CryptoCard from "../CryptoCard/CryptoCard";
import { Pagination } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const CryptoTable = ({searchTerm}) => {
    const [cryptoRes, setCryptoRes]= useState([]);
    const [err,setErr]=useState('');
    const [sortField, setSortField] = useState('market_cap');
    const [sortDirection, setSortDirection] = useState('desc');
    const {isLoading,isError,handleCoinGekcoApi} = useCryptoData ();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20); 


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

        const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
        };

        const handlePrevPage = () => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
        };

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = cryptoRes.slice(startIndex, endIndex);

    return (
        <div>
            {isError  && <div>{isError}</div>}
            <button onClick={handleSearch}>Click</button>
            <button onClick={()=>handleSort('name')}>Name</button>
            <button onClick={()=>handleSort('current_price')}>Price</button>
            <button onClick={()=>handleSort('market_cap')}>Market Cap</button>
            {  currentPage>1 &&
            <button onClick={handlePrevPage}>Prev</button>
            }
            <div>{currentPage}</div>
            <button onClick={handleNextPage}>Next</button>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={()=>handleSort('name')}>Name</TableCell>
                            <TableCell align="right">Price AUD</TableCell>
                            <TableCell align="right">Market Cap</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.length>0 && 
                                paginatedData.map((crypto,key)=>
                                    (
                                        <TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                                        
                                        <TableCell component="th" scope="row">
                {crypto.name}
              </TableCell>
               <TableCell align="right">{crypto.current_price}</TableCell>
              <TableCell align="right">{crypto.market_cap}</TableCell>
              {/*<TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell> */}
                                        </TableRow>
                                    )
                                )
                        }
                        </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={10} />
        </div>
    )
}

export default CryptoTable