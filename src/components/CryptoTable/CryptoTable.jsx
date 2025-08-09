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
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const CryptoTable = ({ searchTerm }) => {
    const navigate = useNavigate();
    const { isLoading, isError, fetchCryptoData, searchCrypto, cryptoData, setCryptoData } = useCryptoData();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [sortOrder] = useState('market_cap_desc');
    const [totalPages] = useState(250); // CoinGecko has ~10000+ coins
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

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(event.target.value);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const formatPercentage = (percentage) => {
        if (typeof percentage !== 'number' || isNaN(percentage)) return 'N/A';
        const isPositive = percentage >= 0;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {isPositive ? (
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 16 }} />
                ) : (
                    <TrendingDownIcon sx={{ color: 'error.main', fontSize: 16 }} />
                )}
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: isPositive ? 'success.main' : 'error.main',
                        fontWeight: 'medium'
                    }}
                >
                    {isPositive ? '+' : ''}{percentage.toFixed(2)}%
                </Typography>
            </Box>
        );
    };

    const formatCurrency = (value, currency = 'AUD') => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(value);
    };

    const formatLargeNumber = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
        return `$${value.toFixed(2)}`;
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

            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: { xs: 800, md: 1200 } }} aria-label="cryptocurrency table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={getSortDirection('name') !== false}
                                    direction={getSortDirection('name') || 'desc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={getSortDirection('current_price') !== false}
                                    direction={getSortDirection('current_price') || 'desc'}
                                    onClick={() => handleSort('current_price')}
                                >
                                    Price
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>
                                <TableSortLabel
                                    active={getSortDirection('price_change_percentage_1h_in_currency') !== false}
                                    direction={getSortDirection('price_change_percentage_1h_in_currency') || 'desc'}
                                    onClick={() => handleSort('price_change_percentage_1h_in_currency')}
                                >
                                    1h %
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                <TableSortLabel
                                    active={getSortDirection('price_change_percentage_24h') !== false}
                                    direction={getSortDirection('price_change_percentage_24h') || 'desc'}
                                    onClick={() => handleSort('price_change_percentage_24h')}
                                >
                                    24h %
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', display: { xs: 'none', lg: 'table-cell' } }}>
                                <TableSortLabel
                                    active={getSortDirection('price_change_percentage_7d_in_currency') !== false}
                                    direction={getSortDirection('price_change_percentage_7d_in_currency') || 'desc'}
                                    onClick={() => handleSort('price_change_percentage_7d_in_currency')}
                                >
                                    7d %
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', display: { xs: 'none', md: 'table-cell' } }}>
                                <TableSortLabel
                                    active={getSortDirection('total_volume') !== false}
                                    direction={getSortDirection('total_volume') || 'desc'}
                                    onClick={() => handleSort('total_volume')}
                                >
                                    Volume (24h)
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
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
                            cryptoData.map((crypto, index) => (
                                <TableRow
                                    key={crypto.id}
                                    sx={{ 
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' }
                                    }}
                                    onClick={() => handleCryptoClick(crypto.id)}
                                >
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {crypto.market_cap_rank || ((currentPage - 1) * itemsPerPage + index + 1)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img 
                                                src={crypto.image} 
                                                alt={crypto.name}
                                                width="24"
                                                height="24"
                                                style={{ borderRadius: '50%' }}
                                            />
                                            <Box>
                                                <Button
                                                    variant="text"
                                                    color="primary"
                                                    sx={{ 
                                                        justifyContent: 'flex-start',
                                                        textTransform: 'none',
                                                        fontWeight: 'medium',
                                                        fontSize: '0.875rem',
                                                        minWidth: 0,
                                                        p: 0,
                                                        '&:hover': { backgroundColor: 'transparent' }
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCryptoClick(crypto.id);
                                                    }}
                                                >
                                                    {crypto.name}
                                                </Button>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    {crypto.symbol.toUpperCase()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {formatCurrency(crypto.current_price)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {formatPercentage(crypto.price_change_percentage_24h)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                                        {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                                        <Typography variant="body2">
                                            {formatLargeNumber(crypto.total_volume)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                            {formatLargeNumber(crypto.market_cap)}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    {isSearching ? 'No search results found' : 'No cryptocurrency data available'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!isSearching && cryptoData.length > 0 && (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: 2,
                    mt: 3 
                }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Per page</InputLabel>
                        <Select
                            value={itemsPerPage}
                            label="Per page"
                            onChange={handleItemsPerPageChange}
                        >
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                            <MenuItem value={75}>75</MenuItem>
                            <MenuItem value={100}>100</MenuItem>
                        </Select>
                    </FormControl>
                    
                    <Pagination 
                        count={Math.min(totalPages, 250)} 
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                            '& .MuiPagination-ul': {
                                flexWrap: 'wrap'
                            }
                        }}
                    />
                    
                    <Box sx={{ minWidth: { xs: 0, sm: 120 } }} /> {/* Spacer to center pagination on desktop */}
                </Box>
            )}
        </Box>
    );
};

export default CryptoTable;