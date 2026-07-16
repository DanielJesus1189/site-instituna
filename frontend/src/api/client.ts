import type { CreateFestivalInput, Festival } from '../types';

/**
 * Base URL of the festivals API.
 * Configure via a `.env` file: VITE_API_BASE_URL=https://your-api.example.com/api
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError(
      `Não foi possível ligar à API em ${BASE_URL}. Confirma que o servidor está a correr e que VITE_API_BASE_URL está bem configurado.`
    );
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.message ?? '';
    } catch {
      /* ignore body parse errors */
    }
    throw new ApiError(
      detail || `O pedido falhou com o estado ${response.status}.`,
      response.status
    );
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

/** Normalizes a raw API festival record, extracting `id` from `_id` and filling in safe defaults for optional arrays. */
function normalizeFestival(raw: Festival): Festival {
  // The API may return the date as "2026-04-18T00:00:00.000Z" — extract only the date part.
  const date = raw.date?.includes('T') ? raw.date.slice(0, 10) : raw.date;

  return {
    ...raw,
    id: raw._id,
    date,
    premios: (raw.premios ?? []).map((p) => ({
      _id: p._id,
      name: p.name,
    })),
    tunasConcurso: (raw.tunasConcurso ?? []).map((t) => ({
      _id: t._id,
      name: t.name,
    })),
    tunasExtra: (raw.tunasExtra ?? []).map((t) => ({
      _id: t._id,
      name: t.name,
    })),
  };
}

export async function fetchFestivals(): Promise<Festival[]> {
  const body = await request<{ data: Festival[] }>('/festival');
  return (body.data ?? []).map(normalizeFestival);
}

export async function fetchFestivalById(id: string): Promise<Festival> {
  const body = await request<{ data: Festival }>(`/festival/${id}`);
  return normalizeFestival(body.data);
}

export async function createFestival(input: CreateFestivalInput): Promise<Festival> {
  const created = await request<Festival>('/festival', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return normalizeFestival(created);
}

export async function updateFestival(
  id: string,
  input: CreateFestivalInput
): Promise<Festival> {
  const updated = await request<Festival>(`/festival/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
  return normalizeFestival(updated);
}

export async function deleteFestival(id: string): Promise<void> {
  await request<void>(`/festival/${id}`, { method: 'DELETE' });
}
