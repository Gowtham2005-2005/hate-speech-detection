"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { CommandMenu } from "@/components/command-menu"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { PlagiarismChecker } from "@/components/plagiarism-checker"
import { FakeDataDetection } from "@/components/fake-data-detection"
import { useRouter, usePathname } from "next/navigation"

export function Dashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const [activePage, setActivePage] = useState<"plagiarism" | "fake-data">("plagiarism")

  useEffect(() => {
    if (pathname === "/fake-data") {
      setActivePage("fake-data")
    } else {
      setActivePage("plagiarism")
    }
  }, [pathname])

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AppSidebar activePage={activePage} />
      <SidebarInset className="w-full">
        <div className="flex flex-col min-h-screen w-full">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <div className="md:hidden">
              <MobileNav />
            </div>
            <div className="flex flex-1 items-center justify-between">
              <h1 className="text-xl font-semibold">
                {activePage === "plagiarism" ? "Plagiarism Checker" : "Fake Data Detection"}
              </h1>
              <div className="flex items-center gap-3">
                <CommandMenu />
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            {activePage === "plagiarism" ? <PlagiarismChecker /> : <FakeDataDetection />}
          </main>
        </div>
      </SidebarInset>
    </div>
  )
}
