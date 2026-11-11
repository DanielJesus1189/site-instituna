import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ChipListInputProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export function ChipListInput({ label, placeholder, values, onChange }: ChipListInputProps) {
  const [draft, setDraft] = useState('');

  function commitDraft() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
    } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  }

  function removeAt(index: number) {
    onChange(values.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-2 border border-ink/20 bg-paper/60 p-2.5 transition-colors focus-within:border-wine">
        {values.map((value, i) => (
          <span
            key={`${value}-${i}`}
            className="flex items-center gap-1.5 border border-ink/20 bg-paper-deep/60 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink"
          >
            {value}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remover ${value}`}
              className="leading-none text-ink-soft hover:text-wine"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={values.length === 0 ? placeholder : ''}
          className="min-w-[8ch] flex-1 border-none bg-transparent px-1 py-0.5 text-sm text-ink outline-none placeholder:text-ink-soft/50"
        />
      </div>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink-soft/70">
        Enter ou vírgula para adicionar
      </p>
    </div>
  );
}
