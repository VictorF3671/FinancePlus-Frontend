
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
