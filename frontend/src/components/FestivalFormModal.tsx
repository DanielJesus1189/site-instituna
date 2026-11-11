import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateFestivalInput, Festival } from '../types';
import { ChipListInput } from './ChipListInput';

interface FestivalFormModalProps {
  festival?: Festival;
  onClose: () => void;
  onSubmit: (input: CreateFestivalInput, cartaz?: File) => Promise<void>;
  isSubmitting: boolean;
}

const inputClass =
  'w-full border-x-0 border-t-0 border-b border-ink/25 bg-transparent px-0 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-wine focus:ring-0';
const labelClass = 'mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft';

export function FestivalFormModal({
  festival,
  onClose,
  onSubmit,
  isSubmitting,
}: FestivalFormModalProps) {
  const isEditing = Boolean(festival);

  const [name, setName] = useState(festival?.name ?? '');
  const [tunaName, setTunaName] = useState(festival?.tuna.name ?? '');
  const [location, setLocation] = useState(festival?.location ?? '');
  const [date, setDate] = useState(festival?.date ?? '');
  const [premios, setPremios] = useState<string[]>(
    festival?.premios.map((p) => p.name) ?? []
  );
  const [tunasConcurso, setTunasConcurso] = useState<string[]>(
    festival?.tunasConcurso.map((t) => t.name) ?? []
  );
  const [tunasExtra, setTunasExtra] = useState<string[]>(
    festival?.tunasExtra.map((t) => t.name) ?? []
  );
  const [cartazFile, setCartazFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !tunaName.trim() || !location.trim() || !date) {
      setError('Preenche o nome do festival, a tuna, a localidade e a data.');
      return;
    }

    try {
      await onSubmit(
        {
          name: name.trim(),
          tuna: { name: tunaName.trim() },
          location: location.trim(),
          date,
          premios: premios.map((p) => ({ name: p })),
          tunasConcurso: tunasConcurso.map((t) => ({ name: t })),
          tunasExtra: tunasExtra.map((t) => ({ name: t })),
        },
        cartazFile ?? undefined,
      );
      onClose();
    } catch {
      setError(
        isEditing
          ? 'Não foi possível guardar as alterações. Tenta novamente.'
          : 'Não foi possível criar o festival. Tenta novamente.'
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto border border-ink/20 bg-paper shadow-[0_24px_70px_rgba(29,26,22,0.22)]"
      >
        <div className="flex items-start justify-between border-b border-ink/15 px-6 py-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-wine">
              Arquivo
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold">
              {isEditing ? 'Editar festival' : 'Novo festival'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="font-serif text-2xl leading-none text-ink-soft transition-colors hover:text-ink"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div>
            <label className={labelClass}>Nome do festival</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="XIII Viriatus"
            />
          </div>

          <div>
            <label className={labelClass}>Tuna organizadora</label>
            <input
              className={inputClass}
              value={tunaName}
              onChange={(e) => setTunaName(e.target.value)}
              placeholder="Viriatuna"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Localidade</label>
              <input
                className={inputClass}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Viseu"
              />
            </div>
            <div>
              <label className={labelClass}>Data</label>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Cartaz (imagem)</label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="cursor-pointer border border-ink/20 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft transition-colors hover:border-wine hover:text-wine">
                {cartazFile ? 'Trocar ficheiro' : 'Escolher ficheiro'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setCartazFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="min-w-0 flex-1 truncate text-xs text-ink-soft">
                {cartazFile ? cartazFile.name : 'Nenhum ficheiro selecionado'}
              </span>
              {cartazFile && (
                <button
                  type="button"
                  onClick={() => setCartazFile(null)}
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-wine underline decoration-rule underline-offset-4 hover:text-wine-dark"
                >
                  Remover
                </button>
              )}
            </div>
            {festival?.cartazUrl && !cartazFile && (
              <p className="mt-2 text-[11px] text-ink-soft">
                Já tem um cartaz. Seleciona um novo ficheiro para o substituir.
              </p>
            )}
          </div>

          <ChipListInput
            label="Prémios"
            placeholder="Melhor Original"
            values={premios}
            onChange={setPremios}
          />
          <ChipListInput
            label="Tunas a concurso"
            placeholder="Instituna"
            values={tunasConcurso}
            onChange={setTunasConcurso}
          />
          <ChipListInput
            label="Extra concurso"
            placeholder="Estudantina Académica de Lamego"
            values={tunasExtra}
            onChange={setTunasExtra}
          />

          {error && <p className="text-sm font-medium text-wine">{error}</p>}

          <div className="mt-2 flex items-center justify-end gap-6 border-t border-ink/15 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft underline decoration-rule underline-offset-4 hover:text-wine"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-ink bg-ink px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper transition-colors hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'A guardar…' : isEditing ? 'Guardar alterações' : 'Guardar festival'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
