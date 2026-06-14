"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LoadingSpinner } from "@sec-form/ui";
import { trpc } from "../../utils/trpc";
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
    const form = await createFormMutation.mutateAsync({
      title,
      description,
    });
    router.push(`/dashboard/builder/${form.id}`);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-200">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner className="w-10 h-10" color="text-primary" />
          <span className="text-sm text-muted-foreground font-medium">Checking credentials...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col md:flex-row transition-all duration-300">
      
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <DashboardSidebar
        pathname={pathname}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
        user={session.user || {}}
        onSignOut={() => signOut({ callbackUrl: "/" })}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Header */}
        <DashboardMobileHeader
          pathname={pathname}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setIsChangePasswordModalOpen={setIsChangePasswordModalOpen}
          user={session.user || {}}
          onSignOut={() => signOut({ callbackUrl: "/" })}
        />

        {/* Main content container (no global scroll) */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-transparent">
          {children}
        </main>
      </div>

      {/* MODAL: STANDARD CREATE FORM */}
      <CreateFormModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onCreate={handleCreateForm}
      />

      {/* MODAL: CHANGE PASSWORD */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        setIsOpen={setIsChangePasswordModalOpen}
        userEmail={session.user.email || ""}
      />
    </div>
  );
}

