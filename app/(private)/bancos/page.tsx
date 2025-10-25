'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Trash2 } from 'lucide-react';
import { useBancos, useDeleteBanco } from '@/lib/hooks/use-bancos';
import { NovoBancoForm } from '@/components/forms/novo-banco-form';
import { toast } from 'sonner';
import { VideoLoader } from '@/components/providers/video-loader';
import Guard from '@/components/Guard';
import { useRole } from '@/hooks/useRole';

export default function BancosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: bancos, isLoading } = useBancos();
  const deleteBanco = useDeleteBanco();
  const { role, loading } = useRole();
  const isUser = !loading && role === 'user';

  const handleDelete = async (id: number, nome: string) => {
    if (!isUser) {
      toast.error('Ação não permitida para convidados.');
      return;
    }
    try {
      await deleteBanco.mutateAsync(id);
      toast.success(`Banco "${nome}" excluído com sucesso!`);
    } catch {}
  };

  if (isLoading) {
    return (
      <Guard allow={['user', 'guest']}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Bancos</h1>
          </div>
          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <VideoLoader
              open
              src="/loader-amigo.mp4"
              size={96}
              label="Ativando Servidores, espere um pouquinho (por favor)"
            />
          </div>
        </div>
      </Guard>
    );
  }

  return (
    <Guard allow={['user', 'guest']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Bancos</h1>
            <p className="text-muted-foreground">Gerencie os bancos responsáveis pelas suas receitas</p>
          </div>

          {isUser && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Banco
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Banco</DialogTitle>
                  <DialogDescription>Cadastre um novo banco ou forma de pagamento</DialogDescription>
                </DialogHeader>
                <NovoBancoForm onSuccess={() => setDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Bancos</CardTitle>
            <CardDescription>{bancos?.length || 0} banco(s) cadastrado(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {!bancos?.length ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum banco cadastrado</p>
                {isUser && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Clique em &quot;Novo Banco&quot; para começar
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bancos.map((banco) => (
                      <TableRow key={banco.id}>
                        <TableCell className="font-medium">{banco.id}</TableCell>
                        <TableCell>{banco.nome}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{banco.tipo}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isUser && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir esse banco &quot;{banco.nome}&quot;? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(banco.id, banco.nome)}
                                      disabled={deleteBanco.isPending}
                                    >
                                      {deleteBanco.isPending ? 'Excluindo...' : 'Excluir'}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
      </div>
    </Guard>
  );
}
