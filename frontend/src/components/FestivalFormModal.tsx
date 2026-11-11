import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateFestivalInput, Festival } from '../types';
import { ChipListInput } from './ChipListInput';
import { BrushStripes } from './ui/BrushStripes';
import { Button } from './ui/Button';
import { Field } from './ui/Field';

interface FestivalFormModalProps {
  festival?: Festival;
  onClose: () => void;
  onSubmit: (input: CreateFestivalInput, cartaz?: File) => Promise<void>;
  isSubmitting: boolean;
}

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
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="festival-form-title"
      >
        <div className="modal-header">
          <div>
            <p className="label label--navy">Arquivo</p>
            <h2 id="festival-form-title" className="mt-1 font-title text-2xl">
              {isEditing ? 'Editar festival' : 'Novo festival'}
            </h2>
          </div>
          <Button type="button" variant="text" size="small" onClick={onClose} aria-label="Fechar">
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <Field label="Nome do festival" htmlFor="festival-name">
            <input
              id="festival-name"
              className="field-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="XIII Viriatus"
            />
          </Field>

          <Field label="Tuna organizadora" htmlFor="festival-tuna">
            <input
              id="festival-tuna"
              className="field-control"
              value={tunaName}
              onChange={(e) => setTunaName(e.target.value)}
              placeholder="Viriatuna"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Localidade" htmlFor="festival-location">
              <input
                id="festival-location"
                className="field-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Viseu"
              />
            </Field>
            <Field label="Data" htmlFor="festival-date">
              <input
                id="festival-date"
                type="date"
                className="field-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Cartaz (imagem)">
            <div className="flex flex-wrap items-center gap-3">
              <label className="file-picker" htmlFor="festival-cartaz">
                {cartazFile ? 'Trocar ficheiro' : 'Escolher ficheiro'}
                <input
                  id="festival-cartaz"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setCartazFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">
                {cartazFile ? cartazFile.name : 'Nenhum ficheiro selecionado'}
              </span>
              {cartazFile && (
                <Button
                  type="button"
                  variant="text"
                  size="small"
                  onClick={() => setCartazFile(null)}
                >
                  Remover
                </Button>
              )}
            </div>
            {festival?.cartazUrl && !cartazFile && (
              <p className="field-hint mt-2">
                Já tem um cartaz. Seleciona um novo ficheiro para o substituir.
              </p>
            )}
          </Field>

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

          {error && (
            <p className="form-error" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {isSubmitting && <BrushStripes loading className="h-5 w-28 self-center" />}

          <div className="modal-actions">
            <Button type="button" variant="text" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'A guardar…' : isEditing ? 'Guardar alterações' : 'Guardar festival'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
