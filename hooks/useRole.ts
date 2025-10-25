"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AppRole, getStoredRole, setStoredRole, clearStoredRole } from "@/lib/roles";

type RoleState = {
  loading: boolean;
  role: AppRole | null;
};

export function useRole(): RoleState {
  const [state, setState] = useState<RoleState>({ loading: true, role: null });

  useEffect(() => {
   
    const first = getStoredRole();
    if (first) {
      setState({ loading: true, role: first });
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        const role: AppRole = u.isAnonymous ? "guest" : "user";
        setStoredRole(role);
        setState({ loading: false, role });
      } else {
        clearStoredRole();
        setState({ loading: false, role: null });
      }
    });

    return () => unsub();
  }, []);

  return state;
}