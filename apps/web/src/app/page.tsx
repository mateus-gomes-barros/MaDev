import { appConfig } from '@madev/config'
import {
  getFullStackTrack,
  type TrackCatalog,
} from '@madev/data'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

const metrics = [
  { label: 'Conhecimento', value: '0%' },
  { label: 'Prática', value: '0%' },
  { label: 'Evidências', value: '0%' },
]

function formatStepNumber(position: number) {
  return String(position).padStart(2, '0')
}

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()

  if (!data?.claims) {
    redirect('/login')
  }

  let track: TrackCatalog | null = null
  let trackError = false

  try {
    track = await getFullStackTrack(supabase)
  } catch (error) {
    trackError = true
    console.error(
      'Não foi possível carregar a jornada Full Stack.',
      error,
    )
  }

  const currentPhase = track?.phases[0]
  const nextSkill = currentPhase?.skills[0]

  const journeyTitle =
    track?.name ?? 'Jornada Full Stack'

  const recommendationCaption =
    currentPhase?.name.toUpperCase() ??
    'JORNADA FULL STACK'

  const recommendationTitle =
    nextSkill?.name ??
    (trackError
      ? 'Não foi possível carregar'
      : 'Jornada em preparação')

  const recommendationDescription =
    nextSkill?.description ??
    (trackError
      ? 'Verifique a conexão com o Supabase e tente novamente.'
      : 'O próximo conteúdo será exibido assim que estiver publicado.')

  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand-lockup">
          <span className="logo">M</span>
          <span className="brand">
            {appConfig.name}
          </span>
        </div>

        <div
          aria-label="Navegação principal"
          className="nav-links"
        >
          <a className="active" href="#jornada">
            Jornada
          </a>
          <a href="#progresso">Progresso</a>
          <a href="#projetos">Projetos</a>
        </div>

        <form
          action="/auth/signout"
          className="signout-form"
          method="post"
        >
          <button
            aria-label="Sair da conta"
            className="avatar"
            title="Sair da conta"
            type="submit"
          >
            MG
          </button>
        </form>
      </nav>

      <section className="content">
        <header className="hero">
          <p className="eyebrow">
            SUA JORNADA DEV
          </p>
          <h1>
            Evolua com <span>direção.</span>
          </h1>
          <p>{appConfig.valueProposition}</p>
        </header>

        <div className="dashboard" id="jornada">
          <article className="journey-card">
            <div className="card-heading">
              <div>
                <p className="caption">
                  JORNADA ATUAL
                </p>
                <h2>{journeyTitle}</h2>
              </div>

              <span className="badge">
                {currentPhase
                  ? `FASE ${currentPhase.position}`
                  : 'INÍCIO'}
              </span>
            </div>

            <div
              aria-label="0% concluído"
              className="progress-track"
            >
              <span />
            </div>

            <p className="progress-copy">
              0% da jornada concluída
            </p>

            <div
              className="metrics"
              id="progresso"
            >
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </article>

          <aside className="next-panel">
            <div className="panel-title">
              <div>
                <p className="caption">
                  RECOMENDAÇÃO
                </p>
                <h2>Próximo passo</h2>
              </div>
              <span className="spark">✦</span>
            </div>

            <button
              className="next-step"
              type="button"
            >
              <span className="step-number">
                {nextSkill
                  ? formatStepNumber(
                      nextSkill.position,
                    )
                  : '01'}
              </span>

              <span className="step-content">
                <small>
                  {recommendationCaption}
                </small>
                <strong>
                  {recommendationTitle}
                </strong>
                <span>
                  {recommendationDescription}
                </span>
              </span>

              <span className="arrow">›</span>
            </button>
          </aside>
        </div>
      </section>
    </main>
  )
}
