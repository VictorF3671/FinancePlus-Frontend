'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { DespesaForm } from '@/components/forms/despesa-form'; // seu form de CREATE
import { cn } from '@/lib/utils';
import { formatDate, toUtcIso } from '@/lib/date';
import { useUpdateDespesa } from '@/lib/hooks/use-receitas';

type Mode = 'create' | 'edit';

type EditInitialValues = {
  id: number;
  data: string;            // ISO (ex.: "2025-08-18T00:00:00Z")
  descricao: string;
  valor: number;
};

type Props = {
  mode: Mode;
  receitaId: number;
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  // somente para edit:
  initialValues?: EditInitialValues;
  titleOverride?: string;
  descriptionOverride?: string;
};

// schema para edição (espelha o de create)
const editSchema = z.object({
  data: z.date({ required_error: 'Data é obrigatória' }),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
});
type EditValues = z.infer<typeof editSchema>;

export function EditDespesaDialog({
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
  const setOpen = (v: boolean) => (controlled ? onOpenChange?.(v) : setInternalOpen(v));

  // ==== EDIT ====
  const updDesp = useUpdateDespesa(receitaId);
  const form = useForm<EditValues>({
    resolver: zodResolver(editSchema),
    defaultValues:
      mode === 'edit' && initialValues
        ? {
            data: new Date(initialValues.data),
            descricao: initialValues.descricao,
            valor: initialValues.valor,
          }
        : undefined,
  });

  async function onSubmitEdit(values: EditValues) {
    if (!initialValues) return;
    await updDesp.mutateAsync({
      id: initialValues.id,
      payload: {
        data: toUtcIso(values.data),
        descricao: values.descricao,
        valor: values.valor,
      },
    });
    toast.success('Despesa atualizada!');
    setOpen(false);
    onSuccess?.();
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {titleOverride ?? (mode === 'create' ? 'Registrar Despesa' : 'Editar Despesa')}
          </DialogTitle>
          <DialogDescription>
            {descriptionOverride ??
              (mode === 'create'
                ? 'Registre uma nova despesa associada a esta receita'
                : 'Atualize as informações da despesa')}
          </DialogDescription>
        </DialogHeader>

        {mode === 'create' ? (
          // ===== CREATE usa seu form existente =====
          <DespesaForm
            receitaId={receitaId}
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
            onCancel={() => setOpen(false)}
          />
        ) : (
          // ===== EDIT =====
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              'pl-3 justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value.toISOString())
                            ) : (
                              <span>Selecione a data</span>
                            )}
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
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição *</FormLabel>
                    <FormControl>
                      <Input placeholder="Descrição da despesa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
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
                <Button type="submit" disabled={updDesp.isPending}>
                  {updDesp.isPending ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}