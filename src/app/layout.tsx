import './globals.css';
import { Providers } from './provider';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className='px-4 py-2' >
         <Providers>

            {children}
         </Providers>
             
      </body>
    </html>
  );
}