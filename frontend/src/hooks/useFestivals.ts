import { useCallback, useEffect, useState } from 'react';
import {
  ApiError,
  createFestival,
  deleteFestival as deleteFestivalRequest,
  fetchFestivals,
  updateFestival as updateFestivalRequest,
} from '../api/client';
import type { CreateFestivalInput, Festival } from '../types';

interface UseFestivalsResult {
  festivals: Festival[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  addFestival: (input: CreateFestivalInput) => Promise<void>;
  editFestival: (id: string, input: CreateFestivalInput) => Promise<void>;
  removeFestival: (id: string) => Promise<void>;
  isSubmitting: boolean;
  deletingId: string | null;
}

export function useFestivals(): UseFestivalsResult {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchFestivals()
      .then((data) => {
        if (!cancelled) setFestivals(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Ocorreu um erro inesperado.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  const addFestival = useCallback(async (input: CreateFestivalInput) => {
    setIsSubmitting(true);
    try {
      await createFestival(input);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  const editFestival = useCallback(async (id: string, input: CreateFestivalInput) => {
    setIsSubmitting(true);
    try {
      await updateFestivalRequest(id, input);
      refetch();
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  const removeFestival = useCallback(async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFestivalRequest(id);
      refetch();
    } finally {
      setDeletingId(null);
    }
  }, [refetch]);

  return {
    festivals,
    isLoading,
    error,
    refetch,
    addFestival,
    editFestival,
    removeFestival,
    isSubmitting,
    deletingId,
  };
}
