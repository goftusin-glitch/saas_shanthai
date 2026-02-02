import { createTheme } from '@mui/material/styles';

// Shared Material UI theme for dashboard pages
export const dashboardTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#FF4C29',
            light: '#FF6B4A',
            dark: '#E63E1C',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#0a0a0a',
            light: '#1a1a1a',
            dark: '#000000',
        },
        background: {
            default: '#ffffff',
            paper: '#f8f9fa',
        },
        text: {
            primary: '#1a1a1a',
            secondary: '#666666',
        },
        divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            color: '#1a1a1a',
        },
        h2: {
            fontWeight: 700,
            color: '#1a1a1a',
        },
        h3: {
            fontWeight: 600,
            color: '#1a1a1a',
        },
        h4: {
            fontWeight: 600,
            color: '#1a1a1a',
        },
        h5: {
            fontWeight: 600,
            color: '#1a1a1a',
        },
        h6: {
            fontWeight: 600,
            color: '#1a1a1a',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    padding: '10px 24px',
                    transition: 'all 0.3s ease',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 76, 41, 0.3)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderColor: 'rgba(255, 76, 41, 0.3)',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 10,
                        backgroundColor: '#ffffff',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF4C29',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#FF4C29',
                        },
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
            },
        },
    },
});
