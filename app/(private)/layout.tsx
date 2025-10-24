import RequireAuth from "@/components/auth/RequireAuth";
import { Header } from "@/components/layout/header";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-6 px-4">{children}</main>
      </div>
    </RequireAuth>
  );
}