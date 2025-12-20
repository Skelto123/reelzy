import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "ReelZy – Instagram Reel Downloader",
  description:
    "ReelZy helps you download Instagram reels video and audio instantly. Fast, clean, and Gen-Z friendly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ❌ REMOVED theme script completely */}
      <body className="bg-white text-black dark:bg-black dark:text-white antialiased transition-colors duration-300">
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
