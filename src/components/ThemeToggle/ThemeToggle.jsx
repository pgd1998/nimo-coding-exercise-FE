import { IconButton, Tooltip, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeContext';

const ThemeToggle = ({ size = "medium", sx = {} }) => {
    const { mode, toggleTheme } = useThemeMode();
    const theme = useTheme();

    return (
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
                onClick={toggleTheme}
                size={size}
                sx={{
                    color: 'text.primary',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'rotate(180deg)',
                    },
                    ...sx
                }}
            >
                {mode === 'light' ? (
                    <Brightness4 />
                ) : (
                    <Brightness7 />
                )}
            </IconButton>
        </Tooltip>
    );
};

export default ThemeToggle;