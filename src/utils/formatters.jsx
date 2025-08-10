import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Box, Typography } from '@mui/material';
export const formatPercentage = (percentage) => {
        if (typeof percentage !== 'number' || isNaN(percentage)) return 'N/A';
        const isPositive = percentage >= 0;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}>
                {isPositive ? (
                    <TrendingUpIcon sx={{ color: 'success.main', fontSize: 14, flexShrink: 0 }} />
                ) : (
                    <TrendingDownIcon sx={{ color: 'error.main', fontSize: 14, flexShrink: 0 }} />
                )}
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: isPositive ? 'success.main' : 'error.main',
                        fontWeight: 'medium',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {isPositive ? '+' : ''}{Math.abs(percentage).toFixed(1)}%
                </Typography>
            </Box>
        );
    };

export const formatCurrency = (value, currency = 'AUD') => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        
        // For very small values, show more decimal places
        if (value < 1) {
            return new Intl.NumberFormat('en-AU', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 6
            }).format(value);
        }
        
        // For larger values, show fewer decimal places
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

export const formatLargeNumber = (value) => {
        if (typeof value !== 'number' || isNaN(value)) return 'N/A';
        if (value >= 1e12) return `A$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `A$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `A$${(value / 1e6).toFixed(2)}M`;
        if (value >= 1e3) return `A$${(value / 1e3).toFixed(2)}K`;
        return `A$${value.toFixed(2)}`;
    };