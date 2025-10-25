"use client";

import { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import type { AppRole } from "@/lib/roles";

type GuardProps = {
  allow: AppRole[];
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
};

export default function Guard({ allow, children, redirectTo, fallback }: GuardProps) {
  const { loading, role } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const target = useMemo(
    () => redirectTo ?? `/login?next=${encodeURIComponent(pathname || "/")}`,
    [redirectTo, pathname]
  );

  if (loading) {
    return (
      fallback ?? (
        <div className="min-h-dvh grid place-items-center">
          <p className="text-muted-foreground">Carregando…</p>
        </div>
      )
    );
  }

  if (!role) {
    if (pathname !== "/login") router.replace(target);
    return null;
  }

  if (!allow.includes(role)) {
    router.replace(target);
    return null;
  }

  return <>{children}</>;
}
