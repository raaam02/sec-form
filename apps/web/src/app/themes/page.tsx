"use client";

import React from "react";
import Link from "next/link";
import { BUILTIN_THEMES } from "@sec-form/shared";
import { Palette, Sparkles } from "lucide-react";

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-outfit text-xl font-bold text-slate-900">
            Formu.AI
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-slate-900">
            Theme Gallery
          </h1>
          <p className="mt-3 text-slate-600">
            Examine our built-in CSS styling presets. Applied directly to public forms to alter backgrounds, typography, and borders instantly.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BUILTIN_THEMES.map((theme) => (
            <div
              key={theme.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-outfit text-lg font-bold text-slate-950">{theme.name}</h3>
                </div>
                
                {/* Visual Palette Preview */}
                <div className="mt-6 rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <span>Colors</span>
                    <span>Values</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Primary Accent</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{theme.primaryColor}</span>
                        <div className="h-4 w-4 rounded border border-slate-200" style={{ backgroundColor: theme.primaryColor }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Background</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{theme.backgroundColor}</span>
                        <div className="h-4 w-4 rounded border border-slate-200" style={{ backgroundColor: theme.backgroundColor }} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Card Base</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">{theme.cardColor}</span>
                        <div className="h-4 w-4 rounded border border-slate-200" style={{ backgroundColor: theme.cardColor }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2 text-sm border-t border-slate-50 pt-4 text-slate-500">
                  <div className="flex justify-between">
                    <span>Font Family:</span>
                    <span className="font-semibold text-slate-700">{theme.fontFamily.split(",")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Border Radius:</span>
                    <span className="font-semibold text-slate-700">{theme.borderRadius}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  href="/login"
                  className="block w-full text-center py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-sm rounded-xl transition-colors"
                >
                  Apply Theme in Builder
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-100 py-6 text-center text-slate-500 text-xs">
        <p>© 2026 Formu.AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
