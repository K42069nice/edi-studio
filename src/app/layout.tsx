import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edi-studio.dev"),

  title: {
    default: "Free EDI Viewer & EDIFACT Parser | EDI Studio",
    template: "%s | EDI Studio",
  },

  description:
    "Free online EDI viewer and EDIFACT parser. View and analyze EDIFACT messages, Peppol invoices and UBL XML documents directly in your browser.",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Free EDI Viewer & EDIFACT Parser | EDI Studio",
    description:
      "View and analyze EDIFACT messages, Peppol invoices and UBL XML documents online.",
    url: "https://edi-studio.dev",
    siteName: "EDI Studio",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Free EDI Viewer & EDIFACT Parser | EDI Studio",
    description:
      "View and analyze EDIFACT messages, Peppol invoices and UBL XML documents online.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
