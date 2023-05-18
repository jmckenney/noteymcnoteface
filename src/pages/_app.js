import "regenerator-runtime/runtime";
import "@/styles/globals.css";

import ThemeProvider from "../theme";
import { AnchorProvider } from "../hooks/AnchorProvider";
import { MinimizeNoteProvider } from "../hooks/MinimizeNoteProvider";
import DashboardLayout from "@/layouts/dashboard/DashboardLayout";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AnchorProvider>
        <MinimizeNoteProvider>
          <DashboardLayout>
            <Component {...pageProps} />
          </DashboardLayout>
        </MinimizeNoteProvider>
      </AnchorProvider>
    </ThemeProvider>
  );
}
