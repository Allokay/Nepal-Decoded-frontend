import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { AutoRefresh } from "@/components/AutoRefresh";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Nepal Decoded",
    default: "Nepal Decoded | Neutral News Aggregator & Headline Indexer",
  },
  description: "Nepal Decoded is your real-time, neutral news aggregator. We index breaking headlines, in-depth analysis, and diverse perspectives from top Nepali and international publishers.",
  metadataBase: new URL("https://thenepaldecoded.com"), // Fallback domain
  openGraph: {
    title: "Nepal Decoded | Neutral News Aggregator",
    description: "Get verified news and diverse perspectives from top publishers. Nepal Decoded indexes the headlines that matter.",
    url: "https://thenepaldecoded.com",
    siteName: "Nepal Decoded",
    locale: "ne_NP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Decoded",
    description: "Real-time neutral news aggregator for Nepal and the world.",
  },
  alternates: {
    canonical: "https://thenepaldecoded.com",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#fafafa] text-[#0f172a] dark:bg-[#090d16] dark:text-[#f8fafc] transition-colors duration-300" suppressHydrationWarning>
        <AutoRefresh intervalMinutes={15} />
        {children}
      </body>
    </html>
  );
}

