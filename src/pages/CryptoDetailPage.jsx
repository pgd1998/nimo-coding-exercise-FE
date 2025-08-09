import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCoinDetail from "../hooks/useCoinDetail";
import LoadingSkeleton from "../components/LoadingSkeleton/LoadingSkeleton";
import { 
    Container, 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    Avatar, 
    Chip, 
    Button,
    Alert,
    Card,
    CardContent,
    Divider,
    Link,
    Tabs,
    Tab,
    Stack,
    LinearProgress,
    IconButton,
    Tooltip,
    Badge
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import RedditIcon from '@mui/icons-material/Reddit';
import TelegramIcon from '@mui/icons-material/Telegram';
import CodeIcon from '@mui/icons-material/Code';
import PeopleIcon from '@mui/icons-material/People';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const CryptoDetailPage = () => {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const { coinDetail, isLoading, isError, fetchCoinDetail } = useCoinDetail();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (coinId) {
            fetchCoinDetail(coinId);
        }
    }, [coinId, fetchCoinDetail]);

    const handleBackClick = () => {
        navigate('/');
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 8
        }).format(price);
    };

    const formatPercentage = (percentage) => {
        if (typeof percentage !== 'number') return 'N/A';
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
                    sx={{ color: isPositive ? 'success.main' : 'error.main' }}
                >
                    {Math.abs(percentage).toFixed(2)}%
                </Typography>
            </Box>
        );
    };

    const formatMarketCap = (value) => {
        if (!value) return 'N/A';
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
        return `$${value.toLocaleString()}`;
    };

    const formatSupply = (value, symbol) => {
        if (!value) return 'N/A';
        const formatted = value.toLocaleString();
        return symbol ? `${formatted} ${symbol.toUpperCase()}` : formatted;
    };

    const formatScore = (value) => {
        if (typeof value !== 'number') return 'N/A';
        return `${value.toFixed(1)}/10`;
    };

    const formatDeveloperActivity = (value) => {
        if (typeof value !== 'number') return 'N/A';
        if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
        return value.toLocaleString();
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <LoadingSkeleton />
                </Box>
            </Container>
        );
    }

    if (isError || !coinDetail) {
        return (
            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={handleBackClick}
                        sx={{ mb: 2 }}
                    >
                        Back to Market
                    </Button>
                    <Alert severity="error">
                        {isError || 'Cryptocurrency not found'}
                    </Alert>
                </Box>
            </Container>
        );
    }

    const marketData = coinDetail.market_data || {};
    const links = coinDetail.links || {};
    const communityData = coinDetail.community_data || {};
    const developerData = coinDetail.developer_data || {};

    return (
        <Container maxWidth="xl">
            <Box sx={{ py: 3 }}>
                {/* Navigation Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={handleBackClick}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Back to Market
                    </Button>
                    <Stack direction="row" spacing={1}>
                        <Tooltip title="Add to Watchlist">
                            <IconButton color="primary">
                                <StarOutlineIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Share">
                            <IconButton color="primary">
                                <ShareIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Bookmark">
                            <IconButton color="primary">
                                <BookmarkBorderIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Box>

                {/* Modern Header Section */}
                <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} lg={8}>
                                {/* Coin Info */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 4 }}>
                                    <Avatar 
                                        src={coinDetail.image?.large || coinDetail.image?.small} 
                                        alt={coinDetail.name}
                                        sx={{ width: 80, height: 80 }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                                                {coinDetail.name}
                                            </Typography>
                                            <Chip 
                                                label={coinDetail.symbol?.toUpperCase()} 
                                                size="medium"
                                                sx={{ 
                                                    bgcolor: 'grey.100', 
                                                    color: 'grey.700',
                                                    fontWeight: 600
                                                }}
                                            />
                                            <Badge 
                                                badgeContent={`#${coinDetail.market_cap_rank || 'N/A'}`}
                                                color="primary"
                                                sx={{ 
                                                    '& .MuiBadge-badge': { 
                                                        position: 'static', 
                                                        transform: 'none',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600
                                                    }
                                                }}
                                            />
                                        </Box>
                                        
                                        {/* Price Section */}
                                        <Box sx={{ mb: 3 }}>
                                            <Typography 
                                                variant="h2" 
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    color: 'text.primary',
                                                    mb: 1
                                                }}
                                            >
                                                {formatPrice(marketData.current_price?.aud)}
                                            </Typography>
                                            <Stack direction="row" spacing={3} alignItems="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {formatPercentage(marketData.price_change_percentage_24h)}
                                                    <Typography variant="body2" color="text.secondary">
                                                        24h
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {formatPercentage(marketData.price_change_percentage_7d)}
                                                    <Typography variant="body2" color="text.secondary">
                                                        7d
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {formatPercentage(marketData.price_change_percentage_30d)}
                                                    <Typography variant="body2" color="text.secondary">
                                                        30d
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </Box>

                                        {/* Quick Stats */}
                                        <Grid container spacing={3}>
                                            <Grid item xs={6} sm={3}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                        Market Cap
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {formatMarketCap(marketData.market_cap?.aud)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                        24h Volume
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {formatMarketCap(marketData.total_volume?.aud)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                        Circulating
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {formatSupply(marketData.circulating_supply)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6} sm={3}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                        All-Time High
                                                    </Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        {formatPrice(marketData.ath?.aud)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>
                            
                            <Grid item xs={12} lg={4}>
                                {/* Chart Placeholder */}
                                <Card 
                                    elevation={0} 
                                    sx={{ 
                                        height: 280,
                                        bgcolor: 'grey.50',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '2px dashed',
                                        borderColor: 'grey.300'
                                    }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <ShowChartIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                                        <Typography variant="h6" color="grey.600">
                                            Price Chart
                                        </Typography>
                                        <Typography variant="body2" color="grey.500">
                                            Interactive chart coming soon
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Tabbed Navigation */}
                <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={(_, newValue) => setActiveTab(newValue)}
                            sx={{ px: 3, pt: 2 }}
                        >
                            <Tab label="Overview" />
                            <Tab label="Markets" />
                            <Tab label="About" />
                        </Tabs>
                    </Box>

                    {/* Tab Content */}
                    <Box sx={{ p: 4 }}>
                        {/* Overview Tab */}
                        {activeTab === 0 && (
                            <Box>
                                {/* Market Statistics */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Market Statistics
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Market Cap</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatMarketCap(marketData.market_cap?.aud)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">24h Volume</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatMarketCap(marketData.total_volume?.aud)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Circulating Supply</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {marketData.circulating_supply?.toLocaleString() || 'N/A'}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">Max Supply</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {marketData.max_supply?.toLocaleString() || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Price Statistics
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">All-Time High</Typography>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                            {formatPrice(marketData.ath?.aud)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {marketData.ath_date?.aud ? 
                                                                new Date(marketData.ath_date.aud).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">All-Time Low</Typography>
                                                    <Box sx={{ textAlign: 'right' }}>
                                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                            {formatPrice(marketData.atl?.aud)}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {marketData.atl_date?.aud ? 
                                                                new Date(marketData.atl_date.aud).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography color="text.secondary">24h High</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatPrice(marketData.high_24h?.aud)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">24h Low</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatPrice(marketData.low_24h?.aud)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Performance & Supply Details */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={4}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Performance
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">30d Change</Typography>
                                                    {formatPercentage(marketData.price_change_percentage_30d)}
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">60d Change</Typography>
                                                    {formatPercentage(marketData.price_change_percentage_60d)}
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">200d Change</Typography>
                                                    {formatPercentage(marketData.price_change_percentage_200d)}
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">1y Change</Typography>
                                                    {formatPercentage(marketData.price_change_percentage_1y)}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Supply Details
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Total Supply</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatSupply(marketData.total_supply, coinDetail.symbol)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Fully Diluted Valuation</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatMarketCap(marketData.fully_diluted_valuation?.aud)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Market Cap Rank</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        #{coinDetail.market_cap_rank || 'N/A'}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">CoinGecko Rank</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        #{coinDetail.coingecko_rank || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <TrendingFlatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Scores & Ratings
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">CoinGecko Score</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatScore(coinDetail.coingecko_score)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Developer Score</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatScore(coinDetail.developer_score)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Community Score</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatScore(coinDetail.community_score)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">Liquidity Score</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatScore(coinDetail.liquidity_score)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Key Metrics Overview */}
                                <Card elevation={2}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Key Market Metrics
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {formatMarketCap(marketData.market_cap?.aud)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Market Cap
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {formatMarketCap(marketData.total_volume?.aud)}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        24h Volume
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: marketData.market_cap_change_percentage_24h >= 0 ? 'success.main' : 'error.main', color: 'white', borderRadius: 2 }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {marketData.market_cap_change_percentage_24h ? 
                                                            `${marketData.market_cap_change_percentage_24h > 0 ? '+' : ''}${marketData.market_cap_change_percentage_24h.toFixed(2)}%` 
                                                            : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        24h Market Cap Change
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6} md={3}>
                                                <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'info.main', color: 'white', borderRadius: 2 }}>
                                                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                                        {marketData.circulating_supply ? 
                                                            `${((marketData.circulating_supply / (marketData.max_supply || marketData.total_supply || marketData.circulating_supply)) * 100).toFixed(1)}%`
                                                            : 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        Circulating Supply %
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}

                        {/* Markets Tab */}
                        {activeTab === 1 && (
                            <Box>
                                {/* Trading Information */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <SwapHorizIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Trading Information
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Current Price</Typography>
                                                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                        {formatPrice(marketData.current_price?.aud)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">24h Trading Volume</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatMarketCap(marketData.total_volume?.aud)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Volume/Market Cap</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {marketData.total_volume?.aud && marketData.market_cap?.aud ?
                                                            `${((marketData.total_volume.aud / marketData.market_cap.aud) * 100).toFixed(2)}%` : 'N/A'}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">Market Dominance</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {marketData.market_cap_change_percentage_24h ? 
                                                            `${marketData.market_cap_change_percentage_24h.toFixed(3)}%` : 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <AccountBalanceWalletIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Supply Information
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ mb: 3 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography color="text.secondary">Circulating Supply</Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                            {formatSupply(marketData.circulating_supply, coinDetail.symbol)}
                                                        </Typography>
                                                    </Box>
                                                    {marketData.circulating_supply && marketData.max_supply && (
                                                        <LinearProgress 
                                                            variant="determinate" 
                                                            value={(marketData.circulating_supply / marketData.max_supply) * 100}
                                                            sx={{ height: 8, borderRadius: 4 }}
                                                        />
                                                    )}
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Total Supply</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatSupply(marketData.total_supply, coinDetail.symbol)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">Max Supply</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatSupply(marketData.max_supply, coinDetail.symbol)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Price History */}
                                <Card elevation={2}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Price Performance History
                                        </Typography>
                                        <Divider sx={{ mb: 3 }} />
                                        
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                                        1 Hour
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {formatPercentage(marketData.price_change_percentage_1h_in_currency)}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                                        24 Hours
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {formatPercentage(marketData.price_change_percentage_24h)}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                                        7 Days
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {formatPercentage(marketData.price_change_percentage_7d_in_currency)}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                                        30 Days
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {formatPercentage(marketData.price_change_percentage_30d)}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6} md={4}>
                                                <Box sx={{ textAlign: 'center', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                                                        1 Year
                                                    </Typography>
                                                    <Box sx={{ mt: 1 }}>
                                                        {formatPercentage(marketData.price_change_percentage_1y)}
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}

                        {/* About Tab */}
                        {activeTab === 2 && (
                            <Box>
                                {/* Community & Developer Stats */}
                                <Grid container spacing={3} sx={{ mb: 4 }}>
                                    <Grid item xs={12} md={6}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Community Stats
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Facebook Likes</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(communityData.facebook_likes)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Twitter Followers</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(communityData.twitter_followers)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Reddit Subscribers</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(communityData.reddit_subscribers)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">Telegram Users</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(communityData.telegram_channel_user_count)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card elevation={2} sx={{ height: '100%' }}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    <CodeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                    Developer Activity
                                                </Typography>
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Forks</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(developerData.forks)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Stars</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(developerData.stars)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                                    <Typography color="text.secondary">Subscribers</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(developerData.subscribers)}
                                                    </Typography>
                                                </Box>
                                                
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography color="text.secondary">Total Issues</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                        {formatDeveloperActivity(developerData.total_issues)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                {/* Description */}
                                {coinDetail.description?.en && (
                                    <Card elevation={2} sx={{ mb: 4 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                <InfoOutlinedIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                                About {coinDetail.name}
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />
                                            <Typography 
                                                variant="body1" 
                                                sx={{ lineHeight: 1.7 }}
                                                dangerouslySetInnerHTML={{ __html: coinDetail.description.en.slice(0, 1000) + '...' }}
                                            />
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Links & Resources */}
                                <Card elevation={2}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Links & Resources
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {links.homepage?.[0] && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<LanguageIcon />}
                                                    component={Link}
                                                    href={links.homepage[0]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                >
                                                    Website
                                                </Button>
                                            )}
                                            
                                            {links.twitter_screen_name && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<TwitterIcon />}
                                                    component={Link}
                                                    href={`https://twitter.com/${links.twitter_screen_name}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                >
                                                    Twitter
                                                </Button>
                                            )}
                                            
                                            {links.repos_url?.github?.[0] && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<GitHubIcon />}
                                                    component={Link}
                                                    href={links.repos_url.github[0]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                >
                                                    GitHub
                                                </Button>
                                            )}
                                            
                                            {links.subreddit_url && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<RedditIcon />}
                                                    component={Link}
                                                    href={links.subreddit_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                >
                                                    Reddit
                                                </Button>
                                            )}
                                            
                                            {links.telegram_channel_identifier && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<TelegramIcon />}
                                                    component={Link}
                                                    href={`https://t.me/${links.telegram_channel_identifier}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                >
                                                    Telegram
                                                </Button>
                                            )}
                                            
                                            {links.blockchain_site?.[0] && (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<LanguageIcon />}
                                                    component={Link}
                                                    href={links.blockchain_site[0]}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    size="small"
                                                >
                                                    Explorer
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Box>
        </Container>
    );
};

export default CryptoDetailPage;