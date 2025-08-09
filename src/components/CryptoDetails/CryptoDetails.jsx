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
    Zoom
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
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
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

    const marketData = coinDetail.market_data || {};
    const links = coinDetail.links || {};

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

                {/* Modern Header Section */}
                <Zoom in timeout={1000}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            mb: { xs: 2, sm: 3, md: 4 }, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: 3
                        }}
                    >
                        <CardContent sx={{ 
                            p: { xs: 2, sm: 3, md: 4 },
                            background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.03) 0%, rgba(255, 255, 255, 1) 100%)'
                        }}>
                            {/* Main Header Section */}
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', sm: 'flex-start' }, 
                                gap: { xs: 2, sm: 3 }, 
                                mb: { xs: 3, sm: 4 },
                                textAlign: { xs: 'center', sm: 'left' }
                            }}>
                                <Avatar 
                                    src={coinDetail.image?.large || coinDetail.image?.small} 
                                    alt={coinDetail.name}
                                    sx={{ 
                                        width: { xs: 60, sm: 70, md: 80 }, 
                                        height: { xs: 60, sm: 70, md: 80 },
                                        boxShadow: 3
                                    }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'center', sm: 'center' }, 
                                        gap: { xs: 1, sm: 2 }, 
                                        mb: 1,
                                        justifyContent: { xs: 'center', sm: 'flex-start' }
                                    }}>
                                        <Typography 
                                            variant={isMobile ? "h4" : "h3"} 
                                            component="h1" 
                                            sx={{ 
                                                fontWeight: 700,
                                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                backgroundClip: 'text',
                                                textFillColor: 'transparent',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}
                                        >
                                            {coinDetail.name}
                                        </Typography>
                                        <Stack 
                                            direction={{ xs: 'column', sm: 'row' }} 
                                            spacing={1} 
                                            alignItems="center"
                                        >
                                            <Chip 
                                                label={coinDetail.symbol?.toUpperCase()} 
                                                size={isMobile ? "small" : "medium"}
                                                sx={{ 
                                                    bgcolor: 'primary.main', 
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            />
                                            <Chip 
                                                label={`Rank #${coinDetail.market_cap_rank || 'N/A'}`}
                                                size={isMobile ? "small" : "medium"}
                                                variant="outlined"
                                                color="primary"
                                                sx={{ 
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                }}
                                            />
                                        </Stack>
                                    </Box>

                                    {/* Price Section */}
                                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                                        <Typography 
                                            variant={isMobile ? "h3" : "h2"} 
                                            sx={{ 
                                                fontWeight: 700, 
                                                color: 'primary.main',
                                                mb: { xs: 1, sm: 2 },
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                            }}
                                        >
                                            {formatPrice(marketData.current_price?.aud)}
                                        </Typography>
                                        <Stack 
                                            direction={{ xs: 'column', sm: 'row' }} 
                                            spacing={{ xs: 1, sm: 3 }} 
                                            alignItems={{ xs: 'center', sm: 'center' }}
                                            sx={{ 
                                                gap: { xs: 1, sm: 2 },
                                                justifyContent: { xs: 'center', sm: 'flex-start' }
                                            }}
                                        >
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                p: { xs: 1, sm: 1.5 },
                                                bgcolor: 'action.hover',
                                                borderRadius: 2
                                            }}>
                                                {formatPercentage(marketData.price_change_percentage_24h)}
                                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                    24h
                                                </Typography>
                                            </Box>
                                            {!isMobile && (
                                                <>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1,
                                                        p: 1.5,
                                                        bgcolor: 'action.hover',
                                                        borderRadius: 2
                                                    }}>
                                                        {formatPercentage(marketData.price_change_percentage_7d)}
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                            7d
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 1,
                                                        p: 1.5,
                                                        bgcolor: 'action.hover',
                                                        borderRadius: 2
                                                    }}>
                                                        {formatPercentage(marketData.price_change_percentage_30d)}
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                            30d
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Stack>
                                    </Box>
                                </Box>
                            </Box>

                            {/* Main Content Grid */}
                            <Grid container spacing={3}>
                                {/* Price Chart - Full Width */}
                                <Grid item xs={12}>
                                    <PriceChart 
                                        coinId={coinDetail.id}
                                        coinName={coinDetail.name}
                                        currentPrice={marketData.current_price?.aud}
                                    />
                                </Grid>

                                {/* Key Statistics Grid */}
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 2, 
                                        bgcolor: 'primary.main', 
                                        color: 'white',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}>
                                        <Typography variant="caption" sx={{ 
                                            textTransform: 'uppercase', 
                                            letterSpacing: 1,
                                            opacity: 0.9
                                        }}>
                                            Market Cap
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                            {formatMarketCap(marketData.market_cap?.aud)}
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 2, 
                                        bgcolor: 'secondary.main', 
                                        color: 'white',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}>
                                        <Typography variant="caption" sx={{ 
                                            textTransform: 'uppercase', 
                                            letterSpacing: 1,
                                            opacity: 0.9
                                        }}>
                                            24h Volume
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                            {formatMarketCap(marketData.total_volume?.aud)}
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 2, 
                                        bgcolor: 'success.main', 
                                        color: 'white',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}>
                                        <Typography variant="caption" sx={{ 
                                            textTransform: 'uppercase', 
                                            letterSpacing: 1,
                                            opacity: 0.9
                                        }}>
                                            Circulating Supply
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                            {formatSupply(marketData.circulating_supply)}
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Card sx={{ 
                                        p: 2, 
                                        bgcolor: 'warning.main', 
                                        color: 'white',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': { transform: 'translateY(-2px)' }
                                    }}>
                                        <Typography variant="caption" sx={{ 
                                            textTransform: 'uppercase', 
                                            letterSpacing: 1,
                                            opacity: 0.9
                                        }}>
                                            All-Time High
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                            {formatPrice(marketData.ath?.aud)}
                                        </Typography>
                                    </Card>
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
                            mb: { xs: 2, sm: 3, md: 4 }, 
                            border: '1px solid', 
                            borderColor: 'divider',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: 3
                        }}
                    >
                        <Box sx={{ 
                            borderBottom: 1, 
                            borderColor: 'divider',
                            bgcolor: 'grey.50'
                        }}>
                            <Tabs 
                                value={activeTab} 
                                onChange={(_, newValue) => setActiveTab(newValue)}
                                variant={isMobile ? "fullWidth" : "standard"}
                                scrollButtons={isMobile ? false : "auto"}
                                allowScrollButtonsMobile
                                sx={{ 
                                    px: { xs: 1, sm: 2, md: 3 }, 
                                    pt: { xs: 1, sm: 2 },
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                        textTransform: 'none',
                                        borderRadius: '8px 8px 0 0',
                                        transition: 'all 0.3s ease',
                                        '&.Mui-selected': {
                                            bgcolor: 'white',
                                            color: 'primary.main'
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        height: 3,
                                        borderRadius: '3px 3px 0 0',
                                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
                                    }
                                }}
                            >
                                <Tab label="Overview" />
                                <Tab label="Markets" />
                                <Tab label="About" />
                            </Tabs>
                        </Box>

                        {/* Tab Content */}
                        <Box sx={{ 
                            p: { xs: 2, sm: 3, md: 4 },
                            bgcolor: 'white'
                        }}>
                            {/* Overview Tab */}
                            {activeTab === 0 && (
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                        Detailed Analysis
                                    </Typography>
                                    <Grid container spacing={3}>
                                        {/* Supply & Economics */}
                                        <Grid item xs={12} lg={8}>
                                            <Card elevation={2} sx={{ height: 'fit-content' }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                        Supply & Economics
                                                    </Typography>
                                                    <Divider sx={{ mb: 3 }} />
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ p: 2, bgcolor: 'success.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    Circulating Supply
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {formatSupply(marketData.circulating_supply)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ p: 2, bgcolor: 'warning.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    Max Supply
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {marketData.max_supply ? formatSupply(marketData.max_supply) : '∞'}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ p: 2, bgcolor: 'info.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    Total Supply
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {marketData.total_supply ? formatSupply(marketData.total_supply) : 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Box sx={{ p: 2, bgcolor: 'secondary.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    Market Dominance
                                                                </Typography>
                                                                <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {marketData.market_cap_rank ? `#${marketData.market_cap_rank}` : 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        
                                        {/* Price Levels */}
                                        <Grid item xs={12} lg={4}>
                                            <Card elevation={2} sx={{ height: 'fit-content' }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                        Price Levels
                                                    </Typography>
                                                    <Divider sx={{ mb: 3 }} />
                                                    <Stack spacing={2.5}>
                                                        <Box>
                                                            <Typography variant="caption" color="success.main" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                All-Time High
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                                {formatPrice(marketData.ath?.aud)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {marketData.ath_date?.aud ? new Date(marketData.ath_date.aud).toLocaleDateString() : 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box>
                                                            <Typography variant="caption" color="error.main" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                All-Time Low
                                                            </Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                                {formatPrice(marketData.atl?.aud)}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {marketData.atl_date?.aud ? new Date(marketData.atl_date.aud).toLocaleDateString() : 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        
                                                        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                                Distance from ATH
                                                            </Typography>
                                                            <Box sx={{ mt: 1 }}>
                                                                {formatPercentage(marketData.ath_change_percentage?.aud)}
                                                            </Box>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        
                                        {/* Volume Analysis */}
                                        <Grid item xs={12}>
                                            <Card elevation={2}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                        Volume Analysis
                                                    </Typography>
                                                    <Divider sx={{ mb: 3 }} />
                                                    <Grid container spacing={3}>
                                                        <Grid item xs={12} sm={4}>
                                                            <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    24h Trading Volume
                                                                </Typography>
                                                                <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {formatMarketCap(marketData.total_volume?.aud)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    Market Cap
                                                                </Typography>
                                                                <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {formatMarketCap(marketData.market_cap?.aud)}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={12} sm={4}>
                                                            <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'success.main', color: 'white', borderRadius: 2 }}>
                                                                <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                                                                    Volume/Market Cap
                                                                </Typography>
                                                                <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
                                                                    {marketData.total_volume?.aud && marketData.market_cap?.aud 
                                                                        ? ((marketData.total_volume.aud / marketData.market_cap.aud) * 100).toFixed(2) + '%'
                                                                        : 'N/A'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* Markets Tab */}
                            {activeTab === 1 && (
                                <Box>
                                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                                        Trading Markets
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={8}>
                                            <Card elevation={2}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Market Information
                                                    </Typography>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <Stack spacing={2.5}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Market Cap Rank</Typography>
                                                            <Chip 
                                                                label={`#${coinDetail.market_cap_rank || 'N/A'}`}
                                                                color="primary"
                                                                size="small"
                                                                sx={{ fontWeight: 600 }}
                                                            />
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Genesis Date</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {coinDetail.genesis_date || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Hash Algorithm</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {coinDetail.hashing_algorithm || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Block Time (minutes)</Typography>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {coinDetail.block_time_in_minutes || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>Categories</Typography>
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '60%', justifyContent: 'flex-end' }}>
                                                                {coinDetail.categories && coinDetail.categories.length > 0 ? (
                                                                    coinDetail.categories.slice(0, 3).map((category, index) => (
                                                                        <Chip 
                                                                            key={index}
                                                                            label={category}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{ fontSize: '0.75rem' }}
                                                                        />
                                                                    ))
                                                                ) : (
                                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>N/A</Typography>
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card elevation={2}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                        Developer Stats
                                                    </Typography>
                                                    <Divider sx={{ mb: 2 }} />
                                                    <Stack spacing={2.5}>
                                                        <Box>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>GitHub Stars</Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                                {coinDetail.developer_data?.stars || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>Forks</Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                {coinDetail.developer_data?.forks || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>Contributors</Typography>
                                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                {coinDetail.developer_data?.total_contributors || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>Last Update</Typography>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {coinDetail.last_updated ? new Date(coinDetail.last_updated).toLocaleDateString() : 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
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
                                    {coinDetail.description?.en && (
                                        <Card elevation={1} sx={{ mb: 3 }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography 
                                                    variant="body1" 
                                                    sx={{ lineHeight: 1.7 }}
                                                    dangerouslySetInnerHTML={{ __html: coinDetail.description.en }}
                                                />
                                            </CardContent>
                                        </Card>
                                    )}
                                    
                                    {/* Links Section */}
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Links & Resources
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
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
                                    </Box>
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