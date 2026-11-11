import { useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../api/client';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSuccess: () => void;
  onBack: () => void;
}

const inputClass =
  'w-full border-x-0 border-t-0 border-b border-ink/25 bg-transparent px-0 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-wine focus:ring-0';
const labelClass = 'mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft';

export function LoginPage({ onLogin, onSuccess, onBack }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Preenche o utilizador e a palavra-passe.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(username.trim(), password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Não foi possível iniciar sessão. Tenta novamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="border-b border-ink/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-wine">
              Instituna
            </p>
            <p className="mt-1 font-serif text-xl font-semibold">Cartaz &amp; Palmarés</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-soft underline decoration-rule underline-offset-4 transition-colors hover:text-wine"
          >
            Voltar ao site
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="grid w-full max-w-3xl border border-ink/20 md:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between bg-ink p-8 text-paper sm:p-10">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold">
                Área reservada
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight">
                Acesso ao arquivo
              </h1>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/65">
                A consulta é pública. Apenas utilizadores autenticados podem registar,
                editar ou eliminar festivais.
              </p>
            </div>
            <p className="mt-12 font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">
              Cartaz &amp; Palmarés
            </p>
          </div>

          <div className="bg-paper p-8 sm:p-10">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-soft">
              Iniciar sessão
            </p>

            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
              <div>
                <label htmlFor="login-username" className={labelClass}>
                  Utilizador
                </label>
                <input
                  id="login-username"
                  className={inputClass}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  placeholder="admin"
                />
              </div>

              <div>
                <label htmlFor="login-password" className={labelClass}>
                  Palavra-passe
                </label>
                <input
                  id="login-password"
                  type="password"
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-sm font-medium text-wine">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 border border-ink bg-ink px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:border-wine hover:bg-wine disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'A entrar…' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
