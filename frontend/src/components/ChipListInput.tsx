import { useId, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ChipListInputProps {
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (values: string[]) => void;
}

export function ChipListInput({ label, placeholder, values, onChange }: ChipListInputProps) {
  const [draft, setDraft] = useState('');
  const inputId = useId();

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
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <div className="chip-box mt-1.5">
        {values.map((value, i) => (
          <span key={`${value}-${i}`} className="chip">
            {value}
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label={`Remover ${value}`}
              className="chip__remove"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={inputId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitDraft}
          placeholder={values.length === 0 ? placeholder : ''}
          className="chip-input"
        />
      </div>
      <p className="field-hint mt-1">Enter ou vírgula para adicionar</p>
    </div>
  );
}
