import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { StyledEngineProvider } from "@mui/styled-engine";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { chattyTheme } from "./theme.ts";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <ThemeProvider theme={chattyTheme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </StyledEngineProvider>
  </>
);
