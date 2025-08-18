'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useReceita } from '@/lib/hooks/use-receitas';
import { ValorDiarioForm } from '@/components/forms/valor-diario-form';
import { DespesaForm } from '@/components/forms/despesa-form';
import { formatDate } from '@/lib/date';
import { formatCurrency } from '@/lib/currency';

export default function ReceitaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const receitaId = Number(params.id);
  const [valorDialogOpen, setValorDialogOpen] = useState(false);
  const [despesaDialogOpen, setDespesaDialogOpen] = useState(false);
  
  const { data: receita, isLoading } = useReceita(receitaId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!receita) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Receita não encontrada</p>
        <Button onClick={() => router.push('/receitas')} className="mt-4">
          Voltar para receitas
        </Button>
      </div>
    );
  }

  const totalValores = receita.valoresDiarios.reduce((acc, valor) => acc + valor.valor, 0);
  const totalDespesas = receita.despesas.reduce((acc, despesa) => acc + despesa.valor, 0);
  const saldo = totalValores - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/receitas')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{receita.nome}</h1>
            <p className="text-muted-foreground">
              {receita.descricao || 'Sem descrição'}
            </p>
          </div>
        </div>
        <Badge variant="secondary">
          {receita.bancoResponsavelNome}
        </Badge>
      </div>

      {/* Resumo Financeiro */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Valores</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalValores)}
            </div>
            <p className="text-xs text-muted-foreground">
              {receita.valoresDiarios.length} registro(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDespesas)}
            </div>
            <p className="text-xs text-muted-foreground">
              {receita.despesas.length} registro(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldo)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valores - Despesas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="valores" className="space-y-4">
        <TabsList>
          <TabsTrigger value="valores">Valores Diários</TabsTrigger>
          <TabsTrigger value="despesas">Despesas</TabsTrigger>
        </TabsList>

        <TabsContent value="valores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Valores Diários</CardTitle>
                  <CardDescription>
                    Registros de valores recebidos por dia
                  </CardDescription>
                </div>
                <Dialog open={valorDialogOpen} onOpenChange={setValorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Valor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Valor Diário</DialogTitle>
                      <DialogDescription>
                        Registre um novo valor recebido para esta receita
                      </DialogDescription>
                    </DialogHeader>
                    <ValorDiarioForm
                      receitaId={receitaId}
                      onSuccess={() => setValorDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {!receita.valoresDiarios.length ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum valor registrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Observação</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receita.valoresDiarios.map((valor) => (
                        <TableRow key={valor.id}>
                          <TableCell>{formatDate(valor.data)}</TableCell>
                          <TableCell>
                            {valor.observacao || (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(valor.valor)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="despesas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Despesas</CardTitle>
                  <CardDescription>
                    Despesas associadas a esta receita
                  </CardDescription>
                </div>
                <Dialog open={despesaDialogOpen} onOpenChange={setDespesaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Despesa
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Registrar Despesa</DialogTitle>
                      <DialogDescription>
                        Registre uma nova despesa associada a esta receita
                      </DialogDescription>
                    </DialogHeader>
                    <DespesaForm
                      receitaId={receitaId}
                      onSuccess={() => setDespesaDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {!receita.despesas.length ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma despesa registrada</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {receita.despesas.map((despesa) => (
                        <TableRow key={despesa.id}>
                          <TableCell>{formatDate(despesa.data)}</TableCell>
                          <TableCell>{despesa.descricao}</TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            {formatCurrency(despesa.valor)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}