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
                        gap: { xs: 2, sm: 1, md: 0 },
                        mb: { xs: 2, sm: 3, md: 4 }
                    }}>
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={onBackClick}
                            variant="outlined"
                            size={isMobile ? "small" : "medium"}
                            sx={{ 
                                borderRadius: 2,
                                px: { xs: 2, sm: 2, md: 3 },
                                py: { xs: 0.75, sm: 1, md: 1.5 },
                                fontWeight: 600,
                                fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
                                alignSelf: { xs: 'flex-start', sm: 'auto' },
                                maxWidth: { xs: 'fit-content', sm: 'none' }
                            }}
                        >
                            {isMobile ? 'Back' : 'Back to Market'}
                        </Button>
                        <Stack 
                            direction="row" 
                            spacing={{ xs: 0.5, sm: 1 }}
                            sx={{ 
                                alignSelf: { xs: 'flex-end', sm: 'auto' },
                                justifyContent: { xs: 'flex-end', sm: 'flex-end' }
                            }}
                        >
                            <ThemeToggle size={isMobile ? "small" : "medium"} />
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
                            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                                {/* Left Side - Coin Information */}
                                <Grid item xs={12} lg={7}>
                                    {/* Coin Header */}
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        alignItems: { xs: 'center', sm: 'center' }, 
                                        gap: { xs: 2, sm: 3 }, 
                                        mb: { xs: 2, sm: 3 },
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}>
                                        <Avatar 
                                            src={coinDetail.image?.large || coinDetail.image?.small} 
                                            alt={coinDetail.name}
                                            sx={{ 
                                                width: { xs: 50, sm: 60, md: 70, lg: 80 }, 
                                                height: { xs: 50, sm: 60, md: 70, lg: 80 },
                                                flexShrink: 0
                                            }}
                                        />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: { xs: 'center', sm: 'center' }, 
                                                gap: { xs: 1, sm: 2 }, 
                                                mb: { xs: 1, sm: 1 },
                                                flexWrap: 'wrap',
                                                justifyContent: { xs: 'center', sm: 'flex-start' }
                                            }}>
                                                <Typography 
                                                    variant={{ xs: "h5", sm: "h4", md: "h3" }} 
                                                    component="h1" 
                                                    sx={{ 
                                                        fontWeight: 700,
                                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                                                        lineHeight: 1.2,
                                                        textAlign: { xs: 'center', sm: 'left' }
                                                    }}
                                                >
                                                    {coinDetail.name}
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    gap: 1, 
                                                    flexWrap: 'wrap',
                                                    justifyContent: { xs: 'center', sm: 'flex-start' }
                                                }}>
                                                    <Chip 
                                                        label={coinDetail.symbol?.toUpperCase()} 
                                                        size={isMobile ? "small" : "medium"}
                                                        variant="outlined"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                        }}
                                                    />
                                                    <Chip 
                                                        label={`Rank #${coinDetail.market_cap_rank || 'N/A'}`}
                                                        size={isMobile ? "small" : "medium"}
                                                        color="primary"
                                                        sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                            
                                            {/* Price Section */}
                                            <Typography 
                                                variant={{ xs: "h4", sm: "h3", md: "h2" }}
                                                sx={{ 
                                                    fontWeight: 700, 
                                                    color: 'text.primary',
                                                    mb: { xs: 1.5, sm: 2 },
                                                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                                                    textAlign: { xs: 'center', sm: 'left' }
                                                }}
                                            >
                                                {formatPrice(marketData.current_price?.aud)}
                                            </Typography>
                                            
                                            {/* Price Changes */}
                                            <Stack 
                                                direction={{ xs: 'column', sm: 'row' }}
                                                spacing={{ xs: 1, sm: 2 }} 
                                                sx={{ 
                                                    flexWrap: 'wrap', 
                                                    gap: { xs: 1, sm: 1.5 },
                                                    alignItems: { xs: 'center', sm: 'flex-start' }
                                                }}
                                            >
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: { xs: 0.75, sm: 1 },
                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.600',
                                                    minWidth: 'fit-content'
                                                }}>
                                                    {formatPercentage(marketData.price_change_percentage_24h)}
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>24h</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: { xs: 0.75, sm: 1 },
                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.600',
                                                    minWidth: 'fit-content'
                                                }}>
                                                    {formatPercentage(marketData.price_change_percentage_7d)}
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>7d</Typography>
                                                </Box>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: 1,
                                                    p: { xs: 0.75, sm: 1 },
                                                    bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800',
                                                    borderRadius: 1,
                                                    border: '1px solid',
                                                    borderColor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.600',
                                                    minWidth: 'fit-content'
                                                }}>
                                                    {formatPercentage(marketData.price_change_percentage_30d)}
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>30d</Typography>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Box>

                                    {/* Key Metrics */}
                                    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 1, sm: 2 } }}>
                                        <Grid item xs={12} md={6}>
                                            <Grid container spacing={{ xs: 2, sm: 3 }} direction="column">
                                                <Grid item>
                                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ 
                                                            textTransform: 'uppercase', 
                                                            letterSpacing: 1,
                                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                            display: 'block',
                                                            mb: 0.5
                                                        }}>
                                                            Market Cap (AUD)
                                                        </Typography>
                                                        <Typography variant={{ xs: "body1", sm: "h6" }} sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' }
                                                        }}>
                                                            {formatMarketCap(marketData.market_cap?.aud)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ 
                                                            textTransform: 'uppercase', 
                                                            letterSpacing: 1,
                                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                            display: 'block',
                                                            mb: 0.5
                                                        }}>
                                                            24h Volume (AUD)
                                                        </Typography>
                                                        <Typography variant={{ xs: "body1", sm: "h6" }} sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' }
                                                        }}>
                                                            {formatMarketCap(marketData.total_volume?.aud)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ 
                                                            textTransform: 'uppercase', 
                                                            letterSpacing: 1,
                                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                            display: 'block',
                                                            mb: 0.5
                                                        }}>
                                                            Circulating Supply
                                                        </Typography>
                                                        <Typography variant={{ xs: "body1", sm: "h6" }} sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' }
                                                        }}>
                                                            {formatSupply(marketData.circulating_supply)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item>
                                                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ 
                                                            textTransform: 'uppercase', 
                                                            letterSpacing: 1,
                                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                            display: 'block',
                                                            mb: 0.5
                                                        }}>
                                                            All-Time High
                                                        </Typography>
                                                        <Typography variant={{ xs: "body1", sm: "h6" }} sx={{ 
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' }
                                                        }}>
                                                            {formatPrice(marketData.ath?.aud)}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ 
                                                height: { xs: 350, sm: 400, md: 450 }, 
                                                minHeight: { xs: 300, sm: 350, md: 400 },
                                                mt: { xs: 2, md: 0 }
                                            }}>
                                                <PriceChart 
                                                    coinId={coinDetail.id}
                                                    coinName={coinDetail.name}
                                                    currentPrice={marketData.current_price?.aud}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Right Side - Chart */}
                                <Grid item xs={12} lg={5}>
                                    <Box sx={{ 
                                        height: { xs: 350, sm: 400, md: 450, lg: '100%' }, 
                                        minHeight: { xs: 300, sm: 350, md: 400, lg: 400 },
                                        mt: { xs: 2, lg: 0 }
                                    }}>
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
                            overflow: 'hidden',
                            width: '100%',
                            maxWidth: '100%'
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
                                    px: { xs: 0.5, sm: 2, md: 3 }, 
                                    pt: { xs: 0.5, sm: 1, md: 2 },
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                                        textTransform: 'none',
                                        minHeight: { xs: 48, sm: 56, md: 64 },
                                        px: { xs: 0.5, sm: 1, md: 2 },
                                        '& .MuiSvgIcon-root': {
                                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
                                        }
                                    },
                                    '& .MuiTabs-flexContainer': {
                                        justifyContent: { xs: 'space-around', sm: 'flex-start' }
                                    }
                                }}
                            >
                                <Tab 
                                    label={isMobile ? "Market" : "Market Data"} 
                                    icon={<AssessmentIcon />} 
                                    iconPosition="start" 
                                />
                                <Tab 
                                    label={isMobile ? "Supply" : "Supply & Economics"} 
                                    icon={<CurrencyExchangeIcon />} 
                                    iconPosition="start" 
                                />
                                <Tab 
                                    label="About" 
                                    icon={<AnalyticsIcon />} 
                                    iconPosition="start" 
                                />
                            </Tabs>
                        </Box>

                        {/* Tab Content */}
                        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, width: '100%', maxWidth: '100%' }}>
                            {/* Market Data Tab */}
                            {activeTab === 0 && (
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <Typography variant={{ xs: "h6", sm: "h5" }} sx={{ 
                                        mb: { xs: 2, sm: 3 }, 
                                        fontWeight: 600,
                                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}>
                                        Market Data & Performance
                                    </Typography>
                                    
                                    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', margin: 0 }}>
                                        {/* Price Information */}
                                        <Grid item xs={12} lg={4}>
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2, 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
                                                    Price Information (AUD)
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
                                        <Grid item xs={12} lg={4}>
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2, 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
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
                                        <Grid item xs={12} lg={4}>
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2, 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
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
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <Typography variant={{ xs: "h6", sm: "h5" }} sx={{ 
                                        mb: { xs: 2, sm: 3 }, 
                                        fontWeight: 600,
                                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}>
                                        Supply & Economics
                                    </Typography>
                                    
                                    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', margin: 0 }}>
                                        {/* Token Supply */}
                                        <Grid item xs={12} sm={8}>
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2, 
                                                mb: { xs: 2, sm: 3 } 
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
                                                    Token Supply
                                                </Typography>
                                                <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                                                    <Grid item xs={6} sm={6} md={3}>
                                                        <Box sx={{ 
                                                            textAlign: 'center', 
                                                            p: { xs: 1.5, sm: 2 }, 
                                                            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', 
                                                            borderRadius: 1 
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ 
                                                                textTransform: 'uppercase', 
                                                                letterSpacing: 1, 
                                                                display: 'block',
                                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                                mb: 0.5
                                                            }}>
                                                                Circulating Supply
                                                            </Typography>
                                                            <Typography variant={{ xs: "body2", sm: "h6" }} sx={{ 
                                                                fontWeight: 600, 
                                                                mt: 1,
                                                                fontSize: { xs: '0.875rem', sm: '1.1rem' }
                                                            }}>
                                                                {formatSupply(marketData.circulating_supply)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={3}>
                                                        <Box sx={{ 
                                                            textAlign: 'center', 
                                                            p: { xs: 1.5, sm: 2 }, 
                                                            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', 
                                                            borderRadius: 1 
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ 
                                                                textTransform: 'uppercase', 
                                                                letterSpacing: 1, 
                                                                display: 'block',
                                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                                mb: 0.5
                                                            }}>
                                                                Total Supply
                                                            </Typography>
                                                            <Typography variant={{ xs: "body2", sm: "h6" }} sx={{ 
                                                                fontWeight: 600, 
                                                                mt: 1,
                                                                fontSize: { xs: '0.875rem', sm: '1.1rem' }
                                                            }}>
                                                                {formatSupply(marketData.total_supply)}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={3}>
                                                        <Box sx={{ 
                                                            textAlign: 'center', 
                                                            p: { xs: 1.5, sm: 2 }, 
                                                            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', 
                                                            borderRadius: 1 
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ 
                                                                textTransform: 'uppercase', 
                                                                letterSpacing: 1, 
                                                                display: 'block',
                                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                                mb: 0.5
                                                            }}>
                                                                Max Supply
                                                            </Typography>
                                                            <Typography variant={{ xs: "body2", sm: "h6" }} sx={{ 
                                                                fontWeight: 600, 
                                                                mt: 1,
                                                                fontSize: { xs: '0.875rem', sm: '1.1rem' }
                                                            }}>
                                                                {marketData.max_supply ? formatSupply(marketData.max_supply) : '∞'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} md={3}>
                                                        <Box sx={{ 
                                                            textAlign: 'center', 
                                                            p: { xs: 1.5, sm: 2 }, 
                                                            bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'grey.800', 
                                                            borderRadius: 1 
                                                        }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ 
                                                                textTransform: 'uppercase', 
                                                                letterSpacing: 1, 
                                                                display: 'block',
                                                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                                mb: 0.5
                                                            }}>
                                                                Supply Ratio
                                                            </Typography>
                                                            <Typography variant={{ xs: "body2", sm: "h6" }} sx={{ 
                                                                fontWeight: 600, 
                                                                mt: 1,
                                                                fontSize: { xs: '0.875rem', sm: '1.1rem' }
                                                            }}>
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
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2 
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
                                                    Community & Development
                                                </Typography>
                                                <Grid container spacing={{ xs: 2, sm: 3 }}>
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
                                        <Grid item xs={12} sm={4}>
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2, 
                                                height: 'fit-content' 
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
                                                    Technical Details
                                                </Typography>
                                                <Grid container spacing={{ xs: 2, md: 0 }}>
                                                    <Grid item xs={6} md={12}>
                                                        <Box sx={{ mb: { xs: 1, md: 2.5 } }}>
                                                            <Typography color="text.secondary" variant="body2" sx={{ 
                                                                mb: 0.5,
                                                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                                                            }}>
                                                                Genesis Date
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ 
                                                                fontWeight: 600,
                                                                fontSize: { xs: '0.875rem', md: '1rem' }
                                                            }}>
                                                                {coinDetail.genesis_date || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={12}>
                                                        <Box sx={{ mb: { xs: 1, md: 2.5 } }}>
                                                            <Typography color="text.secondary" variant="body2" sx={{ 
                                                                mb: 0.5,
                                                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                                                            }}>
                                                                Hash Algorithm
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ 
                                                                fontWeight: 600,
                                                                fontSize: { xs: '0.875rem', md: '1rem' }
                                                            }}>
                                                                {coinDetail.hashing_algorithm || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={12}>
                                                        <Box sx={{ mb: { xs: 1, md: 2.5 } }}>
                                                            <Typography color="text.secondary" variant="body2" sx={{ 
                                                                mb: 0.5,
                                                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                                                            }}>
                                                                Block Time
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ 
                                                                fontWeight: 600,
                                                                fontSize: { xs: '0.875rem', md: '1rem' }
                                                            }}>
                                                                {coinDetail.block_time_in_minutes ? `${coinDetail.block_time_in_minutes} min` : 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={12}>
                                                        <Box sx={{ mb: { xs: 1, md: 0 } }}>
                                                            <Typography color="text.secondary" variant="body2" sx={{ 
                                                                mb: 0.5,
                                                                fontSize: { xs: '0.75rem', md: '0.875rem' }
                                                            }}>
                                                                Country of Origin
                                                            </Typography>
                                                            <Typography variant="body1" sx={{ 
                                                                fontWeight: 600,
                                                                fontSize: { xs: '0.875rem', md: '1rem' }
                                                            }}>
                                                                {coinDetail.country_origin || 'N/A'}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Box>
                            )}

                            {/* About Tab */}
                            {activeTab === 2 && (
                                <Box sx={{ width: '100%', maxWidth: '100%' }}>
                                    <Typography variant={{ xs: "h6", sm: "h5" }} sx={{ 
                                        mb: { xs: 2, sm: 3 }, 
                                        fontWeight: 600,
                                        fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                        textAlign: { xs: 'center', sm: 'left' }
                                    }}>
                                        About {coinDetail.name}
                                    </Typography>
                                    
                                    <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ width: '100%', margin: 0 }}>
                                        {/* Description */}
                                        <Grid item xs={12} md={8}>
                                            {coinDetail.description?.en && (
                                                <Paper elevation={0} sx={{ 
                                                    p: { xs: 2, sm: 3 }, 
                                                    border: '1px solid', 
                                                    borderColor: 'divider', 
                                                    borderRadius: 2, 
                                                    mb: { xs: 2, sm: 3 } 
                                                }}>
                                                    <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                        fontWeight: 600, 
                                                        mb: 2,
                                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                                    }}>
                                                        Overview
                                                    </Typography>
                                                    <Typography 
                                                        variant="body1" 
                                                        sx={{ 
                                                            lineHeight: 1.7,
                                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                                        }}
                                                        dangerouslySetInnerHTML={{ __html: coinDetail.description.en }}
                                                    />
                                                </Paper>
                                            )}

                                            {/* Categories */}
                                            {coinDetail.categories && coinDetail.categories.length > 0 && (
                                                <Paper elevation={0} sx={{ 
                                                    p: { xs: 2, sm: 3 }, 
                                                    border: '1px solid', 
                                                    borderColor: 'divider', 
                                                    borderRadius: 2, 
                                                    mb: { xs: 2, sm: 3 } 
                                                }}>
                                                    <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                        fontWeight: 600, 
                                                        mb: 2,
                                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                                    }}>
                                                        Categories
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
                                                        {coinDetail.categories.map((category, index) => (
                                                            <Chip 
                                                                key={index}
                                                                label={category}
                                                                variant="outlined"
                                                                size={isMobile ? "small" : "medium"}
                                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Paper>
                                            )}

                                            {/* Links & Resources */}
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2 
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
                                                    Links & Resources
                                                </Typography>
                                                <Box sx={{ 
                                                    display: 'flex', 
                                                    flexWrap: 'wrap', 
                                                    gap: { xs: 0.5, sm: 1 },
                                                    justifyContent: { xs: 'center', sm: 'flex-start' }
                                                }}>
                                                    {links.homepage?.[0] && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<LanguageIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                            component={Link}
                                                            href={links.homepage[0]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size={isMobile ? "small" : "medium"}
                                                            sx={{ 
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                                px: { xs: 1, sm: 2 }
                                                            }}
                                                        >
                                                            {isMobile ? "Website" : "Official Website"}
                                                        </Button>
                                                    )}
                                                    {links.twitter_screen_name && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<TwitterIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                            component={Link}
                                                            href={`https://twitter.com/${links.twitter_screen_name}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size={isMobile ? "small" : "medium"}
                                                            sx={{ 
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                                px: { xs: 1, sm: 2 }
                                                            }}
                                                        >
                                                            Twitter
                                                        </Button>
                                                    )}
                                                    {links.repos_url?.github?.[0] && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<GitHubIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                            component={Link}
                                                            href={links.repos_url.github[0]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size={isMobile ? "small" : "medium"}
                                                            sx={{ 
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                                px: { xs: 1, sm: 2 }
                                                            }}
                                                        >
                                                            {isMobile ? "GitHub" : "GitHub Repository"}
                                                        </Button>
                                                    )}
                                                    {links.blockchain_site?.[0] && (
                                                        <Button
                                                            variant="outlined"
                                                            startIcon={<SecurityIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                                            component={Link}
                                                            href={links.blockchain_site[0]}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            size={isMobile ? "small" : "medium"}
                                                            sx={{ 
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                                px: { xs: 1, sm: 2 }
                                                            }}
                                                        >
                                                            {isMobile ? "Explorer" : "Blockchain Explorer"}
                                                        </Button>
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Grid>

                                        {/* Platform Information */}
                                        <Grid item xs={12} md={4}>
                                            <Paper elevation={0} sx={{ 
                                                p: { xs: 2, sm: 3 }, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2, 
                                                height: 'fit-content',
                                                mt: { xs: 0, md: 0 }
                                            }}>
                                                <Typography variant={{ xs: "subtitle1", sm: "h6" }} gutterBottom sx={{ 
                                                    fontWeight: 600, 
                                                    mb: 2,
                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                }}>
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