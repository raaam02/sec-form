"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Shield, Cpu, CheckCircle2, AlertTriangle, ToggleLeft, ToggleRight, Sparkles, Sliders, Globe, Users, Search, Calendar, FileText, BarChart3, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { LoadingSpinner } from "@sec-form/ui";
import { trpc } from "../../../utils/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useGlobalShortcut } from "@/components/providers/GlobalShortcutProvider";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

// Cast trpc to bypass Next.js 15 type collision checks
const trpcAny = trpc as any;

const PUBLIC_FORM_LIMIT = 5;

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"models" | "users">("models");
  const [searchTerm, setSearchTerm] = useState("");

  // tRPC hooks
  const utils = trpcAny.useUtils();
  
  useGlobalShortcut("refresh-models", "ctrl+r", "Refresh Models", () => {
    utils.admin.getModels.invalidate();
    utils.admin.getUsers.invalidate();
    toast.info("Refreshing data...");
  }, "Admin Tools");

  const { data: models, isLoading: isModelsLoading, error: modelsError } = trpcAny.admin.getModels.useQuery(undefined, {
    enabled: status === "authenticated" && session?.user?.role === "admin",
  });

  const { data: systemStatus } = trpcAny.admin.getSystemStatus.useQuery(undefined, {
    enabled: status === "authenticated" && session?.user?.role === "admin",
  });

  const { data: usersData, isLoading: isUsersLoading, refetch: refetchUsers } = trpcAny.admin.getUsers.useQuery(undefined, {
    enabled: status === "authenticated" && session?.user?.role === "admin" && activeTab === "users",
  });

  const { data: plansList } = trpcAny.admin.getPlans.useQuery(undefined, {
    enabled: status === "authenticated" && session?.user?.role === "admin" && activeTab === "users",
  });

  const toggleMutation = trpcAny.admin.toggleModelActive.useMutation({
    onSuccess: () => {
      utils.admin.getModels.invalidate();
      toast.success("Model status updated");
    },
  });

  const setDefaultMutation = trpcAny.admin.setDefaultModel.useMutation({
    onSuccess: () => {
      utils.admin.getModels.invalidate();
      toast.success("Default model updated");
    },
  });

  const updatePlanMutation = trpcAny.admin.updateUserPlan.useMutation({
    onSuccess: () => {
      refetchUsers();
      toast.success("User subscription plan updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update user plan");
    }
  });

  // Redirect if not authorized
  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard/admin");
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

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

  const handleUpdatePlan = async (userId: string, planId: string) => {
    try {
      await updatePlanMutation.mutateAsync({ userId, planId });
    } catch (e) {
      // Error handled by mutation onError callback
    }
  };

  // TanStack Table setup
  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true } // Default sorting: registered date descending
  ]);

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User avatar"}
                  className="h-9 w-9 rounded-full object-cover shrink-0 select-none border border-border/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-outfit text-sm shrink-0 select-none">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-outfit text-sm font-bold text-foreground truncate">{user.name || "Unnamed User"}</p>
                {user.role === "admin" && (
                  <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
          return (
            <span className="text-xs font-medium text-muted-foreground select-all truncate block max-w-full">
              {row.original.email}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Registered",
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          return (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
              {date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
            </span>
          );
        },
      },
      {
        accessorKey: "formCount",
        header: "Forms",
        cell: ({ row }) => {
          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-foreground font-mono">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {row.original.formCount}
            </span>
          );
        },
      },
      {
        accessorKey: "responseCount",
        header: "Responses",
        cell: ({ row }) => {
          return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-semibold text-foreground font-mono">
              <BarChart3 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              {row.original.responseCount}
            </span>
          );
        },
      },
      {
        accessorKey: "planId",
        header: "Subscription",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Select
              value={user.planId}
              onValueChange={(val) => handleUpdatePlan(user.id, val)}
              disabled={updatePlanMutation.isLoading}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs font-semibold rounded-lg bg-card border-border hover:bg-accent transition-colors">
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                {plansList?.map((plan: any) => (
                  <SelectItem key={plan.id} value={plan.id} className="text-xs font-semibold">
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      },
    ],
    [plansList, updatePlanMutation.isLoading]
  );

  const table = useReactTable({
    data: usersData || [],
    columns,
    state: {
      sorting,
      globalFilter: searchTerm,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchTerm,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (status === "loading" || (status === "authenticated" && activeTab === "models" && isModelsLoading)) {
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

  if (activeTab === "models" && modelsError) {
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

  const defaultModel = models?.find((m: any) => m.isDefault);

  // Summary Metrics
  const totalUsers = usersData?.length || 0;
  const totalForms = usersData?.reduce((acc: number, u: any) => acc + (u.formCount || 0), 0) || 0;
  const totalResponses = usersData?.reduce((acc: number, u: any) => acc + (u.responseCount || 0), 0) || 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-50/30 dark:bg-zinc-950/20">
      {/* HEADER SECTION */}
      <DashboardHeader 
        title={activeTab === "models" ? "AI Generative Models" : "User Management"}
        description={
          activeTab === "models" 
            ? "Manage available Google GenAI models and select the default engine for form generation."
            : "View registered users, track form metrics, response counts, and manage subscription tiers."
        }
        icon={
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Shield className="h-5 w-5" />
          </div>
        }
      />

      {/* TABS HEADER */}
      <div className="flex border-b border-border px-6 md:px-8 bg-card shrink-0 select-none">
        <button
          onClick={() => setActiveTab("models")}
          className={`flex items-center gap-2 py-4 px-4 font-outfit text-sm font-bold border-b-2 transition-all ${
            activeTab === "models"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Cpu className="h-4 w-4" />
          AI Models
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 py-4 px-4 font-outfit text-sm font-bold border-b-2 transition-all ${
            activeTab === "users"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Users List
        </button>
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "models" ? (
          /* TAB 1: AI MODELS CONFIGURATION */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* MODELS LIST CARD */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-outfit text-lg font-bold flex items-center gap-2 px-1 text-foreground">
                <Sliders className="h-4 w-4 text-muted-foreground" />
                Available Models
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {models?.map((model: any) => (
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
        ) : (
          /* TAB 2: USER SUBSCRIPTIONS & STATS MANAGEMENT (TanStack React Table) */
          <div className="space-y-6 animate-fadeIn">
            {/* OVERVIEW STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border border-border bg-card/45">
                <CardHeader className="py-4 pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Users</CardDescription>
                </CardHeader>
                <CardContent className="py-2 pt-0 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-foreground font-outfit">{totalUsers}</span>
                  <Users className="h-5 w-5 text-indigo-500 opacity-60" />
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/45">
                <CardHeader className="py-4 pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider">Forms Created</CardDescription>
                </CardHeader>
                <CardContent className="py-2 pt-0 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-foreground font-outfit">{totalForms}</span>
                  <FileText className="h-5 w-5 text-emerald-500 opacity-60" />
                </CardContent>
              </Card>

              <Card className="border border-border bg-card/45">
                <CardHeader className="py-4 pb-2">
                  <CardDescription className="text-xs font-bold uppercase tracking-wider">Responses Got</CardDescription>
                </CardHeader>
                <CardContent className="py-2 pt-0 flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-foreground font-outfit">{totalResponses}</span>
                  <BarChart3 className="h-5 w-5 text-primary opacity-60" />
                </CardContent>
              </Card>
            </div>

            {/* SEARCH BAR */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 w-full bg-card rounded-xl text-sm animate-fadeIn"
                />
              </div>
            </div>

            {/* USERS TABLE CONTAINER */}
            {isUsersLoading ? (
              <div className="flex flex-col items-center justify-center p-12 bg-card rounded-xl border border-border">
                <LoadingSpinner className="w-8 h-8 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground mt-2.5 font-medium">Fetching users list...</span>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Table Header (Desktop - Grid columns total 7) */}
                {table.getHeaderGroups().map((headerGroup) => (
                  <div 
                    key={headerGroup.id} 
                    className="hidden md:grid grid-cols-7 gap-4 p-4 bg-muted/20 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider select-none"
                  >
                    {headerGroup.headers.map((header) => {
                      const isUserCol = header.column.id === "name";
                      const colSpanClass = isUserCol ? "col-span-2" : "col-span-1";
                      
                      return (
                        <div 
                          key={header.id} 
                          className={`${colSpanClass} flex items-center ${
                            header.column.id === "formCount" || header.column.id === "responseCount" ? "justify-center" : "justify-start"
                          }`}
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                                header.column.getCanSort() ? "cursor-pointer select-none" : "cursor-default"
                              }`}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort() && (
                                <span>
                                  {{
                                    asc: <ArrowUp className="ml-1 h-3 w-3 text-primary" />,
                                    desc: <ArrowDown className="ml-1 h-3 w-3 text-primary" />,
                                  }[header.column.getIsSorted() as string] ?? <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />}
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
                
                {/* Table Rows */}
                <div className="divide-y divide-border/60">
                  {table.getRowModel().rows.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm font-medium">
                      No users found matching search criteria.
                    </div>
                  ) : (
                    table.getRowModel().rows.map((row) => (
                      <div 
                        key={row.id} 
                        className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 items-center hover:bg-muted/5 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => {
                          const isUserCol = cell.column.id === "name";
                          const colSpanClass = isUserCol ? "col-span-1 md:col-span-2" : "col-span-1";
                          
                          // Mobiles label mapping helpers
                          const headerLabel = cell.column.id === "email" ? "Email:" 
                            : cell.column.id === "createdAt" ? "Registered:" 
                            : cell.column.id === "formCount" ? "Forms:" 
                            : cell.column.id === "responseCount" ? "Responses:" 
                            : cell.column.id === "planId" ? "Plan:" : "";

                          return (
                            <div 
                              key={cell.id} 
                              className={`flex md:block items-center justify-between ${colSpanClass} ${
                                cell.column.id === "formCount" || cell.column.id === "responseCount" ? "md:text-center" : "md:text-left"
                              } min-w-0`}
                            >
                              {/* Mobile Only Label */}
                              {!isUserCol && (
                                <span className="md:hidden font-bold uppercase tracking-wider text-[10px] text-muted-foreground/70 shrink-0">
                                  {headerLabel}
                                </span>
                              )}
                              
                              <div className="min-w-0 max-w-full">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* PAGINATION CONTROLS */}
                <div className="flex items-center justify-between p-4 border-t border-border bg-muted/10">
                  <div className="text-xs text-muted-foreground font-medium">
                    Showing <span className="font-semibold text-foreground">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span> to{" "}
                    <span className="font-semibold text-foreground">
                      {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                      )}
                    </span>{" "}
                    of <span className="font-semibold text-foreground">{table.getFilteredRowModel().rows.length}</span> users
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="h-8 rounded-lg text-xs font-semibold"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
