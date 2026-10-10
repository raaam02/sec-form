"use client";

import React from "react";
import { useParams } from "next/navigation";
import { UnifiedFormBuilder } from "@/components/builder/UnifiedFormBuilder";

export default function BuilderPage() {
  const params = useParams();
  const id = params.id as string;

  return <UnifiedFormBuilder id={id} />;
}
