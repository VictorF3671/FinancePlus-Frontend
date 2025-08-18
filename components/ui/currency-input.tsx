'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, parseCurrency } from '@/lib/currency';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | null;
  onChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ onChange, value, ...props }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // permite usar ref externo + interno
    const setRefs = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
    };

    React.useEffect(() => {
      if (!isEditing) {
        if (typeof value === 'number' && !isNaN(value)) {
          setDisplayValue(formatCurrency(value));
        } else {
          setDisplayValue('');
        }
      }
    }, [value, isEditing]);

    const toRaw = (n?: number | null) => {
      if (typeof n !== 'number' || isNaN(n)) return '';
      return String(n).replace('.', ','); // durante edição: sem "R$"
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsEditing(true);
      setDisplayValue(toRaw(value));

      // tentar selecionar TUDO, mas com guarda
      const el = inputRef.current ?? e.currentTarget;
      requestAnimationFrame(() => {
        if (el && document.activeElement === el && typeof el.select === 'function') {
          try { el.select(); } catch {}
        }
      });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d.,-]/g, '');
      setDisplayValue(raw);
      const n = parseCurrency(raw);
      if (!isNaN(n)) onChange?.(n); // RHF recebe number durante a edição (opcional)
    };

    const handleBlur = () => {
      setIsEditing(false);
      const n = parseCurrency(displayValue);
      onChange?.(n);
      setDisplayValue(!isNaN(n) ? formatCurrency(n) : '');
    };

    return (
      <Input
        ref={setRefs}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        value={displayValue}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };