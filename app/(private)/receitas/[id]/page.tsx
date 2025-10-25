'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, TrendingUp, TrendingDown, Pencil, Trash2 } from 'lucide-react';
import { useReceita, useDeleteValorDiario, useDeleteDespesa } from '@/lib/hooks/use-receitas';
import { ValorDiarioForm } from '@/components/forms/valor-diario-form';
import { DespesaForm } from '@/components/forms/despesa-form';
import { formatDate } from '@/lib/date';
import { formatCurrency } from '@/lib/currency';
import { toast } from 'sonner';
import { EditDespesaDialog } from '@/components/forms/edit-despesa-form';
import { EditValorDiarioDialog } from '@/components/forms/edit-valor-diario-form';
import Guard from '@/components/Guard';
import { useRole } from '@/hooks/useRole';
import { can } from '@/lib/roles';

export default function ReceitaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const receitaId = Number(params.id);

  const [valorDialogOpen, setValorDialogOpen] = useState(false);
  const [despesaDialogOpen, setDespesaDialogOpen] = useState(false);

  const { data: receita, isLoading } = useReceita(receitaId);
  const delValor = useDeleteValorDiario(receitaId);
  const delDesp = useDeleteDespesa(receitaId);
  const { role } = useRole();
  const isUser = !!role && can.create(role);

  if (isLoading) {
    return (
      <Guard allow={['user', 'guest']}>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </Guard>
    );
  }

  if (!receita) {
    return (
      <Guard allow={['user', 'guest']}>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Receita não encontrada</p>
          <Button onClick={() => router.push('/receitas')} className="mt-4">
            Voltar para receitas
          </Button>
        </div>
      </Guard>
    );
  }

  const valoresOrdenados = [...receita.valoresDiarios].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );
  const despesasOrdenadas = [...receita.despesas].sort(
    (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime()
  );
  const totalValores = valoresOrdenados.reduce((acc, v) => acc + v.valor, 0);
  const totalDespesas = despesasOrdenadas.reduce((acc, d) => acc + d.valor, 0);
  const saldo = totalValores - totalDespesas;

  return (
    <Guard allow={['user', 'guest']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/receitas')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{receita.nome}</h1>
              <p className="text-muted-foreground">{receita.descricao || 'Sem descrição'}</p>
            </div>
          </div>
          <Badge variant="secondary">{receita.bancoResponsavelNome}</Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Valores</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValores)}</div>
              <p className="text-xs text-muted-foreground">{valoresOrdenados.length} registro(s)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</div>
              <p className="text-xs text-muted-foreground">{despesasOrdenadas.length} registro(s)</p>
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
              <p className="text-xs text-muted-foreground">Valores - Despesas</p>
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
                    <CardDescription>Registros de valores recebidos por dia</CardDescription>
                  </div>
                  {isUser && (
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
                          <DialogDescription>Registre um novo valor recebido para esta receita</DialogDescription>
                        </DialogHeader>
                        <ValorDiarioForm receitaId={receitaId} onSuccess={() => setValorDialogOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!valoresOrdenados.length ? (
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
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {valoresOrdenados.map((valor) => (
                          <TableRow key={valor.id}>
                            <TableCell>{formatDate(valor.data)}</TableCell>
                            <TableCell>{valor.observacao || <span className="text-muted-foreground">-</span>}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(valor.valor)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isUser && (
                                  <>
                                    <EditValorDiarioDialog
                                      mode="edit"
                                      receitaId={receitaId}
                                      initialValues={{
                                        id: valor.id,
                                        data: valor.data,
                                        observacao: valor.observacao ?? '',
                                        valor: valor.valor,
                                      }}
                                      trigger={
                                        <Button variant="outline" size="sm">
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      }
                                    />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Excluir valor diário</AlertDialogTitle>
                                          <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={async () => {
                                              await delValor.mutateAsync(valor.id);
                                              toast.success('Valor diário excluído!');
                                            }}
                                            disabled={delValor.isPending}
                                          >
                                            {delValor.isPending ? 'Excluindo...' : 'Excluir'}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
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
                    <CardDescription>Despesas associadas a esta receita</CardDescription>
                  </div>
                  {isUser && (
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
                          <DialogDescription>Registre uma nova despesa</DialogDescription>
                        </DialogHeader>
                        <DespesaForm receitaId={receitaId} onSuccess={() => setDespesaDialogOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!despesasOrdenadas.length ? (
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
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {despesasOrdenadas.map((despesa) => (
                          <TableRow key={despesa.id}>
                            <TableCell>{formatDate(despesa.data)}</TableCell>
                            <TableCell>{despesa.descricao}</TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              {formatCurrency(despesa.valor)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isUser && (
                                  <>
                                    <EditDespesaDialog
                                      mode="edit"
                                      receitaId={receitaId}
                                      initialValues={{
                                        id: despesa.id,
                                        data: despesa.data,
                                        descricao: despesa.descricao,
                                        valor: despesa.valor,
                                      }}
                                      trigger={
                                        <Button variant="outline" size="sm">
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                      }
                                    />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Excluir despesa</AlertDialogTitle>
                                          <AlertDialogDescription>Essa ação não pode ser desfeita.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={async () => {
                                              await delDesp.mutateAsync(despesa.id);
                                              toast.success('Despesa excluída!');
                                            }}
                                            disabled={delDesp.isPending}
                                          >
                                            {delDesp.isPending ? 'Excluindo...' : 'Excluir'}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </div>
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
    </Guard>
  );
}
