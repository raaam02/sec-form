"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Cpu, CheckCircle2, AlertTriangle, ToggleLeft, ToggleRight, Sparkles, Sliders, Globe } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { trpc } from "../../../utils/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // tRPC hooks
  const utils = trpc.useUtils();
  
  useGlobalShortcut("refresh-models", "ctrl+r", "Refresh Models", () => {
    utils.admin.getModels.invalidate();
    toast.info("Refreshing models...");
  }, "Admin Tools");

  const { data: models, isLoading, isError } = trpc.admin.getModels.useQuery(undefined, {
    enabled: status === "authenticated" && session?.user?.role === "admin",
  });

  const { data: systemStatus } = trpc.admin.getSystemStatus.useQuery(undefined, {
    enabled: status === "authenticated" && session?.user?.role === "admin",
  });

  const toggleMutation = trpc.admin.toggleModelActive.useMutation({
    onSuccess: () => {
      utils.admin.getModels.invalidate();
      toast.success("Model status updated");
    },
  });

  const setDefaultMutation = trpc.admin.setDefaultModel.useMutation({
    onSuccess: () => {
      utils.admin.getModels.invalidate();
      toast.success("Default model updated");
    },
  });

  // Redirect if not authorized
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard/admin");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && isLoading)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background p-8">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="w-10 h-10 animate-spin" color="text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Loading Admin Control Panel...</span>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") {
    return null;
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Models</h2>
        <p className="text-sm text-muted-foreground mb-4">
          There was an error retrieving the AI models list from the server.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const defaultModel = models?.find((m) => m.isDefault);

  const handleToggleActive = async (modelId: string, currentActive: boolean) => {
    try {
      await toggleMutation.mutateAsync({ id: modelId, isActive: !currentActive });
    } catch (e: any) {
      toast.error(e.message || "Failed to update model status.");
    }
  };

  const handleSetDefault = async (modelId: string) => {
    try {
      await setDefaultMutation.mutateAsync({ id: modelId });
    } catch (e: any) {
      toast.error(e.message || "Failed to set default model.");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/30 dark:bg-zinc-950/20">
      {/* HEADER SECTION */}
      <DashboardHeader 
        title="AI Generative Models"
        description="Manage available Google GenAI models and select the default engine for form generation."
        icon={
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Shield className="h-5 w-5" />
          </div>
        }
      />

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MODELS LIST CARD */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-outfit text-lg font-bold flex items-center gap-2 px-1 text-foreground">
            <Sliders className="h-4 w-4 text-muted-foreground" />
            Available Models
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models?.map((model) => (
              <Card 
                key={model.id} 
                className={`relative overflow-hidden border transition-all duration-300 hover:shadow-md ${
                  model.isDefault 
                    ? "border-primary/50 shadow-sm bg-primary/[0.02] dark:bg-primary/[0.01]" 
                    : "border-border"
                }`}
              >
                {model.isDefault && (
                  <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden">
                    <div className="absolute top-2 right-[-24px] rotate-45 bg-primary text-primary-foreground text-[9px] font-bold py-0.5 px-6 text-center select-none tracking-widest shadow-sm">
                      DEFAULT
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-6 w-6 rounded-md bg-indigo-500/10 dark:bg-indigo-500/5 flex items-center justify-center">
                      <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground uppercase font-semibold">{model.provider}</span>
                  </div>
                  <CardTitle className="font-outfit text-lg font-bold text-foreground">
                    {model.name}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs select-all text-muted-foreground">
                    {model.id}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-sm">
                    <span className="text-muted-foreground font-semibold">Status</span>
                    <button
                      onClick={() => handleToggleActive(model.id, model.isActive)}
                      disabled={model.isDefault || toggleMutation.isLoading}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        model.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      } disabled:opacity-50 disabled:pointer-events-none`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${model.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
                      {model.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <div className="pt-2">
                    {model.isDefault ? (
                      <Button className="w-full h-9 gap-1.5 bg-primary/10 hover:bg-primary/10 text-primary border border-primary/20 cursor-default font-bold text-xs" variant="ghost">
                        <CheckCircle2 className="h-4 w-4" />
                        Current System Default
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSetDefault(model.id)}
                        disabled={!model.isActive || setDefaultMutation.isLoading}
                        className="w-full h-9 font-bold text-xs"
                        variant="outline"
                      >
                        Set as System Default
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SYSTEM STATUS CARD */}
        <div className="space-y-6">
          <h2 className="font-outfit text-lg font-bold flex items-center gap-2 px-1 text-foreground">
            <Globe className="h-4 w-4 text-muted-foreground" />
            GenAI Config
          </h2>

          <Card className="border border-border bg-card/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="font-outfit text-md font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Active SDK Engine
              </CardTitle>
              <CardDescription className="font-medium text-xs">Details of the server's AI integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm font-medium">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Google SDK version</span>
                <span className="font-mono font-bold text-foreground">@google/genai (v0.1.x)</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Active default model</span>
                <span className="font-mono font-bold text-primary">{defaultModel?.id || "gemini-2.5-flash"}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">API key status</span>
                {systemStatus?.mockFallback ? (
                  <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                    <AlertTriangle className="h-4 w-4" />
                    Mock Fallback Mode
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                    Key Configured (Live)
                  </span>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-3.5 text-xs text-muted-foreground leading-relaxed font-medium">
                <p>
                  We have successfully migrated the backend API server to the unified Google GenAI SDK.
                </p>
                <p className="mt-2 font-bold text-foreground">
                  Note: Changes to the default model will apply instantly to all subsequent form building, AI theme generation, and submission analysis tasks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
