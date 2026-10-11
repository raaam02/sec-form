"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuthModal } from "@/components/auth/AuthModalContext";
import { TemplateGallery } from "@/components/templates";

export default function ExplorePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const tExplore = useTranslations("Explore");
  const { openAuthModal } = useAuthModal();

  const handleUseTemplate = (templateId: string) => {
    if (!session) {
      openAuthModal("login", `/dashboard?createTemplate=${templateId}`);
      return;
    }
    router.push(`/dashboard?createTemplate=${templateId}`);
  };

  return (
    <div className="pt-32 sm:pt-36 pb-24 container mx-auto px-4 sm:px-6 max-w-6xl">
      <TemplateGallery
        onUseTemplate={handleUseTemplate}
        headerSlot={
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {tExplore("title")}
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              {tExplore("subtitle")}
            </p>
          </div>
        }
      />
    </div>
  );
}
