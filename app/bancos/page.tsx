'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Plus, Building2 } from 'lucide-react';
import { useBancos } from '@/lib/hooks/use-bancos';
import { NovoBancoForm } from '@/components/forms/novo-banco-form';

export default function BancosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: bancos, isLoading } = useBancos();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bancos</h1>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bancos</h1>
          <p className="text-muted-foreground">
            Gerencie os bancos responsáveis pelas suas receitas
          </p>
        </div>
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
              <DialogDescription>
                Cadastre um novo banco ou forma de pagamento
              </DialogDescription>
            </DialogHeader>
            <NovoBancoForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Bancos</CardTitle>
          <CardDescription>
            {bancos?.length || 0} banco(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!bancos?.length ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum banco cadastrado</p>
              <p className="text-sm text-muted-foreground mt-2">
                Clique em "Novo Banco" para começar
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bancos.map((banco) => (
                    <TableRow key={banco.id}>
                      <TableCell className="font-medium">
                        {banco.id}
                      </TableCell>
                      <TableCell>{banco.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{banco.tipo}</Badge>
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
  );
}