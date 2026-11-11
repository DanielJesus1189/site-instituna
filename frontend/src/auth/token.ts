const TOKEN_STORAGE_KEY = 'instituna.auth.token';

/** Fired when the API rejects a stored token (e.g. it expired or was revoked). */
export const AUTH_UNAUTHORIZED_EVENT = 'instituna:auth-unauthorized';

export function getAuthToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    /* ignore storage errors (private mode, etc.) */
  }
}

export function clearAuthToken(): void {
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    /* ignore storage errors */
  }
}

export function notifyUnauthorized(): void {
  window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
}
