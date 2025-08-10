import { createTheme } from '@mui/material/styles';

const getTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    background: {
      default: mode === 'light' ? '#fafafa' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
    text: {
      primary: mode === 'light' ? '#212121' : '#ffffff',
      secondary: mode === 'light' ? '#757575' : '#b3b3b3',
    },
  }, // ✅ Added comma to close palette
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.3 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', lineHeight: 1.4 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: theme.palette.mode === 'light' 
            ? '0 2px 8px rgba(0,0,0,0.1)' 
            : '0 2px 8px rgba(0,0,0,0.3)',
          borderRadius: 12,
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: theme.palette.mode === 'light' 
              ? '0 4px 16px rgba(0,0,0,0.15)' 
              : '0 4px 16px rgba(0,0,0,0.4)',
            transform: 'translateY(-2px)',
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 12,
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)'}`,
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiTableCell-root': {
            fontWeight: 600,
            backgroundColor: theme.palette.mode === 'light' ? '#f8fafc' : '#2a2a2a',
            borderBottom: `2px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#404040'}`,
          },
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:nth-of-type(even)': {
            backgroundColor: theme.palette.mode === 'light' ? '#fafbfc' : '#1a1a1a',
          },
          '&:hover': {
            backgroundColor: `${theme.palette.mode === 'light' ? '#f1f5f9' : '#333333'} !important`,
          },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#404040'}`,
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(255,255,255,0.8)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiPaginationItem-root': {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            },
          },
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.23)' : 'rgba(255,255,255,0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.87)',
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        }),
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiInputLabel-root': {
            color: theme.palette.text.secondary,
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)'}`,
          boxShadow: theme.palette.mode === 'light' 
            ? '0 4px 8px rgba(0,0,0,0.1)' 
            : '0 4px 8px rgba(0,0,0,0.3)',
        }),
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
  },
});

export default getTheme;
