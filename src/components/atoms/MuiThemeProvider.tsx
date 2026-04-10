import { useMemo, useSyncExternalStore } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

/** Subscribe to the `dark` class on <html> so MUI re-renders on toggle. */
function subscribeToDarkMode(cb: () => void) {
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDark = useSyncExternalStore(
    subscribeToDarkMode,
    getIsDark,
    () => false, // SSR fallback: default to light mode
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
          primary: { main: "#914cff" },
          background: {
            default: isDark ? "#0f0f21" : "#f0f2f5",
            paper: isDark ? "#0f0f21" : "#ffffff",
          },
        },
        typography: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 13,
        },
        shape: { borderRadius: 12 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid #e5e7eb",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)",
                "&:first-of-type": {
                  paddingLeft: 16,
                },
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                "&:hover td": {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(145,76,255,0.04)",
                },
              },
            },
          },
        },
      }),
    [isDark],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
