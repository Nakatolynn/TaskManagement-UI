import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create theme settings for both light and dark mode
const getThemeOptions = (mode) => ({
  palette: {
    mode,
    primary: { main: "#7b61ff" },
    ...(mode === 'dark' ? {
      background: {
        default: '#0b0f14',
        paper: '#0f1720'
      },
      text: {
        primary: '#e6eef8',
        secondary: '#9aa8bb'
      }
    } : {
      background: {
        default: '#f5f7fa',
        paper: '#ffffff'
      },
      text: {
        primary: '#1a2027',
        secondary: '#65758a'
      }
    })
  },
  typography: {
    fontFamily: "Roboto, Inter, Arial, sans-serif",
  },
  components: {
    MuiAppBar: { defaultProps: { elevation: 1 } },
  }
});

// Create a theme context
export const ColorModeContext = React.createContext({ 
  toggleColorMode: () => {} 
});

// Theme provider wrapper
export function ThemeContextProvider({ children }) {
  const [mode, setMode] = React.useState(localStorage.getItem('themeMode') || 'dark');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    []
  );

  const theme = React.useMemo(() => createTheme(getThemeOptions(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}