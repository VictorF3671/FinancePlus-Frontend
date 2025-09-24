'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateBanco } from '@/lib/hooks/use-bancos';
import { toast } from 'sonner';
import { DialogClose } from '@radix-ui/react-dialog';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
});

type FormValues = z.infer<typeof formSchema>;

interface NovoBancoFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovoBancoForm({ onSuccess, onCancel }: NovoBancoFormProps) {
  const createBanco = useCreateBanco();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      tipo: '',
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createBanco.mutateAsync(values);
      toast.success('Banco criado com sucesso!');
      form.reset();
      onSuccess?.();
    } catch (error) {
      // Erro já tratado pelo interceptor
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Nome do banco" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo *</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Conta Corrente, Poupança, Espécie..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            onClick={() => {form.reset(); onCancel?.() }}
            
          >
            Cancelar
          </Button>
          </DialogClose>
          <Button type="submit" disabled={createBanco.isPending}>
            {createBanco.isPending ? 'Criando...' : 'Criar Banco'}
          </Button>
        </div>
      </form>
    </Form>
  );
}