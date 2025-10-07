import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Plus } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 space-y-6 pb-20"> 
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Bem-vindo ao Finance+ Ielune
          </h1>
          <p className="text-lg text-muted-foreground">
            Este é um site criado para Gerenciar e Visualizar toda a arrecadação da IELUNE em prol ao Atmosfera
            <br />
            Não Crie - Edite - Exclua nenhuma informação - Deixe que Apenas Pessoas Autorizadas manuseiem esses dados
            <br />
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Receitas</CardTitle>
              </div>
              <CardDescription>
                Gerencie suas receitas, valores diários e despesas associadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/receitas">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Acessar Receitas
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Bancos</CardTitle>
              </div>
              <CardDescription>
                Configure e gerencie seus bancos responsáveis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/bancos">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Acessar Bancos
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-200 dark:border-gray-800 bg-background py-3 text-center text-sm text-muted-foreground">
        <p className="px-4">
          Desenvolvedor: <span className="font-medium">Victor Noronha</span> — 
          Product Owner: <span className="font-medium">Pr. Afonso Chunia</span> — 
          Usuário Final: <span className="font-medium">Membros da Igreja Evangelística Luz na Escuridão (IELUNE)</span>
        </p>
      </footer>
    </div>
  );
}
