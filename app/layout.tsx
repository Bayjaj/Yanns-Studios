import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Yann's Studios",
  description: "Founded May 1st, 2025",
  openGraph: {
    title: "Yann's Studios",
    description: "Founded May 1st, 2025",
    siteName: "Yann's Studios",
  },
  twitter: {
    title: "Yann's Studios",
    description: "Founded May 1st, 2025",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
