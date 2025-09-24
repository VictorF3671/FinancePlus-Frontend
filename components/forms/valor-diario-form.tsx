'use client';

import { useForm } from 'react-hook-form';
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
import { useAddValorDiario } from '@/lib/hooks/use-receitas';
import { toast } from 'sonner';
import { DialogClose } from '@radix-ui/react-dialog'

const formSchema = z.object({
  data: z.date({ required_error: 'Data é obrigatória' }),
  observacao: z.string().optional(),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
});

type FormValues = z.infer<typeof formSchema>;

interface ValorDiarioFormProps {
  receitaId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ValorDiarioForm({ receitaId, onSuccess, onCancel }: ValorDiarioFormProps) {
  const addValorDiario = useAddValorDiario(receitaId);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observacao: '',
      // começa sem valor para não mascarar enquanto digita
      valor: undefined as unknown as number,
      // data ficará undefined até o usuário selecionar
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await addValorDiario.mutateAsync({
        data: toUtcIso(values.data),              // ex.: "YYYY-MM-DDT00:00:00.000Z"
        observacao: values.observacao || null,
        valor: values.valor,                      // number puro
      });
      toast.success('Valor diário registrado com sucesso!');
      form.reset({
        observacao: '',
        valor: undefined as unknown as number,
        // deixe a data como estava ou zere também, se preferir:
        // data: undefined as unknown as Date
      });
      onSuccess?.();
    } catch {
      // erros já tratados pelo interceptor/toast
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    onSelect={(d) => d && field.onChange(d)} // evita undefined
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
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor *</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value ?? null}   // deixa vazio até digitar
                  onChange={(n) => field.onChange(n)} // recebe number no blur
                  placeholder="0,00"
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
                observacao: '',
                valor: undefined as unknown as number,
                // data: undefined as unknown as Date
              });  onCancel?.()
            }}
          >
            Cancelar
          </Button>
          </DialogClose>
          
          <Button type="submit" disabled={addValorDiario.isPending}>
            {addValorDiario.isPending ? 'Registrando...' : 'Registrar Valor'}
          </Button>
        </div>
      </form>
    </Form>
  );
}