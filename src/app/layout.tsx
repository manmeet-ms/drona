import './globals.css';
import { Providers } from './provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drona',
  description: 'Tutor Connect App',
  manifest: '/manifest.json',

};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='px-4 py-2' >
         <Providers>
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