// components/auth/RequireAuth.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const isLogged = !!u;
      setAuthed(isLogged);
      setChecked(true);
      if (!isLogged) {
        const next = encodeURIComponent(pathname || "/home");
        router.replace(`/login?next=${next}`);
      }
    });
    return () => unsub();
  }, [router, pathname]);

  if (!checked) return <div className="p-6 text-center">Carregando…</div>;
  if (!authed) return <div className="p-6 text-center">Redirecionando…</div>;

  return <>{children}</>;
}
