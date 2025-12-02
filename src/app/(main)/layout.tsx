"use client";

import { useSession } from "next-auth/react";
import { useProfile } from "@/src/providers/ProfileProvider";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/src/components/Sidebar";
import { BottomNav } from "@/src/components/BottomNav";
import { parentNavItems, tutorNavItems, studentNavItems } from "@/src/config/navigation";
import { Button } from "@/src/components/ui/button";
import { ModeToggle } from "@/src/components/mode-toggle";
import { LandingHeader } from "@/src/components/Headers";
import Link from "next/link";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { isStudentView, exitStudentView } = useProfile();

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <LandingHeader />
        {children}
      </>
    );
  }

  // Determine Navigation Items based on Role/View
  let navItems = parentNavItems;
  if (isStudentView) {
    navItems = studentNavItems;
  } else if (session?.user?.role === "TUTOR") {
    navItems = tutorNavItems;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar items={navItems} />

      {/* Main Content Area */}
      <div className="lg:pl-64 pb-16 lg:pb-0">
        {/* Mobile Header (Optional, if we want a top bar on mobile) */}
        <div className="lg:hidden p-4 border-b flex items-center justify-between bg-background sticky top-0 z-40">
           <span className="font-bold text-lg"><Link href={"/"}>Drona</Link></span>
           <ModeToggle />
        </div>

        {/* Desktop Header / Top Bar (for Profile/Logout/Theme) */}
        <div className="hidden lg:flex h-16 items-center justify-end gap-4 border-b px-6">
            {isStudentView && (
            <Button
              onClick={exitStudentView}
              variant="destructive"
              size="sm"
            >
              Exit Student View
            </Button>
          )}
          <ModeToggle />
          <div className="flex items-center gap-2">
             <span className="text-sm font-medium">{session?.user?.name}</span>
             {/* Avatar could go here */}
          </div>
        </div>

        <main className="container mx-auto p-6">
            {/* Mobile "Exit Student View" Button */}
            {isStudentView && (
                <div className="lg:hidden mb-4">
                     <Button
                        onClick={exitStudentView}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                        >
                        Exit Student View
                    </Button>
                </div>
            )}
            {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav items={navItems} />
    </div>
  );
}