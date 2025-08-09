import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Box, Typography } from '@mui/material';
export const formatPercentage = (percentage) => {
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

export const formatCurrency = (value, currency = 'AUD') => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(value);
    };

export const formatLargeNumber = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
        return `$${value.toFixed(2)}`;
    };