import './globals.css';
import { Providers } from './provider';

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";
import { Geist, Geist_Mono, JetBrains_Mono, Gloock } from "next/font/google";

import { constructMetadata } from '@/src/lib/metadata';

export const metadata = constructMetadata();

const gloock = Gloock({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloock",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});



export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${jetBrainsMono.variable} ${gloock.variable} antialiased`} >
        <Providers session={session}>
          {children}

        </Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
              `,
          }}
        />
      </body>
    </html>
  );
}