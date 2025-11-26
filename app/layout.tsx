import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energy Analysis Viz",
  description: "Transform CSV energy data into interactive dashboards with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

