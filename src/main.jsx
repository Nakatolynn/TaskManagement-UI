import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#7b61ff" },
    background: {
      default: '#0b0f14',
      paper: '#0f1720'
    },
    text: {
      primary: '#e6eef8',
      secondary: '#9aa8bb'
    }
  },
  typography: {
    fontFamily: "Roboto, Inter, Arial, sans-serif",
  },
  components: {
    MuiAppBar: { defaultProps: { elevation: 1 } },
  }
});

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
