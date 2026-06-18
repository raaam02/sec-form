"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LoadingSpinner } from "@sec-form/ui";
import { trpc } from "../../utils/trpc";
import { saveLocalForm } from "../../utils/localForms";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMobileHeader } from "@/components/dashboard/DashboardMobileHeader";
import { CreateFormModal } from "@/components/dashboard/CreateFormModal";
import { ChangePasswordModal } from "@/components/dashboard/ChangePasswordModal";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const createFormMutation = trpc.forms.create.useMutation();

  const handleCreateForm = async (title: string, description: string) => {
    const isDemo = session?.user?.email === "demo@demo.com";
    if (isDemo) {
      const id = crypto.randomUUID();
      const localForm = {
        id,
        title,
        description,
        slug: `form-${Math.random().toString(36).substring(2, 8)}`,
        visibility: "draft" as const,
        schemaJson: {
          fields: [
            {
              id: crypto.randomUUID(),
              type: "text" as const,
              label: "Untitled Question",
              required: false,
              placeholder: "",
            },
          ],
        },
        userId: "demo-user-id",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalForm(localForm);
      router.push(`/dashboard/my-forms/${id}/edit`);
      return;
    }
    const form = await createFormMutation.mutateAsync({
      title,
      description,
    });
    router.push(`/dashboard/builder/${form.id}`);
  };

  // Redirect only when explicitly unauthenticated — never block render on "loading"
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard");
    }
  }, [status, router]);

  // Optimistic shell: render the layout immediately.
  // While auth is loading we show a placeholder sidebar + spinner in content.
  const isAuthChecking = status === "loading";
  const user = session?.user ?? {};

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col md:flex-row transition-all duration-300">

      {/* SIDEBAR NAVIGATION (Desktop) */}
      <DashboardSidebar
        pathname={pathname}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
        user={user}
        onSignOut={() => signOut({ callbackUrl: "/" })}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <DashboardMobileHeader
          pathname={pathname}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
          user={user}
          onSignOut={() => signOut({ callbackUrl: "/" })}
        />

        {/* Main content container */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-transparent">
          {isAuthChecking ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner className="w-8 h-8" color="text-primary" />
                <span className="text-sm text-muted-foreground font-medium animate-pulse">Loading…</span>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* MODAL: STANDARD CREATE FORM */}
      <CreateFormModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onCreate={handleCreateForm}
      />

      {/* MODAL: CHANGE PASSWORD */}
      {session && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          setIsOpen={setIsChangePasswordModalOpen}
          userEmail={session.user.email || ""}
        />
      )}
    </div>
  );
}
