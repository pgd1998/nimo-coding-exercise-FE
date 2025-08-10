import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    CircularProgress,
    Alert,
    useTheme,
    useMediaQuery
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from 'recharts';
import usePriceChart from '../../hooks/usePriceChart';

const PriceChart = ({ coinId, coinName, currentPrice }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { chartData, isLoading, isError, days, setDays, fetchChartData } = usePriceChart();

    useEffect(() => {
        if (coinId) {
            fetchChartData(coinId, days, 'aud');
        }
    }, [coinId, days, fetchChartData]);

    const handleTimeRangeChange = (_, newDays) => {
        if (newDays !== null) {
            setDays(newDays);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(value);
    };

    const formatTooltipLabel = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Card elevation={3} sx={{ p: 2, minWidth: 200 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        {formatTooltipLabel(label)}
                    </Typography>
                    <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        Price: {formatCurrency(payload[0].value)}
                    </Typography>
                </Card>
            );
        }
        return null;
    };

    const getGradientColor = () => {
        if (chartData.length < 2) return theme.palette.primary.main;
        const firstPrice = chartData[0]?.price;
        const lastPrice = chartData[chartData.length - 1]?.price;
        return lastPrice >= firstPrice ? theme.palette.success.main : theme.palette.error.main;
    };

    return (
        <Card elevation={2} sx={{ height: 400, maxWidth:600 }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Header */}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        mb: 2,
                        gap: 1
                    }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {coinName} Price Chart
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Current: {formatCurrency(currentPrice)}
                            </Typography>
                        </Box>
                        
                        <ToggleButtonGroup
                            value={days}
                            exclusive
                            onChange={handleTimeRangeChange}
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root': {
                                    px: { xs: 1.5, sm: 2 },
                                    py: 0.5,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    minWidth: { xs: 35, sm: 40 },
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        }
                                    }
                                }
                            }}
                        >
                            <ToggleButton value={1}>24H</ToggleButton>
                            <ToggleButton value={7}>7D</ToggleButton>
                            <ToggleButton value={30}>30D</ToggleButton>
                            <ToggleButton value={90}>90D</ToggleButton>
                            <ToggleButton value={365}>1Y</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {/* Chart */}
                    <Box sx={{ flex: 1, minHeight: 0 }}>
                        {isLoading ? (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                gap: 2
                            }}>
                                <CircularProgress size={40} color="primary" />
                                <Typography variant="body2" color="text.secondary">
                                    Loading {days === 1 ? '24 hour' : `${days} day`} chart data...
                                </Typography>
                            </Box>
                        ) : chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={getGradientColor()} stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor={getGradientColor()} stopOpacity={0.05}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} opacity={0.3} />
                                    <XAxis 
                                        dataKey="timestamp"
                                        tickFormatter={(timestamp) => {
                                            const date = new Date(timestamp);
                                            return days <= 1 
                                                ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                                : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                        }}
                                        tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                                        axisLine={{ stroke: theme.palette.divider }}
                                        tickLine={{ stroke: theme.palette.divider }}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                                        tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                                        axisLine={{ stroke: theme.palette.divider }}
                                        tickLine={{ stroke: theme.palette.divider }}
                                        width={80}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke={getGradientColor()}
                                        strokeWidth={2}
                                        fill="url(#priceGradient)"
                                        dot={false}
                                        activeDot={{ 
                                            r: 4, 
                                            stroke: getGradientColor(),
                                            strokeWidth: 2,
                                            fill: 'white'
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                height: '100%',
                                textAlign: 'center',
                                gap: 2
                            }}>
                                <ShowChartIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
                                {isError ? (
                                    <Alert severity="warning" sx={{ maxWidth: 350, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            {isError}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Try selecting a different timeframe or refresh the page
                                        </Typography>
                                    </Alert>
                                ) : (
                                    <>
                                        <Typography variant="body1" color="text.secondary">
                                            No chart data available for {days === 1 ? '24 hours' : `${days} days`}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Try selecting a different timeframe above
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PriceChart;