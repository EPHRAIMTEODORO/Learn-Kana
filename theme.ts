import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3F51B5',
      dark: '#303F9F',
      light: '#E8EAF6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#2C3E50',
      dark: '#1F2D3A',
      light: '#E9EEF2',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#4F7D5A',
      light: '#E7F0EA',
      dark: '#355C3F',
    },
    warning: {
      main: '#B98B2E',
      light: '#FFF4D8',
      dark: '#7A5A1F',
    },
    error: {
      main: '#B85C5C',
      light: '#F8E7E7',
      dark: '#8E3F3F',
    },
    background: {
      default: '#F7F8FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#555555',
      disabled: '#999999',
    },
    divider: '#E2E6EA',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3.5rem',
      lineHeight: 1.15,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.25,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.35rem',
      lineHeight: 1.35,
      letterSpacing: 0,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
    },
    body2: {
      fontSize: '0.925rem',
      lineHeight: 1.65,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: 0,
    },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F7F8FA',
          color: '#1A1A1A',
          textRendering: 'optimizeLegibility',
        },
        '::selection': {
          backgroundColor: '#E8EAF6',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 18px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(26, 26, 26, 0.06)',
        },
      },
    },
  },
});

export default theme;
