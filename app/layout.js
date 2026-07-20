import { Bebas_Neue, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display: condensed cinematic caps — the name reads like a title card.
const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Body: humanist geometric, quiet next to the display face.
const body = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

// Utility: monospace for eyebrows, labels and data — the engineer's register.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Prakhar Mittal — Data Engineer",
  description:
    "Data Solution Analyst at IDFC FIRST Bank. Seven years building ETL and Big Data platforms on Spark, Hadoop and AWS.",
};

export const viewport = {
  themeColor: "#06070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
