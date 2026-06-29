import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.js";
import "@fontsource/jost";

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
)