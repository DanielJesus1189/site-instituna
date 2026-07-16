import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateFestivalInput, Festival } from '../types';
import { ChipListInput } from './ChipListInput';

interface FestivalFormModalProps {
  festival?: Festival;
  onClose: () => void;
  onSubmit: (input: CreateFestivalInput) => Promise<void>;
  isSubmitting: boolean;
}

const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-500';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-zinc-700';

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
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !tunaName.trim() || !location.trim() || !date) {
      setError('Preenche o nome do festival, a tuna, a localidade e a data.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        tuna: { name: tunaName.trim() },
        location: location.trim(),
        date,
        premios: premios.map((p) => ({ name: p })),
        tunasConcurso: tunasConcurso.map((t) => ({ name: t })),
        tunasExtra: tunasExtra.map((t) => ({ name: t })),
      });
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-900 px-5 py-3.5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
            {isEditing ? 'Editar Festival' : 'Novo Festival'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-lg leading-none text-white/70 hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
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

          <div className="grid grid-cols-2 gap-3">
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

          <ChipListInput
            label="Prémios"
            placeholder="Melhor Original"
            values={premios}
            onChange={setPremios}
          />
          <ChipListInput
            label="Tunas a Concurso"
            placeholder="Instituna"
            values={tunasConcurso}
            onChange={setTunasConcurso}
          />
          <ChipListInput
            label="Extra Concurso"
            placeholder="Estudantina Académica de Lamego"
            values={tunasExtra}
            onChange={setTunasExtra}
          />

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'A guardar…' : isEditing ? 'Guardar alterações' : 'Guardar festival'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
