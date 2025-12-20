import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
