"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

const DEFAULT_AFTER_LOGIN = "/home";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();

  
  const nextPath = useMemo(() => {
    const n = search?.get("next") ?? "";
    
    if (n && n.startsWith("/")) return n;
    return DEFAULT_AFTER_LOGIN;
  }, [search]);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

 
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        try {
          localStorage.setItem("role", u.isAnonymous ? "guest" : "user");
        } catch {}
        router.replace(nextPath);
      } else {
        try {
          localStorage.removeItem("role");
        } catch {}
      }
    });
    return () => unsub();
  }, [router, nextPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      const emailTrim = email.trim();
      await signInWithEmailAndPassword(auth, emailTrim, pass);
     
    } catch (e: any) {
      setErr(mapFirebaseError(e?.code) || "Falha ao entrar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = async () => {
    setErr(null);
    setSubmitting(true);
    try {
      await signInAnonymously(auth);
     
    } catch (e: any) {
      setErr(mapFirebaseError(e?.code) || "Falha ao entrar como convidado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Acessar sua conta</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="voce@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (err) setErr(null);
                }}
                required
                autoComplete="email"
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value);
                    if (err) setErr(null);
                  }}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute inset-y-0 right-0 px-3 grid place-items-center text-muted-foreground"
                  aria-label={showPass ? "Ocultar senha" : "Mostrar senha"}
                  disabled={submitting}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleGuest}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acessar como convidado"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Ao entrar como convidado, alguns recursos podem ficar restritos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function mapFirebaseError(code?: string): string | null {
  switch (code) {
    case "auth/invalid-email":
      return "E-mail inválido.";
    case "auth/user-disabled":
      return "Usuário desativado.";
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "E-mail ou senha incorretos.";
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    default:
      return null;
  }
}
