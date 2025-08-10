import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCryptoData from "../../hooks/useCryptoData";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import { formatPercentage, formatCurrency, formatLargeNumber } from "../../utils/formatters.jsx";
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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Card,
    CardContent,
    Chip,
    Avatar,
    Stack,
    useTheme,
    useMediaQuery,
    Skeleton
} from "@mui/material";


const CryptoTable = ({ searchTerm }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
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


    if (isLoading) {
        return <LoadingSkeleton />;
    }

    const renderMobileCard = (crypto, index) => (
        <Card 
            key={crypto.id} 
            sx={{ 
                mb: 2, 
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': { 
                    boxShadow: 3,
                    transform: 'translateY(-2px)' 
                },
                border: '1px solid',
                borderColor: 'divider'
            }}
            onClick={() => handleCryptoClick(crypto.id)}
        >
            <CardContent sx={{ pb: '16px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                            src={crypto.image} 
                            alt={crypto.name}
                            sx={{ width: 40, height: 40 }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                                {crypto.name}
                            </Typography>
                            <Chip 
                                label={crypto.symbol.toUpperCase()} 
                                size="small" 
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.75rem' }}
                            />
                        </Box>
                    </Box>
                    <Chip 
                        label={`#${crypto.market_cap_rank || ((currentPage - 1) * itemsPerPage + index + 1)}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            Price (AUD)
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {formatCurrency(crypto.current_price)}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                            24h Change
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {formatPercentage(crypto.price_change_percentage_24h)}
                        </Box>
                    </Box>
                </Box>
                
                <Stack direction="row" spacing={2} divider={<Box sx={{ width: 1, height: 20, bgcolor: 'divider' }} />}>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Market Cap (AUD)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatLargeNumber(crypto.market_cap)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Volume (AUD)
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {formatLargeNumber(crypto.total_volume)}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    const renderDesktopTable = () => (
        <TableContainer 
            component={Paper} 
            sx={{ 
                boxShadow: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                width: '100%'
            }}
        >
            <Table sx={{ 
                width: '100%',
                tableLayout: 'fixed'
            }} aria-label="cryptocurrency table">
                <TableHead sx={{ bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800' }}>
                    <TableRow>
                        <TableCell sx={{ 
                            fontWeight: 'bold', 
                            py: 2, 
                            width: '8%'
                        }}>
                            #
                        </TableCell>
                        <TableCell sx={{ 
                            fontWeight: 'bold', 
                            py: 2,
                            width: '25%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('name') !== false}
                                direction={getSortDirection('name') || 'desc'}
                                onClick={() => handleSort('name')}
                            >
                                Name
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            py: 2,
                            width: '15%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('current_price') !== false}
                                direction={getSortDirection('current_price') || 'desc'}
                                onClick={() => handleSort('current_price')}
                            >
                                Price (AUD)
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            py: 2, 
                            display: { xs: 'none', md: 'table-cell' },
                            width: '10%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('price_change_percentage_1h_in_currency') !== false}
                                direction={getSortDirection('price_change_percentage_1h_in_currency') || 'desc'}
                                onClick={() => handleSort('price_change_percentage_1h_in_currency')}
                            >
                                1h
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            py: 2,
                            width: '10%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('price_change_percentage_24h') !== false}
                                direction={getSortDirection('price_change_percentage_24h') || 'desc'}
                                onClick={() => handleSort('price_change_percentage_24h')}
                            >
                                24h
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            py: 2, 
                            display: { xs: 'none', lg: 'table-cell' },
                            width: '10%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('price_change_percentage_7d_in_currency') !== false}
                                direction={getSortDirection('price_change_percentage_7d_in_currency') || 'desc'}
                                onClick={() => handleSort('price_change_percentage_7d_in_currency')}
                            >
                                7d
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            py: 2, 
                            display: { xs: 'none', md: 'table-cell' },
                            width: '12%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('total_volume') !== false}
                                direction={getSortDirection('total_volume') || 'desc'}
                                onClick={() => handleSort('total_volume')}
                            >
                                Volume (AUD)
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right" sx={{ 
                            fontWeight: 'bold', 
                            py: 2,
                            width: '10%'
                        }}>
                            <TableSortLabel
                                active={getSortDirection('market_cap') !== false}
                                direction={getSortDirection('market_cap') || 'desc'}
                                onClick={() => handleSort('market_cap')}
                            >
                                Market Cap (AUD)
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
                                    '&:hover': { 
                                        backgroundColor: 'action.hover', 
                                        cursor: 'pointer' 
                                    },
                                    '&:nth-of-type(even)': { 
                                        backgroundColor: 'grey.25' 
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                onClick={() => handleCryptoClick(crypto.id)}
                            >
                                <TableCell sx={{ 
                                    py: 2,
                                    width: '8%',
                                    overflow: 'hidden'
                                }}>
                                    <Chip 
                                        label={crypto.market_cap_rank || ((currentPage - 1) * itemsPerPage + index + 1)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontWeight: 600, minWidth: 30, fontSize: '0.75rem' }}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ 
                                    py: 2,
                                    width: '25%',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                        <Avatar 
                                            src={crypto.image} 
                                            alt={crypto.name}
                                            sx={{ width: 28, height: 28, flexShrink: 0 }}
                                        />
                                        <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    color: 'primary.main',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {crypto.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {crypto.symbol.toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    py: 2,
                                    width: '15%'
                                }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {formatCurrency(crypto.current_price)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    py: 2, 
                                    display: { xs: 'none', md: 'table-cell' },
                                    width: '10%'
                                }}>
                                    {formatPercentage(crypto.price_change_percentage_1h_in_currency)}
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    py: 2,
                                    width: '10%'
                                }}>
                                    {formatPercentage(crypto.price_change_percentage_24h)}
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    py: 2, 
                                    display: { xs: 'none', lg: 'table-cell' },
                                    width: '10%'
                                }}>
                                    {formatPercentage(crypto.price_change_percentage_7d_in_currency)}
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    py: 2, 
                                    display: { xs: 'none', md: 'table-cell' },
                                    width: '12%'
                                }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {formatLargeNumber(crypto.total_volume)}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right" sx={{ 
                                    py: 2,
                                    width: '10%'
                                }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {formatLargeNumber(crypto.market_cap)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                <Typography variant="h6" color="text.secondary">
                                    {isSearching ? 'No search results found' : 'No cryptocurrency data available'}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
            {isError && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        mb: 3, 
                        borderRadius: 2,
                        boxShadow: 1 
                    }}
                >
                    {isError}
                </Alert>
            )}

            {/* Mobile Card View */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                {cryptoData.length > 0 ? (
                    cryptoData.map((crypto, index) => renderMobileCard(crypto, index))
                ) : (
                    <Card sx={{ textAlign: 'center', py: 4, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="h6" color="text.secondary">
                                {isSearching ? 'No search results found' : 'No cryptocurrency data available'}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* Desktop Table View */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                {renderDesktopTable()}
            </Box>

            {/* Pagination and Controls */}
            {!isSearching && cryptoData.length > 0 && (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    gap: 3,
                    mt: 4,
                    p: 2,
                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Items per page</InputLabel>
                        <Select
                            value={itemsPerPage}
                            label="Items per page"
                            onChange={handleItemsPerPageChange}
                            sx={{ bgcolor: 'background.paper' }}
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
                        size={isMobile ? "medium" : "large"}
                        showFirstButton
                        showLastButton
                        sx={{
                            '& .MuiPagination-ul': {
                                flexWrap: 'wrap'
                            },
                            '& .MuiPaginationItem-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    
                    <Box sx={{ 
                        minWidth: { xs: 0, sm: 120 },
                        display: { xs: 'none', sm: 'block' }
                    }} />
                </Box>
            )}
        </Box>
    );
};

export default CryptoTable;