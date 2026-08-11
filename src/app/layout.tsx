import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import prisma from "@/lib/prisma";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: {
        setting_key: {
          in: ['site_name', 'site_favicon'],
        },
      },
    });
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row.setting_value) {
        map[row.setting_key] = row.setting_value;
      }
    }
    return map;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
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

