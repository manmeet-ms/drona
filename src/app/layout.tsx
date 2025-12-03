import './globals.css';
import { Providers } from './provider';
import type { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

export const metadata: Metadata = {
  title: 'Drona',
  description: 'Tutor Connect App',
  manifest: '/manifest.json',

};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className='px-4 py-2' >
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