"use client"
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../components/theme-provider";
import AuthProvider from "../providers/AuthProvider";
import { ProfileProvider } from "../providers/ProfileProvider";

export function Providers({ children }: { children: React.ReactNode }) {
    return <SessionProvider>

        <AuthProvider>
            <ProfileProvider>
                <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                    {children}
                </ThemeProvider>
            </ProfileProvider>
        </AuthProvider>

    </SessionProvider>;
}