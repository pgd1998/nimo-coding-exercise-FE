import { useEffect } from "react";
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
    Link
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LanguageIcon from '@mui/icons-material/Language';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';

const CryptoDetailPage = () => {
    const { coinId } = useParams();
    const navigate = useNavigate();
    const { coinDetail, isLoading, isError, fetchCoinDetail } = useCoinDetail();

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
        return `$${value.toLocaleString()}`;
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

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleBackClick}
                    sx={{ mb: 3 }}
                >
                    Back to Market
                </Button>

                {/* Header Section */}
                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar 
                            src={coinDetail.image?.large || coinDetail.image?.small} 
                            alt={coinDetail.name}
                            sx={{ width: 64, height: 64 }}
                        />
                        <Box>
                            <Typography variant="h4" component="h1">
                                {coinDetail.name}
                            </Typography>
                            <Typography variant="h6" color="text.secondary">
                                {coinDetail.symbol?.toUpperCase()}
                            </Typography>
                            <Chip 
                                label={`Rank #${coinDetail.market_cap_rank || 'N/A'}`}
                                color="primary"
                                size="small"
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    </Box>

                    {/* Current Price */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                            {formatPrice(marketData.current_price?.aud)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    24h Change
                                </Typography>
                                {formatPercentage(marketData.price_change_percentage_24h)}
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    7d Change
                                </Typography>
                                {formatPercentage(marketData.price_change_percentage_7d)}
                            </Box>
                        </Box>
                    </Box>

                    {/* Description */}
                    {coinDetail.description?.en && (
                        <Box>
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    lineHeight: 1.7,
                                    '& a': { color: 'primary.main' }
                                }}
                                dangerouslySetInnerHTML={{ 
                                    __html: coinDetail.description.en.split('\n')[0] 
                                }}
                            />
                        </Box>
                    )}
                </Paper>

                {/* Market Statistics */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={2}>
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
                        <Card elevation={2}>
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

                {/* Links Section */}
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
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default CryptoDetailPage;