import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getDb } from "@/lib/db";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

function getSettings(): Record<string, string> {
  try {
    const db = getDb();
    const rows = db
      .prepare("SELECT setting_key, setting_value FROM site_settings WHERE setting_key IN ('site_name', 'site_favicon')")
      .all() as { setting_key: string; setting_value: string }[];
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.setting_key] = row.setting_value;
    }
    return map;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = getSettings();
  const siteName = settings.site_name || "Audi Motor";
  const faviconUrl = settings.site_favicon || undefined;

  return {
    title: `${siteName} - Dealer Mobil Keluarga Terpercaya`,
    description:
      "Spesialis mobil keluarga bekas berkualitas premium. Kami menjamin setiap unit yang Anda bawa pulang adalah yang terbaik untuk keluarga Anda.",
    keywords: [
      "mobil bekas",
      "dealer mobil",
      "mobil keluarga",
      "mobil premium",
      "Toyota",
      "Honda",
      "Mitsubishi",
      "Hyundai",
    ],
    openGraph: {
      title: `${siteName} - Dealer Mobil Keluarga Terpercaya`,
      description: "Spesialis mobil keluarga bekas berkualitas premium.",
      type: "website",
    },
    ...(faviconUrl
      ? {
          icons: {
            icon: faviconUrl,
            shortcut: faviconUrl,
            apple: faviconUrl,
          },
        }
      : {}),
  };
}

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = 'dark';
                    localStorage.setItem('theme', 'dark');
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

