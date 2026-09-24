import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KlearStack — The Only Document AI With Fraud, Compliance & Audit Checks Built In",
  description:
    "No templates. No setup calls. See your documents processed live, right now. 99% world-class accuracy with proprietary AI for ultimate security. Pilot ready in less than 7 hours.",
  openGraph: {
    title: "KlearStack — Document AI With Fraud, Compliance & Audit Checks",
    description:
      "The only document AI platform with fraud detection, compliance checks, and audit trails built in. Used by BFSI, Healthcare, Telecom, and Manufacturing leaders.",
    type: "website",
    locale: "en_US",
    siteName: "KlearStack",
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    "document AI",
    "invoice processing",
    "accounts payable automation",
    "fraud detection",
    "KlearStack",
    "intelligent document processing",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1B2B6B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
