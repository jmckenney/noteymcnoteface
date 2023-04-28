import "@/styles/globals.css";

import ThemeProvider from "../theme";
import { AnchorProvider } from "../hooks/AnchorProvider";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AnchorProvider>
        <Component {...pageProps} />
      </AnchorProvider>
    </ThemeProvider>
  );
}
