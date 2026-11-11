import { useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../api/client';
import { ArchFrame } from './ui/ArchFrame';
import { Brand } from './ui/Brand';
import { BrushStripes } from './ui/BrushStripes';
import { Button } from './ui/Button';
import { Field } from './ui/Field';
import { PolaroidCard } from './ui/PolaroidCard';
import { Watercolor } from './ui/Watercolor';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onSuccess: () => void;
  onBack: () => void;
}

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
    <div className="login-page">
      <header className="site-header">
        <div className="page-shell">
          <div className="header-topline label">
            <span>Arquivo de festivais de tunas</span>
            <span className="hidden sm:inline">Portugal</span>
          </div>
          <div className="header-main">
            <Brand />
            <Button type="button" variant="text" onClick={onBack}>
              Voltar ao site
            </Button>
          </div>
        </div>
      </header>

      <main className="login-main relative overflow-x-clip">
        <Watercolor tone="green" className="-left-28 top-8" />
        <Watercolor tone="ochre" className="right-[-7rem] bottom-[-2rem]" />
        <Watercolor tone="blue" className="left-1/3 top-[-7rem]" />

        <div className="page-shell relative">
          <div className="login-grid">
            <aside className="login-poster">
              <div>
                <p className="label label--light">Área reservada</p>
                <h1 className="display-ink">Acesso ao arquivo</h1>
                <p className="login-poster__copy">
                  A consulta é pública. Apenas utilizadores autenticados podem registar,
                  editar ou eliminar festivais.
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <ArchFrame className="h-40 w-28 shrink-0">
                  <img
                    src="/logo-instituna.png"
                    alt=""
                    aria-hidden="true"
                    className="arch-crest"
                    width={512}
                    height={422}
                  />
                </ArchFrame>
                <p className="label label--light">Cartaz &amp; Palmarés</p>
              </div>
            </aside>

            <PolaroidCard className="login-card" seed="instituna-login" rotation={-1.1}>
              <div className="p-5 sm:p-8">
                <p className="label">Iniciar sessão</p>

                <form onSubmit={handleSubmit} className="login-form">
                  <Field label="Utilizador" htmlFor="login-username">
                    <input
                      id="login-username"
                      className="field-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      autoFocus
                      placeholder="admin"
                    />
                  </Field>

                  <Field label="Palavra-passe" htmlFor="login-password">
                    <input
                      id="login-password"
                      type="password"
                      className="field-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="••••••••"
                    />
                  </Field>

                  {error && (
                    <p
                      id="login-error"
                      className="form-error"
                      role="alert"
                      aria-live="assertive"
                    >
                      {error}
                    </p>
                  )}

                  {isSubmitting && (
                    <BrushStripes loading className="h-5 w-28 self-center" />
                  )}

                  <Button type="submit" disabled={isSubmitting} block className="mt-1">
                    {isSubmitting ? 'A entrar…' : 'Entrar'}
                  </Button>
                </form>
              </div>
            </PolaroidCard>
          </div>
        </div>
      </main>
    </div>
  );
}
