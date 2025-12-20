import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";

export const metadata = {
  title: "ReelZy",
  description: "Instagram Reel Downloader",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
