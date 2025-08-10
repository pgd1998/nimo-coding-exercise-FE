import { useState } from "react";
import { 
    Box, 
    Typography, 
    Grid, 
    Avatar, 
    Chip, 
    Button,
    Card,
    CardContent,
    Divider,
    Link,
    Tabs,
    Tab,
    Stack,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    Fade,
    Grow,
    Zoom,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import PriceChart from '../PriceChart/PriceChart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SecurityIcon from '@mui/icons-material/Security';
import GroupIcon from '@mui/icons-material/Group';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const CryptoDetails = ({ coinDetail, onBackClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [activeTab, setActiveTab] = useState(0);

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
                    sx={{ color: isPositive ? 'success.main' : 'error.main', fontWeight: 600 }}
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

    const marketData = coinDetail.market_data || {};
    const links = coinDetail.links || {};
    const developerData = coinDetail.developer_data || {};
    const communityData = coinDetail.community_data || {};

    return (
        <Fade in timeout={800}>
            <Box sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
                {/* Navigation Bar */}
                <Grow in timeout={600}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'stretch', sm: 'center' }, 
                        gap: { xs: 2, sm: 0 },
                        mb: { xs: 2, sm: 3, md: 4 }
                    }}>
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={onBackClick}
                            variant="outlined"
                            size={isMobile ? "medium" : "large"}
                            sx={{ 
                                borderRadius: 2,
                                px: { xs: 2, sm: 3 },
                                py: { xs: 1, sm: 1.5 },
                                fontWeight: 600,
                                alignSelf: { xs: 'flex-start', sm: 'auto' }
                            }}
                        >
                            Back to Market
                        </Button>
                        <Stack 
                            direction="row" 
                            spacing={1}
                            sx={{ 
                                alignSelf: { xs: 'flex-end', sm: 'auto' },
                                justifyContent: { xs: 'center', sm: 'flex-end' }
                            }}
                        >
                            <Tooltip title="Add to Watchlist">
                                <IconButton 
                                    color="primary" 
                                    size={isMobile ? "medium" : "large"}
                                    sx={{ 
                                        bgcolor: 'action.hover',
                                        '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <StarOutlineIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Share">
                                <IconButton 
                                    color="primary"
                                    size={isMobile ? "medium" : "large"}
                                    sx={{ 
                                        bgcolor: 'action.hover',
                                        '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <ShareIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Bookmark">
                                <IconButton 
                                    color="primary"
                                    size={isMobile ? "medium" : "large"}
                                    sx={{ 
                                        bgcolor: 'action.hover',
                                        '&:hover': { bgcolor: 'primary.main', color: 'white' },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <BookmarkBorderIcon />
                                </IconButton>
                            </Tooltip>
                            <ThemeToggle size={isMobile ? "medium" : "large"} />
                        </Stack>
                    </Box>
                </Grow>

                {/* Main Header Section */}
                <Zoom in timeout={1000}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            mb: { xs: 2, sm: 3, md: 4 }, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <CardContent sx={{ 
                            p: { xs: 2, sm: 3, md: 4 }
                        }}>
                            <Grid container spacing={4}>
                                {/* Left Side - Coin Information */}
                                <Grid item xs={12} lg={7}>
                                    {/* Coin Header */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: 3, 
                                        mb: 3
                                    }}>
                                        <Avatar 
                                            src={coinDetail.image?.large || coinDetail.image?.small} 
                                            alt={coinDetail.name}
                                            sx={{ 
                                                width: { xs: 60, sm: 70, md: 80 }, 
                                                height: { xs: 60, sm: 70, md: 80 }
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 2, 
                                                mb: 1,
                                                flexWrap: 'wrap'
                                            }}>
                                                <Typography 
                                                    variant={isMobile ? "h4" : "h3"} 
                                                    component="h1" 
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    {coinDetail.name}
                                                </Typography>
                                                <Chip 
                                                    label={coinDetail.symbol?.toUpperCase()} 
                                                    size="medium"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                                <Chip 
                                                    label={`Rank #${coinDetail.market_cap_rank || 'N/A'}`}
                                                    size="medium"
                                                    color="primary"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                            
                                            {/* Price Section */}
                                            <Typography 
                                                variant={isMobile ? "h3" : "h2"} 
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    color: 'text.primary',
                                                    mb: 2
                                                }}
                                            >
                                                {formatPrice(marketData.current_price?.aud)}
                                            </Typography>
                                            
                                            {/* Price Changes */}
                                            <Stack 
                                                direction="row" 
                                                spacing={3} 
                                                sx={{ flexWrap: 'wrap', gap: 1 }}
                                            >
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: 1,
                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.600'
                                                }}>
                                                    {formatPercentage(marketData.price_change_percentage_24h)}
                                                    <Typography variant="caption" color="text.secondary">24h</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: 1,
                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.600'
                                                }}>
                                                    {formatPercentage(marketData.price_change_percentage_7d)}
                                                    <Typography variant="caption" color="text.secondary">7d</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: 1,
                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.600'
                                                }}>
                                                    {formatPercentage(marketData.price_change_percentage_30d)}
                                                    <Typography variant="caption" color="text.secondary">30d</Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>

                                    {/* Key Metrics */}
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
                                                    Circulating Supply
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
                                </Grid>

                                {/* Right Side - Chart */}
                                <Grid item xs={12} lg={5}>
                                    <Box sx={{ height: '100%', minHeight: 400 }}>
                                        <PriceChart 
                                            coinId={coinDetail.id}
                                            coinName={coinDetail.name}
                                            currentPrice={marketData.current_price?.aud}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Zoom>

                {/* Tabbed Navigation */}
                <Grow in timeout={1200}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            border: '1px solid', 
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}
                    >
                        <Box sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider',
                            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800'
                        }}>
                            <Tabs 
                                value={activeTab} 
                                onChange={(_, newValue) => setActiveTab(newValue)}
                                variant={isMobile ? "fullWidth" : "standard"}
                                sx={{ 
                                    px: { xs: 1, sm: 2, md: 3 }, 
                                    pt: { xs: 1, sm: 2 },
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        textTransform: 'none'
                                    }
                                }}
                            >
                                <Tab label="Market Data" icon={<AssessmentIcon />} iconPosition="start" />
                                <Tab label="Supply & Economics" icon={<CurrencyExchangeIcon />} iconPosition="start" />
                                <Tab label="About" icon={<AnalyticsIcon />} iconPosition="start" />
                            </Tabs>
                        </Box>

                        {/* Tab Content */}
                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                            {/* Market Data Tab */}
                            {activeTab === 0 && (
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                        Market Data & Performance
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        {/* Price Information */}
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Price Information
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary">Current Price</Typography>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {formatPrice(marketData.current_price?.aud)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary">24h High</Typography>
                                                        <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                                                            {formatPrice(marketData.high_24h?.aud)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary">24h Low</Typography>
                                                        <Typography sx={{ fontWeight: 600, color: 'error.main' }}>
                                                            {formatPrice(marketData.low_24h?.aud)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary">24h Change</Typography>
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {formatPrice(marketData.price_change_24h_in_currency?.aud)}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        {/* All-Time Records */}
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    All-Time Records
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                            <Typography color="text.secondary">All-Time High</Typography>
                                                            <Typography sx={{ fontWeight: 600, color: 'success.main' }}>
                                                                {formatPrice(marketData.ath?.aud)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {marketData.ath_date?.aud ? new Date(marketData.ath_date.aud).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                            <Typography color="text.secondary">All-Time Low</Typography>
                                                            <Typography sx={{ fontWeight: 600, color: 'error.main' }}>
                                                                {formatPrice(marketData.atl?.aud)}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {marketData.atl_date?.aud ? new Date(marketData.atl_date.aud).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary">From ATH</Typography>
                                                        {formatPercentage(marketData.ath_change_percentage?.aud)}
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Grid>

                                        {/* Market Metrics */}
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Market Metrics
                                                </Typography>
                                                <Stack spacing={2}>
                                                    <Box sx={{ textAlign: 'center', py: 1 }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                            Market Cap Rank
                                                        </Typography>
                                                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                            #{coinDetail.market_cap_rank || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary" variant="body2">Volume/Market Cap</Typography>
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {marketData.total_volume?.aud && marketData.market_cap?.aud 
                                                                ? ((marketData.total_volume.aud / marketData.market_cap.aud) * 100).toFixed(2) + '%'
                                                                : 'N/A'
                                                            }
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary" variant="body2">Market Cap Change 24h</Typography>
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {formatMarketCap(marketData.market_cap_change_24h_in_currency?.aud)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography color="text.secondary" variant="body2">Fully Diluted Valuation</Typography>
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {formatMarketCap(marketData.fully_diluted_valuation?.aud)}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Supply & Economics Tab */}
                            {activeTab === 1 && (
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                        Supply & Economics
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        {/* Token Supply */}
                                        <Grid item xs={12} md={8}>
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Token Supply
                                                </Typography>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={6} sm={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', borderRadius: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                                                Circulating Supply
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                {formatSupply(marketData.circulating_supply)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', borderRadius: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                                                Total Supply
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                {formatSupply(marketData.total_supply)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', borderRadius: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                                                Max Supply
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                {marketData.max_supply ? formatSupply(marketData.max_supply) : '∞'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={3}>
                                                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', borderRadius: 1 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, display: 'block' }}>
                                                                Supply Ratio
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                {marketData.max_supply && marketData.circulating_supply
                                                                    ? `${((marketData.circulating_supply / marketData.max_supply) * 100).toFixed(1)}%`
                                                                    : 'N/A'
                                                                }
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Community & Development */}
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Community & Development
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                                                            Community Stats
                                                        </Typography>
                                                        <Stack spacing={1.5}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">Twitter Followers</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {communityData.twitter_followers?.toLocaleString() || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">Reddit Subscribers</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {communityData.reddit_subscribers?.toLocaleString() || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">Telegram Users</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {communityData.telegram_channel_user_count?.toLocaleString() || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12} sm={6}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
                                                            Development Activity
                                                        </Typography>
                                                        <Stack spacing={1.5}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">GitHub Stars</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {developerData.stars?.toLocaleString() || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">GitHub Forks</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {developerData.forks?.toLocaleString() || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <Typography variant="body2">Contributors</Typography>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {developerData.total_contributors || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>

                                        {/* Technical Details */}
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: 'fit-content' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Technical Details
                                                </Typography>
                                                <Stack spacing={2.5}>
                                                    <Box>
                                                        <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>Genesis Date</Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {coinDetail.genesis_date || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>Hash Algorithm</Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {coinDetail.hashing_algorithm || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>Block Time</Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {coinDetail.block_time_in_minutes ? `${coinDetail.block_time_in_minutes} min` : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography color="text.secondary" variant="body2" sx={{ mb: 0.5 }}>Country of Origin</Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {coinDetail.country_origin || 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* About Tab */}
                            {activeTab === 2 && (
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                        About {coinDetail.name}
                                    </Typography>
                                    
                                    <Grid container spacing={3}>
                                        {/* Description */}
                                        <Grid item xs={12} md={8}>
                                            {coinDetail.description?.en && (
                                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                        Overview
                                                    </Typography>
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ lineHeight: 1.7 }}
                                                        dangerouslySetInnerHTML={{ __html: coinDetail.description.en }}
                                                    />
                                                </Paper>
                                            )}

                                            {/* Categories */}
                                            {coinDetail.categories && coinDetail.categories.length > 0 && (
                                                <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                        Categories
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                        {coinDetail.categories.map((category, index) => (
                                                            <Chip 
                                                                key={index}
                                                                label={category}
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        ))}
                                                    </Box>
                                                </Paper>
                                            )}

                                            {/* Links & Resources */}
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Links & Resources
                                                </Typography>
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
                                                            Official Website
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
                                                            GitHub Repository
                                                        </Button>
                                                    )}
                                                    {links.blockchain_site?.[0] && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<SecurityIcon />}
                                                            component={Link}
                                                            href={links.blockchain_site[0]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size="small"
                                                        >
                                                            Blockchain Explorer
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Grid>

                                        {/* Platform Information */}
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: 'fit-content' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                                    Platform Information
                                                </Typography>
                                                {coinDetail.platforms && Object.keys(coinDetail.platforms).length > 0 ? (
                                                    <Stack spacing={2}>
                                                        {Object.entries(coinDetail.platforms).map(([platform, address], index) => (
                                                            <Box key={index}>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ 
                                                                    fontFamily: 'monospace', 
                                                                    fontSize: '0.75rem',
                                                                    wordBreak: 'break-all',
                                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.100' : 'grey.700',
                                                                    p: 1,
                                                                    borderRadius: 1
                                                                }}>
                                                                    {address || 'Native Blockchain'}
                                                                </Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                ) : (
                                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                            Platform
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            Native Blockchain
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            This cryptocurrency operates on its own blockchain
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}
                        </Box>
                    </Card>
                </Grow>
            </Box>
        </Fade>
    );
};

export default CryptoDetails;