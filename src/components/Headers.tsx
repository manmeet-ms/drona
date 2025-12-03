"use client";

import { IconMenu2 } from "@tabler/icons-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Button } from "@/src/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const LandingHeader = () => {
  const features = [
    {
      title: "Find Tutors",
      description: "Connect with qualified tutors for any subject and grade.",
      href: "/tutors",
    },
    {
      title: "Progress Tracking",
      description: "Monitor academic growth with detailed performance reports.",
      href: "/dashboard/progress",
    },
    {
      title: "Secure Messaging",
      description: "Direct, encrypted communication between parents and tutors.",
      href: "/dashboard/messages",
    },
    {
      title: "Smart Scheduling",
      description: "Manage classes, attendance, and cancellations easily.",
      href: "/dashboard/schedule",
    },
  ];
  const session = useSession();
  const pathname = usePathname();

  console.log(session, pathname);

  return (
    <section className="py-4">

      <div className="container">
        <nav className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2"
          >

            <span className="text-lg font-semibold tracking-tighter">
              Drona
            </span>
          </Link>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 p-3">
                    {features.map((feature, index) => (
                      <NavigationMenuLink
                        href={feature.href}
                        key={index}
                        className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                      >
                        <div key={feature.title}>
                          <p className="text-foreground mb-1 font-semibold">
                            {feature.title}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/about" className={navigationMenuTriggerStyle()}>
                    About Us
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                  <NavigationMenuLink href="/pricing" className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="#"
                  className={navigationMenuTriggerStyle()}
                >
                  Contact
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          
                  {session.status === "authenticated" ? <LogoutButton /> : <div className="hidden items-center gap-4 lg:flex">
           <Button><Link href={"/auth/register"}>Register</Link></Button>
                    <Button variant="outline"><Link href={"/auth/login"}>Login</Link></Button>
                 
          </div>
                  }

         
          <div className="flex gap-1">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  <IconMenu2 className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="max-h-screen overflow-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a
                      href="https://www.shadcnblocks.com"
                      className="flex items-center gap-2"
                    >
                      <img
                        src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"
                        className="max-h-8"
                        alt="Shadcn UI Navbar"
                      />
                      <span className="text-lg font-semibold tracking-tighter">
                        Shadcnblocks.com
                      </span>
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-4">
                  <Accordion type="single" collapsible className="mb-2 mt-4">
                    <AccordionItem value="solutions" className="border-none">
                      <AccordionTrigger className="text-base hover:no-underline">
                        Features
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid md:grid-cols-2">
                          {features.map((feature, index) => (
                            <a
                              href={feature.href}
                              key={index}
                              className="hover:bg-muted/70 rounded-md p-3 transition-colors"
                            >
                              <div key={feature.title}>
                                <p className="text-foreground mb-1 font-semibold">
                                  {feature.title}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {feature.description}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <div className="flex flex-col gap-6">
                    <Link href="/about" className="font-medium">
                      About Us
                    </Link>
                    <Link href="/pricing" className="font-medium">
                      Pricing
                    </Link>
                    <Link href="#" className="font-medium">
                      Contact
                    </Link>
                  </div>


                  {session.status === "authenticated" ? <LogoutButton /> : <div className="mt-6 flex flex-col gap-4">
                    <Button><Link href={"/auth/register"}>Register</Link></Button>
                    <Button variant="outline"><Link href={"/auth/login"}>Login</Link></Button>
                  </div>
                  }


                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </section>
  );
};


