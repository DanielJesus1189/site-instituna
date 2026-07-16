export interface Premio {
  _id?: string;
  name: string;
}

export interface TunaRef {
  _id?: string;
  name: string;
}

/** A festival as returned by the API. */
export interface Festival {
  _id: string;
  /** Derived from _id in the normalize function. */
  id: string;
  name: string;
  tuna: TunaRef & { _id: string };
  location: string;
  date: string; // ISO date string, e.g. "2026-04-18"
  premios: (Premio & { _id: string })[];
  tunasConcurso: (TunaRef & { _id: string })[];
  tunasExtra: (TunaRef & { _id: string })[];
  /** Optional metadata from the API. */
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  /** Optional — not part of the base contract, rendered if the API provides it. */
  posterUrl?: string;
}

/** Payload for creating a new festival. Matches the API's POST body. */
export interface CreateFestivalInput {
  name: string;
  tuna: TunaRef;
  location: string;
  date: string;
  premios: Premio[];
  tunasConcurso: TunaRef[];
  tunasExtra: TunaRef[];
}