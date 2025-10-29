import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7b61ff" },
    background: {
      default: "#0a0a0f",
      paper: "#111118",
    },
    text: {
      primary: "#ffffff",
      secondary: "#9aa8bb",
    },
  },
  typography: {
    fontFamily: "Roboto, Inter, Arial, sans-serif",
  },
  components: {
    MuiAppBar: {
      defaultProps: { elevation: 1 },
      styleOverrides: {
        root: {
          backgroundColor: "#111118",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
