import type { CreateFestivalInput } from '../types';
import { FestivalFormModal } from './FestivalFormModal';

interface AddFestivalModalProps {
  onClose: () => void;
  onSubmit: (input: CreateFestivalInput) => Promise<void>;
  isSubmitting: boolean;
}

/** Backwards-compatible wrapper around the shared festival form. */
export function AddFestivalModal({ onClose, onSubmit, isSubmitting }: AddFestivalModalProps) {
  return (
    <FestivalFormModal
      onClose={onClose}
      onSubmit={(input) => onSubmit(input)}
      isSubmitting={isSubmitting}
    />
  );
}
