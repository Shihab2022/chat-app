import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StyledEngineProvider } from "@mui/styled-engine";
import { Provider, useSelector } from "react-redux";
import { store, RootState } from "./redux/store.ts";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from "./theme.ts";

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme, fontSize, compactList } = useSelector((state: RootState) => state.settings);
  const muiTheme = createAppTheme(theme, fontSize, compactList);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StyledEngineProvider injectFirst>
    <Provider store={store}>
      <ThemeWrapper>
        <App />
      </ThemeWrapper>
    </Provider>
  </StyledEngineProvider>
);
