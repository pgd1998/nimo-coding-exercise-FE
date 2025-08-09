import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import getTheme from './theme.jsx';

const ThemeContext = createContext({
    mode: 'light',
    toggleTheme: () => {},
});

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeContextProvider');
    }
    return context;
};

export const ThemeContextProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode || 'light';
    });

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const theme = getTheme(mode);

    const contextValue = {
        mode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};