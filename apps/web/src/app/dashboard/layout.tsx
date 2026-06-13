"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, LayoutDashboard, Compass, LogOut, Code, Menu } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="w-10 h-10" color="text-indigo-600" />
          <span className="text-sm text-slate-500 font-medium">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="h-16 border-b border-slate-100 flex items-center px-6 gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-outfit font-bold tracking-tight text-slate-900">
              Formu.AI
            </span>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-700 transition-colors"
            >
              <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
            </Link>
            
            <Link
              href="/explore"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors"
            >
              <Compass className="h-4.5 w-4.5" /> Template Gallery
            </Link>
            
            <a
              href="http://localhost:4000/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition-colors"
            >
              <Code className="h-4.5 w-4.5" /> REST API Docs
            </a>
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={session.user?.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
              alt="Avatar"
              className="h-9 w-9 rounded-full bg-slate-100 object-cover shrink-0"
            />
            <div className="min-w-0">
              <div className="text-sm font-bold text-slate-800 truncate">{session.user?.name || "User"}</div>
              <div className="text-xs text-slate-400 truncate">{session.user?.email || ""}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-200 bg-white md:hidden flex items-center justify-between px-6 shrink-0">
          <span className="font-outfit font-bold tracking-tight text-slate-950">Formu.AI</span>
          <img
            src={session.user?.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=User"}
            alt="Avatar"
            className="h-8 w-8 rounded-full bg-slate-100"
          />
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
