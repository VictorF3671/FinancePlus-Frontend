import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Plus } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Bem-vindo ao Finance+ Ielune
        </h1>
        <p className="text-lg text-muted-foreground">
          Gerencie suas receitas, despesas e bancos de forma simples e eficiente
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
    </div>
  );
}