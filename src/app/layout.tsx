import AuthProvider from '@/src/providers/AuthProvider';
import './globals.css';
import { ThemeProvider } from "@/src/components/theme-provider"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className='px-6 py-4'>
         <AuthProvider>

         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            {children}
          </ThemeProvider>
              </AuthProvider>
             
      </body>
    </html>
  );
}