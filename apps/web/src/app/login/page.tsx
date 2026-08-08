import { appConfig } from '@madev/config'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { login, signUp } from './actions'

type LoginPageProps = {
  searchParams: Promise<{
    error?: string
    message?: string
  }>
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (data?.claims) {
    redirect('/')
  }

  const { error, message } = await searchParams

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <div className="brand-lockup">
          <span className="logo">M</span>
          <span className="brand">
            {appConfig.name}
          </span>
        </div>

        <div className="auth-intro-content">
          <p className="eyebrow">
            SUA EVOLUÇÃO COMEÇA AQUI
          </p>
          <h1>
            Construa sua carreira com{' '}
            <span>direção.</span>
          </h1>
          <p>
            Organize o que aprender, pratique com
            propósito e comprove sua evolução como
            desenvolvedor.
          </p>
        </div>

        <p className="auth-footnote">
          Conhecimento. Prática. Evidências.
        </p>
      </section>

      <section className="auth-panel">
        <div className="auth-panel-content">
          <header className="auth-heading">
            <p className="caption">
              BEM-VINDO AO MADEV
            </p>
            <h2>Acesse sua jornada</h2>
            <p>
              Entre na sua conta ou crie uma nova
              para começar.
            </p>
          </header>

          {error ? (
            <p
              className="auth-feedback auth-error"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {message ? (
            <p
              className="auth-feedback auth-success"
              role="status"
            >
              {message}
            </p>
          ) : null}

          <div className="auth-forms">
            <form
              action={login}
              className="auth-form"
            >
              <div className="auth-form-heading">
                <h3>Entrar</h3>
                <p>Continue de onde você parou.</p>
              </div>

              <label htmlFor="login-email">
                E-mail
              </label>
              <input
                autoComplete="email"
                id="login-email"
                name="email"
                placeholder="voce@exemplo.com"
                required
                type="email"
              />

              <label htmlFor="login-password">
                Senha
              </label>
              <input
                autoComplete="current-password"
                id="login-password"
                name="password"
                placeholder="Digite sua senha"
                required
                type="password"
              />

              <button type="submit">
                Entrar na minha conta
              </button>
            </form>

            <div
              aria-hidden="true"
              className="auth-divider"
            >
              <span>OU</span>
            </div>

            <form
              action={signUp}
              className="auth-form"
            >
              <div className="auth-form-heading">
                <h3>Criar conta</h3>
                <p>Comece gratuitamente.</p>
              </div>

              <label htmlFor="signup-email">
                E-mail
              </label>
              <input
                autoComplete="email"
                id="signup-email"
                name="email"
                placeholder="voce@exemplo.com"
                required
                type="email"
              />

              <label htmlFor="signup-password">
                Senha
              </label>
              <input
                autoComplete="new-password"
                id="signup-password"
                minLength={8}
                name="password"
                placeholder="Mínimo de 8 caracteres"
                required
                type="password"
              />

              <label htmlFor="password-confirmation">
                Confirmar senha
              </label>
              <input
                autoComplete="new-password"
                id="password-confirmation"
                minLength={8}
                name="passwordConfirmation"
                placeholder="Digite a senha novamente"
                required
                type="password"
              />

              <button
                className="secondary-button"
                type="submit"
              >
                Criar minha conta
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
