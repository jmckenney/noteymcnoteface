import "@/styles/globals.css";

import ThemeProvider from "../theme";
import { AnchorProvider } from "../hooks/AnchorProvider";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AnchorProvider>
        <DashboardLayout>
          <Component {...pageProps} />
        </DashboardLayout>
      </AnchorProvider>
    </ThemeProvider>
  );
}
