import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Maps Navigation",
  description: "Next.js app with Google Maps integration and smooth zoom",
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
