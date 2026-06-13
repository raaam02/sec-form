"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FORM_TEMPLATES } from "@sec-form/shared";
import { FileText, ArrowRight, Eye, Copy } from "lucide-react";

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(FORM_TEMPLATES.map((t) => t.category)))];

  const filteredTemplates = selectedCategory === "All"
    ? FORM_TEMPLATES
    : FORM_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = async (templateId: string) => {
    if (!session) {
      // Prompt login
      router.push("/login?redirect=/dashboard");
      return;
    }
    // If logged in, go to dashboard where form creation can be triggered
    router.push(`/dashboard?createTemplate=${templateId}`);
  };

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
              href={session ? "/dashboard" : "/login"}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              {session ? "Dashboard" : "Log in"}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-16 container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-slate-900">
            Template Gallery
          </h1>
          <p className="mt-3 text-slate-600">
            Kickstart your collection workflows with pre-built form configurations crafted by industry experts.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                    {template.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{template.fields.length} questions</span>
                </div>
                <h3 className="mt-4 font-outfit text-xl font-bold text-slate-950">{template.title}</h3>
                <p className="mt-2 text-slate-600 text-sm line-clamp-2">{template.description}</p>
                
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Fields Preview</span>
                  <div className="flex flex-wrap gap-1.5">
                    {template.fields.slice(0, 4).map((f) => (
                      <span key={f.id} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {f.label} ({f.type})
                      </span>
                    ))}
                    {template.fields.length > 4 && (
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500 font-bold">
                        +{template.fields.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template.id)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  <Copy className="h-4 w-4" /> Use Template
                </button>
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
