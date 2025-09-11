import { createTheme } from '@mui/material'

export const superheroTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FFD700',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1565C0',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
    },
    text: {
      primary: '#000000',
      secondary: '#424242',
    },
    error: {
      main: '#000000',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FFD700',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontWeight: 700, color: '#000000' },
    h2: { fontWeight: 600, color: '#000000' },
    h3: { fontWeight: 600, color: '#000000' },
    h4: { fontWeight: 600, color: '#1565C0' },
    h5: { fontWeight: 600, color: '#1565C0' },
    h6: { fontWeight: 600, color: '#1565C0' },
    button: { fontWeight: 600, textTransform: 'none' },
  },
})