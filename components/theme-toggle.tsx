"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const activeTheme = mounted
    ? (theme === "system" ? resolvedTheme ?? "system" : theme ?? "system")
    : "system"

  const nextTheme = activeTheme === "light"
    ? "dark"
    : activeTheme === "dark"
      ? "system"
      : "light"

  const triggerLabel = mounted
    ? `Switch to ${nextTheme} theme. Current theme: ${activeTheme}`
    : "Toggle theme"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative h-9 w-9 rounded-lg border border-border/40 bg-background/80 backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:border-border/60"
          aria-label={triggerLabel}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="min-w-[8rem] backdrop-blur-md bg-background/95 border border-border/50"
        aria-label="Theme selection menu"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 cursor-pointer transition-colors duration-200"
          aria-label="Use light theme"
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          <span>Light</span>
          {activeTheme === "light" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          )}
          {activeTheme === "light" && (
            <span className="sr-only">(current)</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 cursor-pointer transition-colors duration-200"
          aria-label="Use dark theme"
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          <span>Dark</span>
          {activeTheme === "dark" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          )}
          {activeTheme === "dark" && (
            <span className="sr-only">(current)</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 cursor-pointer transition-colors duration-200"
          aria-label="Use system theme preference"
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          <span>System</span>
          {activeTheme === "system" && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          )}
          {activeTheme === "system" && (
            <span className="sr-only">(current)</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
