import { appConfig } from "@madev/config";

const metrics = [
  { label: "Conhecimento", value: "0%" },
  { label: "Prática", value: "0%" },
  { label: "Evidências", value: "0%" },
];

export default function Home() {
  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand-lockup">
          <span className="logo">M</span>
          <span className="brand">{appConfig.name}</span>
        </div>
        <div className="nav-links" aria-label="Navegação principal">
          <a className="active" href="#jornada">
            Jornada
          </a>
          <a href="#progresso">Progresso</a>
          <a href="#projetos">Projetos</a>
        </div>
        <div className="avatar">MG</div>
      </nav>

      <section className="content">
        <header className="hero">
          <p className="eyebrow">SUA JORNADA DEV</p>
          <h1>
            Evolua com <span>direção.</span>
          </h1>
          <p>{appConfig.valueProposition}</p>
        </header>

        <div className="dashboard" id="jornada">
          <article className="journey-card">
            <div className="card-heading">
              <div>
                <p className="caption">JORNADA ATUAL</p>
                <h2>Full Stack Developer</h2>
              </div>
              <span className="badge">INÍCIO</span>
            </div>

            <div className="progress-track" aria-label="0% concluído">
              <span />
            </div>
            <p className="progress-copy">0% da jornada concluída</p>

            <div className="metrics" id="progresso">
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
                <p className="caption">RECOMENDAÇÃO</p>
                <h2>Próximo passo</h2>
              </div>
              <span className="spark">✦</span>
            </div>

            <button className="next-step" type="button">
              <span className="step-number">01</span>
              <span className="step-content">
                <small>FUNDAMENTOS DA WEB</small>
                <strong>Como a internet funciona</strong>
                <span>
                  Entenda navegador, servidor, DNS e o caminho de uma requisição.
                </span>
              </span>
              <span className="arrow">›</span>
            </button>
          </aside>
        </div>
      </section>
    </main>
  );
}
