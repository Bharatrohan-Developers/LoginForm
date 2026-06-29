import { createTheme } from "@mui/material/styles";
import colors from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
      light: colors.primaryLight,
      dark: colors.primaryDark,
      contrastText: colors.textLight,
    },
    secondary: {
      main: colors.secondary,
      light: colors.secondaryLight,
      dark: colors.secondaryDark,
      contrastText: colors.textPrimary,
    },
    background: {
      default: colors.background,
      paper: colors.paper,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
  },

  typography: {
    fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",

    // Font sizes and weights hierarchy
    fontSize: 16,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",

    h1: {
      fontSize: "2.5rem",
      fontWeight: 800,
      lineHeight: 1.3,
      letterSpacing: "-0.015625em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 800,
      lineHeight: 1.4,
      letterSpacing: "-0.0125em",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      lineHeight: 1.4,
      letterSpacing: "-0.009375em",
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: "0.009375em",
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: "0.0071428571em",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.03125em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: "0.0178571429em",
    },
    button: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.75,
      letterSpacing: "0.0892857143em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.66,
      letterSpacing: "0.0333333333em",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
          fontWeight: 400,
          fontSize: "1rem",
          lineHeight: 1.5,
          letterSpacing: "0.00938em",
          backgroundColor: colors.background,
          color: colors.textPrimary,
        },
        '*': {
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
        }
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
          textTransform: "none",
          padding: "12px 24px",
          transition: "all 0.3s ease",
        },
        contained: {
          boxShadow: `0 4px 12px ${colors.shadow}`,
          "&:hover": {
            boxShadow: `0 8px 24px ${colors.shadow}`,
          },
        },
        containedPrimary: {
          backgroundColor: colors.primary,
          color: colors.textLight,
          "&:hover": {
            backgroundColor: colors.primaryDark,
            boxShadow: `0 8px 24px ${colors.shadow}`,
          },
        },
        containedSecondary: {
          backgroundColor: colors.secondary,
          color: colors.textPrimary,
          "&:hover": {
            backgroundColor: colors.secondaryDark,
          },
        },
      },
      defaultProps: {
        disableElevation: false,
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: colors.inputBackground,
            transition: "all 0.3s ease",
            fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
            "& fieldset": {
              borderColor: colors.inputBorder,
            },
            "&:hover fieldset": {
              borderColor: colors.inputHover,
            },
            "&.Mui-focused fieldset": {
              borderColor: colors.inputFocus,
            },
          },
          "& .MuiInputLabel-root": {
            color: colors.textPrimary,
            fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
            "&.Mui-focused": {
              color: colors.inputFocus,
            },
          },
          "& .MuiInputBase-input": {
            color: colors.textPrimary,
            fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.textLight,
          color: colors.textPrimary,
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
          boxShadow: `0 2px 8px ${colors.shadow}`,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: `0 4px 12px ${colors.shadow}`,
          transition: "all 0.3s ease",
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          fontSize: "0.95rem",
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.paper,
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Jost, -apple-system, BlinkMacSystemFont, sans-serif",
        },
      },
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;