"use client"

import { Dithering } from "@paper-design/shaders-react"
import { useState } from "react"
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

export default function ResumePage({
  badge = "✨ Your Website Builder",
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "#",
    },
    secondary: {
      text: "View on GitHub",
      url: "#",
    },
  },
  image = {
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg",
    alt: "Hero section demo image showing interface components",
  },
}: Hero1Props) {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center">


      <div className="flex w-full lg:w-1/2 flex-col items-center text-center lg:items-start lg:text-left pl-4 lg:pl-20 pr-4">
        {badge && (
          <Badge variant="outline">
            {badge}
            <ArrowUpRight className="ml-2 size-4" />
          </Badge>
        )}
        <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
          {heading}
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
          {description}
        </p>
        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
          {buttons.primary && (
            <Button asChild className="w-full sm:w-auto">
              <a href={buttons.primary.url}>{buttons.primary.text}</a>
            </Button>
          )}
          {buttons.secondary && (
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a href={buttons.secondary.url}>
                {buttons.secondary.text}
                <ArrowRight className="size-4" />
              </a>
            </Button>
          )}
        </div>
      </div>


      <div className="w-1/2 relative ">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "#020618" : "hsl(0, 0%, 95%)"}
          colorFront={isDarkMode ? "hsl(320, 100%, 70%)" : "hsl(220, 100%, 70%)"}
          shape="simplex"
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>
    </div>
  )
}
