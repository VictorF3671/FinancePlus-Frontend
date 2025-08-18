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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateReceita } from '@/lib/hooks/use-receitas';
import { useBancos } from '@/lib/hooks/use-bancos';
import { toast } from 'sonner';
import { DialogClose } from '@radix-ui/react-dialog';

const formSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  bancoResponsavelId: z.coerce.number().min(1, 'Banco responsável é obrigatório'),
});

type FormValues = z.infer<typeof formSchema>;

interface NovaReceitaFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NovaReceitaForm({ onSuccess, onCancel }: NovaReceitaFormProps) {
  const { data: bancos, isLoading: bancosLoading } = useBancos();
  const createReceita = useCreateReceita();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      bancoResponsavelId: 0,
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createReceita.mutateAsync({
        nome: values.nome,
        descricao: values.descricao || null,
        bancoResponsavelId: values.bancoResponsavelId,
      });
      toast.success('Receita criada com sucesso!');
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
                <Input placeholder="Nome da receita" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição da receita (opcional)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bancoResponsavelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banco Responsável *</FormLabel>
              <Select
                onValueChange={field.onChange}
                disabled={bancosLoading}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o banco" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bancos?.map((banco) => (
                    <SelectItem key={banco.id} value={banco.id.toString()}>
                      {banco.nome} ({banco.tipo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          <Button type="submit" disabled={createReceita.isPending}>
            {createReceita.isPending ? 'Criando...' : 'Criar Receita'}
          </Button>
        </div>
      </form>
    </Form>
  );
}