"use client"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/theme-provider";
import AuthProvider from "../providers/AuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>

        <AuthProvider>

            <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
                {children}
            </ThemeProvider>
        </AuthProvider>

    </SessionProvider>;
}