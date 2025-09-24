'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CurrencyInput } from '@/components/ui/currency-input';
import { cn } from '@/lib/utils';
import { formatDate, toUtcIso } from '@/lib/date';
import { useAddDespesa } from '@/lib/hooks/use-receitas';
import { toast } from 'sonner';
import { DialogClose } from '@radix-ui/react-dialog';

// Schema: usa undefined como vazio (sem null)
const formSchema = z.object({
  data: z
    .date()
    .optional()
    .refine((d): d is Date => d instanceof Date, { message: 'Data é obrigatória' }),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
});

type FormValues = z.infer<typeof formSchema>;

interface DespesaFormProps {
  receitaId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DespesaForm({ receitaId, onSuccess, onCancel }: DespesaFormProps) {
  const addDespesa = useAddDespesa(receitaId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: undefined,           // <- usa undefined, não null
      descricao: '',
      valor: undefined as unknown as number, // começa vazio
    },
  });

  const isSubmitting = addDespesa.isPending;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    await addDespesa.mutateAsync({
      data: toUtcIso(values.data as Date), // refine garante Date
      descricao: values.descricao,
      valor: values.valor,                 // number puro
    });
    toast.success('Despesa registrada com sucesso!');
    form.reset({
      data: undefined,
      descricao: '',
      valor: undefined as unknown as number,
    });
    onSuccess?.();
  };

  return (
    <Form<FormValues> {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField<FormValues, 'data'>
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
                      disabled={isSubmitting}
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
                    selected={field.value}               // Date | undefined
                    onSelect={(d) => field.onChange(d)} // sem null
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues, 'descricao'>
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Descrição da despesa"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues, 'valor'>
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor *</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value ?? null}           // deixa vazio até digitar
                  onChange={(n) => field.onChange(n)}   // devolve number no blur
                  placeholder="0,00"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
               {form.reset({
                data: undefined,
                descricao: '',
                valor: undefined as unknown as number,
              }); onCancel?.()
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          </DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registrando...' : 'Registrar Despesa'}
          </Button>
        </div>
      </form>
    </Form>
  );
}