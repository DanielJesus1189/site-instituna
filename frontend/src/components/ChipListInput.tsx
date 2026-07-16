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
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-700">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-zinc-300 bg-white p-2 focus-within:border-zinc-500">
        {values.map((value, i) => (
          <span
            key={`${value}-${i}`}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white"
          >
            {value}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remover ${value}`}
              className="leading-none text-white/80 hover:text-white"
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
          className="min-w-[8ch] flex-1 border-none bg-transparent px-1 py-0.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400"
        />
      </div>
      <p className="mt-1 text-[11px] text-zinc-400">Enter ou vírgula para adicionar</p>
    </div>
  );
}
