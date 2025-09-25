"use client";

import { cn } from "@/lib/utils";

export function Footer() {
  return (
    <footer role="contentinfo" className="py-1 md:py-2 mt-4 md:mt-6">
      <div className={cn("max-w-5xl mx-auto py-4 px-4 md:px-6")}>
        <div className="text-center text-foreground/60">
          <p className="text-xs md:text-sm">
            Built by{" "}
            <a
              href="https://x.com/arayyye"
              className="text-foreground/90 font-medium hover:text-foreground hover:underline transition-colors duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Rafi's Twitter profile"
            >
              arayyye
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}