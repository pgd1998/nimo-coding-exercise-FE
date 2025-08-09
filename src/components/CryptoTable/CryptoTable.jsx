import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCryptoData from "../../hooks/useCryptoData";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import { 
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Box,
    Alert,
    Button
} from "@mui/material";

const CryptoTable = ({ searchTerm }) => {
    const navigate = useNavigate();
    const { isLoading, isError, fetchCryptoData, searchCrypto, cryptoData, setCryptoData } = useCryptoData();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [sortOrder] = useState('market_cap_desc');
    const [totalPages] = useState(250); // CoinGecko has ~10000 coins, so 250 pages max for 20 per page
    const [isSearching, setIsSearching] = useState(false);
    const [sortField, setSortField] = useState('market_cap');
    const [sortDirection, setSortDirection] = useState('desc');

    // Load data when not searching
    useEffect(() => {
        if (!searchTerm || searchTerm.trim() === '') {
            setIsSearching(false);
            fetchCryptoData({
                page: currentPage,
                per_page: itemsPerPage,
                order: sortOrder
            });
        }
    }, [searchTerm, currentPage, sortOrder, fetchCryptoData, itemsPerPage]);

    // Handle search with debounce
    useEffect(() => {
        if (!searchTerm || searchTerm.trim() === '') {
            return;
        }

        setIsSearching(true);
        setCurrentPage(1);
        
        const debounceTimer = setTimeout(() => {
            searchCrypto(searchTerm);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, searchCrypto]);

    const handleSort = (field) => {
        // Determine new sort direction
        const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortField(field);
        setSortDirection(newDirection);

        // Client-side sorting for current page data
        const sortedData = [...cryptoData].sort((a, b) => {
            let aValue = a[field];
            let bValue = b[field];
            
            // Handle different data types
            if (field === 'name') {
                aValue = aValue?.toLowerCase() || '';
                bValue = bValue?.toLowerCase() || '';
            }
            
            // Numeric sorting
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return newDirection === 'desc' ? bValue - aValue : aValue - bValue;
            }
            
            // String sorting
            if (newDirection === 'desc') {
                return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });

        setCryptoData(sortedData);
    };

    const handlePageChange = (_, value) => {
        setCurrentPage(value);
    };

    const getSortDirection = (field) => {
        if (sortField === field) {
            return sortDirection;
        }
        return false;
    };

    const handleCryptoClick = (coinId) => {
        navigate(`/crypto/${coinId}`);
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <Box>
            {isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {isError}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="cryptocurrency table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={getSortDirection('name') !== false}
                                    direction={getSortDirection('name') || 'desc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={getSortDirection('current_price') !== false}
                                    direction={getSortDirection('current_price') || 'desc'}
                                    onClick={() => handleSort('current_price')}
                                >
                                    Price (AUD)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={getSortDirection('market_cap') !== false}
                                    direction={getSortDirection('market_cap') || 'desc'}
                                    onClick={() => handleSort('market_cap')}
                                >
                                    Market Cap
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cryptoData.length > 0 ? (
                            cryptoData.map((crypto) => (
                                <TableRow
                                    key={crypto.id}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' }
                                    }}
                                    onClick={() => handleCryptoClick(crypto.id)}
                                >
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img 
                                                src={crypto.image} 
                                                alt={crypto.name}
                                                width="24"
                                                height="24"
                                                style={{ borderRadius: '50%' }}
                                            />
                                            <Button
                                                variant="text"
                                                color="primary"
                                                sx={{ 
                                                    justifyContent: 'flex-start',
                                                    textTransform: 'none',
                                                    fontWeight: 'normal',
                                                    '&:hover': { backgroundColor: 'transparent' }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCryptoClick(crypto.id);
                                                }}
                                            >
                                                {crypto.name} ({crypto.symbol.toUpperCase()})
                                            </Button>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        ${crypto.current_price?.toLocaleString() || 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">
                                        ${crypto.market_cap?.toLocaleString() || 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    {isSearching ? 'No search results found' : 'No cryptocurrency data available'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!isSearching && cryptoData.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination 
                        count={Math.min(totalPages, 250)} 
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
};

export default CryptoTable;