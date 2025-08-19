'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ValorDiarioForm } from '@/components/forms/valor-diario-form'; // seu form de CREATE
import { cn } from '@/lib/utils';
import { formatDate, toUtcIso } from '@/lib/date';
import { useUpdateValorDiario } from '@/lib/hooks/use-receitas';

type Mode = 'create' | 'edit';

type EditInitialValues = {
  id: number;
  data: string;          // ISO vindo da API
  observacao?: string | null;
  valor: number;
};

type Props = {
  mode: Mode;
  receitaId: number;
  trigger: React.ReactNode;           // botão que abre o dialog
  open?: boolean;                     // opcional: controle externo
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  // Só para modo "edit"
  initialValues?: EditInitialValues;
  titleOverride?: string;
  descriptionOverride?: string;
};

const editSchema = z.object({
  data: z.date({ required_error: 'Data é obrigatória' }),
  observacao: z.string().optional(),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
});

type EditValues = z.infer<typeof editSchema>;


export function EditValorDiarioDialog({
  mode,
  receitaId,
  trigger,
  open,
  onOpenChange,
  onSuccess,
  initialValues,
  titleOverride,
  descriptionOverride,
}: Props) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const controlled = typeof open === 'boolean';
  const isOpen = controlled ? open : internalOpen;

  const setOpen = (v: boolean) => {
    if (controlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  // ====== EDIT MODE (usa form interno + useUpdateValorDiario)
  const updValor = useUpdateValorDiario(receitaId);

  const editForm = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues: mode === 'edit' && initialValues
      ? {
          data: new Date(initialValues.data),
          observacao: initialValues.observacao ?? '',
          valor: initialValues.valor,
        }
      : undefined,
  });

  async function onSubmitEdit(values: EditValues) {
    if (!initialValues) return;

    await updValor.mutateAsync({
      id: initialValues.id,
      payload: {
        data: toUtcIso(values.data),
        observacao: values.observacao || null,
        valor: values.valor,
      },
    });

    toast.success('Valor diário atualizado!');
    setOpen(false);
    onSuccess?.();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {titleOverride ??
              (mode === 'create' ? 'Registrar Valor Diário' : 'Editar Valor Diário')}
          </DialogTitle>
          <DialogDescription>
            {descriptionOverride ??
              (mode === 'create'
                ? 'Registre um novo valor recebido para esta receita'
                : 'Atualize as informações do registro')}
          </DialogDescription>
        </DialogHeader>

        {mode === 'create' ? (
          // ========== CREATE ==========
          <ValorDiarioForm
            receitaId={receitaId}
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
            onCancel={() => setOpen(false)}
          />
        ) : (
          // ========== EDIT ==========
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'pl-3 justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? formatDate(field.value.toISOString()) : <span>Selecione a data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(d) => d && field.onChange(d)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Input placeholder="Observação (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor *</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        value={field.value ?? null}
                        onChange={(n) => field.onChange(n)}
                        placeholder="0,00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={updValor.isPending}>
                  {updValor.isPending ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}