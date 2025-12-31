import './globals.css';
import { Providers } from './provider';

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/lib/auth";

import { constructMetadata } from '@/src/lib/metadata';

export const metadata = constructMetadata();

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className=' ' >
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