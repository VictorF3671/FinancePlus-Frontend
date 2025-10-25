/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Trash2 } from "lucide-react";
import { useReceitas, useDeleteReceita } from "@/lib/hooks/use-receitas";
import { NovaReceitaForm } from "@/components/forms/nova-receita-form";
import { formatDate } from "@/lib/date";
import { toast } from "sonner";
import { VideoLoader } from "@/components/providers/video-loader";

import Guard from "@/components/Guard"
import { useRole } from "@/hooks/useRole";
import { can } from "@/lib/roles";

export default function ReceitasPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const { data: receitas, isLoading } = useReceitas();
  const deleteReceita = useDeleteReceita();

  const { role } = useRole(); 
  const isUser = !!role && can.create(role); 

  const handleDelete = async (id: number, nome: string) => {
    if (!role || !can.manage(role)) {
      toast.error("Ação não permitida para convidados.");
      return;
    }
    try {
      await deleteReceita.mutateAsync(id);
      toast.success(`Receita "${nome}" excluída com sucesso!`);
    } catch {
      
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <Guard allow={["user", "guest"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Receitas</h1>
          </div>

          <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
            <VideoLoader
              open
              src="/new-loader.mp4"
              size={96}
              label="Ativando Servidores, espere um pouquinho (por favor)"
            />
          </div>
        </div>
      </Guard>
    );
  }

  return (
    <Guard allow={["user", "guest"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Receitas</h1>
            <p className="text-muted-foreground">
              Gerencie suas receitas e acompanhe valores diários
            </p>
          </div>

          {isUser && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Receita
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Receita</DialogTitle>
                  <DialogDescription>
                    Crie uma nova receita para gerenciar valores diários e despesas
                  </DialogDescription>
                </DialogHeader>
                <NovaReceitaForm
                  onSuccess={() => setDialogOpen(false)}
                  onCancel={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Receitas</CardTitle>
            <CardDescription>
              {receitas?.length || 0} receita(s) cadastrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!receitas?.length ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma receita cadastrada</p>
                
                {isUser && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Clique em &quot;Nova Receita&quot; para começar
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead>Banco</TableHead>
                      <TableHead className="hidden sm:table-cell">Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receitas.map((receita) => (
                      <TableRow key={receita.id}>
                        <TableCell className="font-medium">{receita.nome}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {receita.descricao ? (
                            <span title={receita.descricao}>
                              {truncateText(receita.descricao)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{receita.bancoResponsavelNome}</Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {formatDate(receita.criado_em)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                           
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/receitas/${receita.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                           
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
                                      Tem certeza que deseja excluir a receita &quot;{receita.nome}
                                      &quot;? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(receita.id, receita.nome)}
                                      disabled={deleteReceita.isPending}
                                    >
                                      {deleteReceita.isPending ? "Excluindo..." : "Excluir"}
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
