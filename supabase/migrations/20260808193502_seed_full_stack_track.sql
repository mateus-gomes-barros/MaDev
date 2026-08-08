-- MaDev official Full Stack journey

-- =========================================================
-- TEMPORARY SEED DATA
-- =========================================================

create temporary table _madev_seed_phases (
  slug text primary key,
  name text not null,
  description text not null,
  position integer not null,
  estimated_hours integer not null
) on commit drop;

create temporary table _madev_seed_skills (
  phase_slug text not null,
  slug text not null,
  name text not null,
  description text not null,
  category text not null,
  position integer not null,
  estimated_hours integer not null,
  primary key (phase_slug, slug)
) on commit drop;

create temporary table _madev_seed_prerequisites (
  skill_phase_slug text not null,
  skill_slug text not null,
  prerequisite_phase_slug text not null,
  prerequisite_skill_slug text not null,
  primary key (
    skill_phase_slug,
    skill_slug,
    prerequisite_phase_slug,
    prerequisite_skill_slug
  )
) on commit drop;

create temporary table _madev_seed_checklist_items (
  phase_slug text not null,
  skill_slug text not null,
  item_slug text not null,
  title text not null,
  description text not null,
  position integer not null,
  estimated_minutes integer not null,
  primary key (
    phase_slug,
    skill_slug,
    item_slug
  )
) on commit drop;

-- =========================================================
-- TRACK
-- =========================================================

insert into public.tracks (
  slug,
  name,
  description,
  icon,
  position,
  is_published
)
values (
  'full-stack',
  'Desenvolvedor Full Stack',
  'Jornada completa para desenvolver aplicações web modernas, do navegador ao banco de dados, deploy e preparação profissional.',
  'layers-3',
  1,
  true
)
on conflict (slug)
do update set
  name = excluded.name,
  description = excluded.description,
  icon = excluded.icon,
  position = excluded.position,
  is_published = excluded.is_published;

-- =========================================================
-- PHASES
-- =========================================================

insert into _madev_seed_phases (
  slug,
  name,
  description,
  position,
  estimated_hours
)
values
  (
    'web-foundations',
    'Fundamentos da Web',
    'Base necessária para compreender e construir interfaces web acessíveis, responsivas e interativas.',
    1,
    166
  ),
  (
    'modern-frontend',
    'Front-End Moderno',
    'Desenvolvimento de interfaces escaláveis com TypeScript, React, testes e renderização moderna.',
    2,
    207
  ),
  (
    'backend',
    'Back-End',
    'Criação de serviços, APIs, bancos de dados e sistemas seguros no servidor.',
    3,
    185
  ),
  (
    'fullstack-applications',
    'Aplicações Completas',
    'Integração das camadas da aplicação, sincronização, deploy e construção de um projeto completo.',
    4,
    215
  ),
  (
    'professional-market',
    'Mercado Profissional',
    'Qualidade de código, colaboração, portfólio, entrevistas e evolução de carreira.',
    5,
    150
  );

insert into public.phases (
  track_id,
  slug,
  name,
  description,
  position,
  estimated_hours,
  is_published
)
select
  tracks.id,
  seed.slug,
  seed.name,
  seed.description,
  seed.position,
  seed.estimated_hours,
  true
from _madev_seed_phases as seed
join public.tracks
  on tracks.slug = 'full-stack'
on conflict (track_id, slug)
do update set
  name = excluded.name,
  description = excluded.description,
  position = excluded.position,
  estimated_hours = excluded.estimated_hours,
  is_published = excluded.is_published;

-- =========================================================
-- SKILLS
-- =========================================================

insert into _madev_seed_skills (
  phase_slug,
  slug,
  name,
  description,
  category,
  position,
  estimated_hours
)
values
  (
    'web-foundations',
    'web-fundamentals',
    'Como a Web Funciona',
    'Internet, HTTP, navegadores, servidores, URLs, DNS e ferramentas de desenvolvimento.',
    'Fundamentos',
    1,
    10
  ),
  (
    'web-foundations',
    'html',
    'HTML Semântico',
    'Estruturação de páginas, formulários, metadados e semântica.',
    'Front-End',
    2,
    20
  ),
  (
    'web-foundations',
    'css',
    'CSS',
    'Estilização, cascata, box model, layouts e criação de interfaces.',
    'Front-End',
    3,
    35
  ),
  (
    'web-foundations',
    'javascript',
    'JavaScript',
    'Fundamentos da linguagem, DOM, eventos, módulos e programação assíncrona.',
    'Programação',
    4,
    55
  ),
  (
    'web-foundations',
    'git-github',
    'Git e GitHub',
    'Versionamento, branches, commits, pull requests e colaboração.',
    'Ferramentas',
    5,
    16
  ),
  (
    'web-foundations',
    'responsive-accessibility',
    'Responsividade e Acessibilidade',
    'Interfaces adaptáveis, navegação por teclado, semântica e fundamentos de WCAG.',
    'Front-End',
    6,
    30
  ),
  (
    'modern-frontend',
    'typescript',
    'TypeScript',
    'Tipagem estática, modelagem de domínio, narrowing, generics e configuração strict.',
    'Programação',
    1,
    35
  ),
  (
    'modern-frontend',
    'react',
    'React',
    'Componentes, propriedades, estado, hooks, composição e organização de interfaces.',
    'Front-End',
    2,
    60
  ),
  (
    'modern-frontend',
    'state-and-server-data',
    'Estado e Dados do Servidor',
    'Estado local e global, cache, mutations, invalidação e tratamento de estados assíncronos.',
    'Front-End',
    3,
    35
  ),
  (
    'modern-frontend',
    'frontend-testing',
    'Testes de Front-End',
    'Testes unitários, de componentes, integração e fluxos críticos.',
    'Qualidade',
    4,
    32
  ),
  (
    'modern-frontend',
    'nextjs',
    'Next.js',
    'Roteamento, renderização no servidor, geração estática, Server Components e rotas.',
    'Front-End',
    5,
    45
  ),
  (
    'backend',
    'nodejs',
    'Node.js',
    'Runtime, módulos, serviços, configuração, erros e organização do back-end.',
    'Back-End',
    1,
    35
  ),
  (
    'backend',
    'rest-apis',
    'APIs REST',
    'Recursos, métodos HTTP, validação, contratos, erros, paginação e webhooks.',
    'Back-End',
    2,
    35
  ),
  (
    'backend',
    'postgresql',
    'SQL e PostgreSQL',
    'Modelagem relacional, consultas, constraints, transações, índices e migrações.',
    'Banco de Dados',
    3,
    45
  ),
  (
    'backend',
    'authentication-security',
    'Autenticação e Segurança',
    'Sessões, tokens, OAuth, autorização, RLS e proteção contra vulnerabilidades.',
    'Segurança',
    4,
    40
  ),
  (
    'backend',
    'backend-testing',
    'Testes de Back-End',
    'Testes unitários, integração, contratos de API e bancos de teste.',
    'Qualidade',
    5,
    30
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'Arquitetura Full Stack',
    'Separação de responsabilidades, contratos, validação e integração entre as camadas.',
    'Arquitetura',
    1,
    40
  ),
  (
    'fullstack-applications',
    'storage-and-realtime',
    'Arquivos e Tempo Real',
    'Uploads, armazenamento, permissões, eventos e atualizações em tempo real.',
    'Integração',
    2,
    30
  ),
  (
    'fullstack-applications',
    'offline-first-sync',
    'Offline-first e Sincronização',
    'Persistência local, filas, reconexão, sincronização e resolução de conflitos.',
    'Arquitetura',
    3,
    35
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'Deploy e CI/CD',
    'Ambientes, containers, pipelines, hospedagem, monitoramento e rollback.',
    'DevOps',
    4,
    30
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'Projeto Full Stack Completo',
    'Planejamento, construção, publicação e documentação de uma aplicação pronta para usuários.',
    'Projeto',
    5,
    80
  ),
  (
    'professional-market',
    'code-quality-collaboration',
    'Qualidade e Colaboração',
    'Código limpo, revisões, documentação, padrões de equipe e comunicação técnica.',
    'Profissional',
    1,
    30
  ),
  (
    'professional-market',
    'product-delivery',
    'Produto e Entrega',
    'Requisitos, priorização, métricas, estimativas e ciclos de entrega.',
    'Produto',
    2,
    25
  ),
  (
    'professional-market',
    'performance-observability',
    'Performance e Observabilidade',
    'Medição, profiling, logs, erros, métricas e diagnóstico de produção.',
    'Qualidade',
    3,
    30
  ),
  (
    'professional-market',
    'portfolio-personal-brand',
    'Portfólio e Presença Profissional',
    'Cases, GitHub, currículo, LinkedIn e apresentação de resultados.',
    'Carreira',
    4,
    30
  ),
  (
    'professional-market',
    'interviews-career',
    'Entrevistas e Carreira',
    'Entrevistas técnicas e comportamentais, busca de vagas e plano de evolução.',
    'Carreira',
    5,
    35
  );

insert into public.skills (
  phase_id,
  slug,
  name,
  description,
  category,
  source,
  position,
  estimated_hours,
  is_required,
  is_published
)
select
  phases.id,
  seed.slug,
  seed.name,
  seed.description,
  seed.category,
  'official'::public.content_source,
  seed.position,
  seed.estimated_hours,
  true,
  true
from _madev_seed_skills as seed
join _madev_seed_phases
  on _madev_seed_phases.slug = seed.phase_slug
join public.tracks
  on tracks.slug = 'full-stack'
join public.phases
  on phases.track_id = tracks.id
  and phases.slug = seed.phase_slug
on conflict (phase_id, slug)
do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  source = excluded.source,
  position = excluded.position,
  estimated_hours = excluded.estimated_hours,
  is_required = excluded.is_required,
  is_published = excluded.is_published;

-- =========================================================
-- PREREQUISITES
-- =========================================================

insert into _madev_seed_prerequisites
values
  (
    'web-foundations',
    'html',
    'web-foundations',
    'web-fundamentals'
  ),
  (
    'web-foundations',
    'css',
    'web-foundations',
    'html'
  ),
  (
    'web-foundations',
    'javascript',
    'web-foundations',
    'html'
  ),
  (
    'web-foundations',
    'responsive-accessibility',
    'web-foundations',
    'html'
  ),
  (
    'web-foundations',
    'responsive-accessibility',
    'web-foundations',
    'css'
  ),
  (
    'modern-frontend',
    'typescript',
    'web-foundations',
    'javascript'
  ),
  (
    'modern-frontend',
    'react',
    'web-foundations',
    'javascript'
  ),
  (
    'modern-frontend',
    'react',
    'modern-frontend',
    'typescript'
  ),
  (
    'modern-frontend',
    'state-and-server-data',
    'modern-frontend',
    'react'
  ),
  (
    'modern-frontend',
    'frontend-testing',
    'modern-frontend',
    'react'
  ),
  (
    'modern-frontend',
    'nextjs',
    'modern-frontend',
    'react'
  ),
  (
    'modern-frontend',
    'nextjs',
    'modern-frontend',
    'state-and-server-data'
  ),
  (
    'backend',
    'nodejs',
    'modern-frontend',
    'typescript'
  ),
  (
    'backend',
    'rest-apis',
    'backend',
    'nodejs'
  ),
  (
    'backend',
    'postgresql',
    'backend',
    'nodejs'
  ),
  (
    'backend',
    'authentication-security',
    'backend',
    'rest-apis'
  ),
  (
    'backend',
    'authentication-security',
    'backend',
    'postgresql'
  ),
  (
    'backend',
    'backend-testing',
    'backend',
    'rest-apis'
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'modern-frontend',
    'nextjs'
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'backend',
    'rest-apis'
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'backend',
    'postgresql'
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'backend',
    'authentication-security'
  ),
  (
    'fullstack-applications',
    'storage-and-realtime',
    'fullstack-applications',
    'fullstack-architecture'
  ),
  (
    'fullstack-applications',
    'offline-first-sync',
    'fullstack-applications',
    'fullstack-architecture'
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'modern-frontend',
    'frontend-testing'
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'backend',
    'backend-testing'
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'fullstack-applications',
    'fullstack-architecture'
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'fullstack-applications',
    'storage-and-realtime'
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'fullstack-applications',
    'offline-first-sync'
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'fullstack-applications',
    'deployment-cicd'
  ),
  (
    'professional-market',
    'code-quality-collaboration',
    'web-foundations',
    'git-github'
  ),
  (
    'professional-market',
    'code-quality-collaboration',
    'backend',
    'backend-testing'
  ),
  (
    'professional-market',
    'product-delivery',
    'fullstack-applications',
    'fullstack-capstone'
  ),
  (
    'professional-market',
    'performance-observability',
    'fullstack-applications',
    'deployment-cicd'
  ),
  (
    'professional-market',
    'portfolio-personal-brand',
    'fullstack-applications',
    'fullstack-capstone'
  ),
  (
    'professional-market',
    'interviews-career',
    'professional-market',
    'code-quality-collaboration'
  ),
  (
    'professional-market',
    'interviews-career',
    'professional-market',
    'portfolio-personal-brand'
  );

insert into public.skill_prerequisites (
  skill_id,
  prerequisite_skill_id
)
select
  skill.id,
  prerequisite.id
from _madev_seed_prerequisites as seed
join public.tracks
  on tracks.slug = 'full-stack'
join public.phases as skill_phase
  on skill_phase.track_id = tracks.id
  and skill_phase.slug = seed.skill_phase_slug
join public.skills as skill
  on skill.phase_id = skill_phase.id
  and skill.slug = seed.skill_slug
join public.phases as prerequisite_phase
  on prerequisite_phase.track_id = tracks.id
  and prerequisite_phase.slug =
    seed.prerequisite_phase_slug
join public.skills as prerequisite
  on prerequisite.phase_id = prerequisite_phase.id
  and prerequisite.slug =
    seed.prerequisite_skill_slug
on conflict (
  skill_id,
  prerequisite_skill_id
)
do nothing;

-- =========================================================
-- OFFICIAL CHECKLISTS
-- =========================================================

insert into public.official_checklists (
  skill_id,
  slug,
  title,
  description,
  position,
  is_published
)
select
  skills.id,
  'core',
  'Checklist oficial: ' || skills.name,
  'Atividades fundamentais para demonstrar domínio desta habilidade.',
  1,
  true
from _madev_seed_skills as seed
join public.tracks
  on tracks.slug = 'full-stack'
join public.phases
  on phases.track_id = tracks.id
  and phases.slug = seed.phase_slug
join public.skills
  on skills.phase_id = phases.id
  and skills.slug = seed.slug
on conflict (skill_id, slug)
do update set
  title = excluded.title,
  description = excluded.description,
  position = excluded.position,
  is_published = excluded.is_published;

-- =========================================================
-- OFFICIAL CHECKLIST ITEMS
-- =========================================================

insert into _madev_seed_checklist_items
values
  (
    'web-foundations',
    'web-fundamentals',
    'request-cycle',
    'Explicar o ciclo de uma requisição web',
    'Descrever o caminho entre URL, DNS, servidor, resposta HTTP e renderização.',
    1,
    45
  ),
  (
    'web-foundations',
    'web-fundamentals',
    'browser-devtools',
    'Investigar uma página com DevTools',
    'Usar Elements, Network, Console e Application para analisar uma aplicação.',
    2,
    60
  ),
  (
    'web-foundations',
    'web-fundamentals',
    'client-server',
    'Diferenciar cliente, servidor e banco',
    'Identificar as responsabilidades das principais camadas de uma aplicação web.',
    3,
    45
  ),
  (
    'web-foundations',
    'html',
    'semantic-page',
    'Criar uma página semântica',
    'Utilizar landmarks, títulos, listas, links e elementos apropriados.',
    1,
    90
  ),
  (
    'web-foundations',
    'html',
    'forms',
    'Construir um formulário completo',
    'Adicionar labels, tipos de campo, validação nativa e mensagens compreensíveis.',
    2,
    120
  ),
  (
    'web-foundations',
    'html',
    'metadata',
    'Configurar metadados essenciais',
    'Adicionar title, description, viewport e informações sociais básicas.',
    3,
    60
  ),
  (
    'web-foundations',
    'css',
    'cascade-box-model',
    'Dominar cascata e box model',
    'Aplicar especificidade, herança, dimensões, espaçamento e posicionamento.',
    1,
    120
  ),
  (
    'web-foundations',
    'css',
    'flex-grid',
    'Criar layouts com Flexbox e Grid',
    'Reproduzir estruturas comuns sem depender de posicionamento absoluto.',
    2,
    180
  ),
  (
    'web-foundations',
    'css',
    'design-implementation',
    'Reproduzir uma interface visual',
    'Transformar uma referência em componentes com tipografia, cores e espaçamento consistentes.',
    3,
    180
  ),
  (
    'web-foundations',
    'javascript',
    'language-fundamentals',
    'Resolver problemas com JavaScript',
    'Usar variáveis, funções, objetos, arrays, condições e repetição.',
    1,
    180
  ),
  (
    'web-foundations',
    'javascript',
    'dom-events',
    'Criar uma interface interativa',
    'Manipular o DOM e responder a formulários, cliques e eventos do navegador.',
    2,
    180
  ),
  (
    'web-foundations',
    'javascript',
    'async-modules',
    'Consumir dados de forma assíncrona',
    'Usar módulos, promises, async e await com tratamento de erros.',
    3,
    180
  ),
  (
    'web-foundations',
    'git-github',
    'repository-workflow',
    'Versionar um projeto',
    'Criar repositório, commits pequenos e um histórico compreensível.',
    1,
    90
  ),
  (
    'web-foundations',
    'git-github',
    'branches-conflicts',
    'Trabalhar com branches',
    'Criar branches, realizar merge e resolver um conflito com segurança.',
    2,
    120
  ),
  (
    'web-foundations',
    'git-github',
    'pull-request',
    'Concluir um fluxo de pull request',
    'Publicar uma branch, abrir PR, revisar alterações e integrar o trabalho.',
    3,
    90
  ),
  (
    'web-foundations',
    'responsive-accessibility',
    'responsive-layout',
    'Adaptar uma interface para diferentes telas',
    'Validar o layout em celular, tablet e desktop sem perda de conteúdo.',
    1,
    180
  ),
  (
    'web-foundations',
    'responsive-accessibility',
    'keyboard-navigation',
    'Garantir navegação por teclado',
    'Verificar foco visível, ordem lógica e acesso a todos os controles.',
    2,
    120
  ),
  (
    'web-foundations',
    'responsive-accessibility',
    'accessibility-audit',
    'Realizar uma auditoria de acessibilidade',
    'Corrigir semântica, contraste, nomes acessíveis e problemas básicos de WCAG.',
    3,
    150
  ),
  (
    'modern-frontend',
    'typescript',
    'strict-types',
    'Configurar TypeScript strict',
    'Eliminar tipos inseguros e compreender os erros apontados pelo compilador.',
    1,
    120
  ),
  (
    'modern-frontend',
    'typescript',
    'domain-modeling',
    'Modelar dados da aplicação',
    'Criar tipos, interfaces e unions que representem estados válidos.',
    2,
    150
  ),
  (
    'modern-frontend',
    'typescript',
    'narrowing-generics',
    'Aplicar narrowing e generics',
    'Criar funções reutilizáveis mantendo inferência e segurança de tipos.',
    3,
    150
  ),
  (
    'modern-frontend',
    'react',
    'component-composition',
    'Construir componentes reutilizáveis',
    'Separar responsabilidades e compor interfaces por propriedades e children.',
    1,
    180
  ),
  (
    'modern-frontend',
    'react',
    'hooks-state',
    'Gerenciar estado e efeitos',
    'Usar hooks respeitando fluxo de dados, dependências e ciclo de vida.',
    2,
    180
  ),
  (
    'modern-frontend',
    'react',
    'feature-architecture',
    'Organizar uma feature React',
    'Separar UI, lógica, tipos e acesso a dados de forma sustentável.',
    3,
    180
  ),
  (
    'modern-frontend',
    'state-and-server-data',
    'state-boundaries',
    'Definir onde cada estado deve viver',
    'Distinguir estado local, global, de URL e proveniente do servidor.',
    1,
    120
  ),
  (
    'modern-frontend',
    'state-and-server-data',
    'query-cache',
    'Implementar cache de dados remotos',
    'Configurar queries, estados de carregamento, erro e atualização.',
    2,
    180
  ),
  (
    'modern-frontend',
    'state-and-server-data',
    'mutations-invalidation',
    'Criar mutations consistentes',
    'Atualizar dados e invalidar ou sincronizar o cache após alterações.',
    3,
    180
  ),
  (
    'modern-frontend',
    'frontend-testing',
    'unit-component-tests',
    'Testar funções e componentes',
    'Validar comportamentos observáveis sem testar detalhes internos.',
    1,
    180
  ),
  (
    'modern-frontend',
    'frontend-testing',
    'integration-flow',
    'Testar um fluxo de usuário',
    'Cobrir interação, validação, requisição e retorno visual.',
    2,
    180
  ),
  (
    'modern-frontend',
    'frontend-testing',
    'critical-e2e',
    'Automatizar um caminho crítico',
    'Criar um teste ponta a ponta para uma jornada essencial.',
    3,
    180
  ),
  (
    'modern-frontend',
    'nextjs',
    'app-router',
    'Construir rotas com App Router',
    'Criar layouts, páginas, estados de loading e tratamento de erro.',
    1,
    180
  ),
  (
    'modern-frontend',
    'nextjs',
    'rendering-strategies',
    'Escolher a estratégia de renderização',
    'Aplicar renderização estática, dinâmica ou no cliente conforme o caso.',
    2,
    150
  ),
  (
    'modern-frontend',
    'nextjs',
    'server-client-boundaries',
    'Definir fronteiras entre servidor e cliente',
    'Usar Server e Client Components mantendo dados e bundle sob controle.',
    3,
    180
  ),
  (
    'backend',
    'nodejs',
    'runtime-modules',
    'Compreender runtime e módulos',
    'Executar código no Node.js e organizar dependências e scripts.',
    1,
    120
  ),
  (
    'backend',
    'nodejs',
    'service-structure',
    'Estruturar um serviço',
    'Separar rotas, regras de negócio e acesso a dados.',
    2,
    180
  ),
  (
    'backend',
    'nodejs',
    'configuration-errors',
    'Tratar configuração e erros',
    'Validar variáveis de ambiente e centralizar falhas operacionais.',
    3,
    150
  ),
  (
    'backend',
    'rest-apis',
    'resource-contract',
    'Projetar recursos e endpoints',
    'Escolher métodos, URLs, códigos de status e formatos consistentes.',
    1,
    150
  ),
  (
    'backend',
    'rest-apis',
    'validation-errors',
    'Validar entradas da API',
    'Rejeitar dados inválidos e retornar erros estruturados.',
    2,
    150
  ),
  (
    'backend',
    'rest-apis',
    'pagination-webhooks',
    'Implementar paginação e webhooks',
    'Criar listagens escaláveis e eventos externos verificáveis.',
    3,
    180
  ),
  (
    'backend',
    'postgresql',
    'relational-model',
    'Modelar um banco relacional',
    'Definir tabelas, chaves, relações, constraints e regras de exclusão.',
    1,
    180
  ),
  (
    'backend',
    'postgresql',
    'queries-transactions',
    'Criar consultas e transações',
    'Usar joins, agregações e transações para manter consistência.',
    2,
    180
  ),
  (
    'backend',
    'postgresql',
    'indexes-migrations',
    'Aplicar índices e migrações',
    'Analisar consultas, criar índices úteis e evoluir o schema.',
    3,
    180
  ),
  (
    'backend',
    'authentication-security',
    'authentication-flow',
    'Implementar autenticação',
    'Criar login, sessão, logout e recuperação de acesso.',
    1,
    180
  ),
  (
    'backend',
    'authentication-security',
    'authorization',
    'Proteger dados por usuário e função',
    'Validar propriedade, permissões e políticas de acesso.',
    2,
    180
  ),
  (
    'backend',
    'authentication-security',
    'security-review',
    'Revisar segurança da aplicação',
    'Verificar segredos, validação, CORS, injeção e exposição de dados.',
    3,
    180
  ),
  (
    'backend',
    'backend-testing',
    'service-tests',
    'Testar regras de negócio',
    'Cobrir cenários de sucesso, falha e casos extremos.',
    1,
    150
  ),
  (
    'backend',
    'backend-testing',
    'api-integration-tests',
    'Testar a API integrada',
    'Executar requisições reais contra uma instância de teste.',
    2,
    180
  ),
  (
    'backend',
    'backend-testing',
    'test-database',
    'Isolar dados de teste',
    'Criar fixtures, reset previsível e independência entre testes.',
    3,
    150
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'layer-contracts',
    'Definir contratos entre camadas',
    'Compartilhar modelos e validar dados em todas as fronteiras.',
    1,
    180
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'end-to-end-feature',
    'Construir uma feature ponta a ponta',
    'Integrar interface, API, regra de negócio e persistência.',
    2,
    240
  ),
  (
    'fullstack-applications',
    'fullstack-architecture',
    'architecture-decisions',
    'Documentar decisões arquiteturais',
    'Registrar contexto, escolha e consequências das principais decisões.',
    3,
    120
  ),
  (
    'fullstack-applications',
    'storage-and-realtime',
    'secure-upload',
    'Implementar upload seguro',
    'Validar tipo e tamanho, armazenar arquivo e controlar acesso.',
    1,
    180
  ),
  (
    'fullstack-applications',
    'storage-and-realtime',
    'realtime-updates',
    'Criar atualizações em tempo real',
    'Sincronizar uma mudança entre dois clientes conectados.',
    2,
    180
  ),
  (
    'fullstack-applications',
    'storage-and-realtime',
    'failure-states',
    'Tratar falhas de armazenamento e conexão',
    'Exibir progresso, repetição e mensagens úteis para o usuário.',
    3,
    150
  ),
  (
    'fullstack-applications',
    'offline-first-sync',
    'local-persistence',
    'Persistir dados localmente',
    'Manter informações essenciais disponíveis sem conexão.',
    1,
    180
  ),
  (
    'fullstack-applications',
    'offline-first-sync',
    'sync-queue',
    'Criar uma fila de sincronização',
    'Registrar operações pendentes e reenviá-las após a reconexão.',
    2,
    210
  ),
  (
    'fullstack-applications',
    'offline-first-sync',
    'conflict-resolution',
    'Definir resolução de conflitos',
    'Escolher e testar uma estratégia para alterações concorrentes.',
    3,
    180
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'environments',
    'Configurar ambientes',
    'Separar desenvolvimento, testes e produção com segredos seguros.',
    1,
    150
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'pipeline',
    'Criar pipeline de integração contínua',
    'Executar lint, testes e build automaticamente antes da publicação.',
    2,
    180
  ),
  (
    'fullstack-applications',
    'deployment-cicd',
    'production-release',
    'Publicar e validar uma versão',
    'Realizar deploy, smoke test, monitoramento inicial e rollback.',
    3,
    180
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'scope-plan',
    'Definir escopo e marcos',
    'Escolher problema, usuários, MVP e etapas mensuráveis.',
    1,
    180
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'production-app',
    'Entregar a aplicação em produção',
    'Concluir fluxo principal, autenticação, dados, testes e deploy.',
    2,
    600
  ),
  (
    'fullstack-applications',
    'fullstack-capstone',
    'documentation-evidence',
    'Documentar e apresentar o projeto',
    'Criar README, demonstração, decisões técnicas e evidências das habilidades.',
    3,
    240
  ),
  (
    'professional-market',
    'code-quality-collaboration',
    'refactoring',
    'Refatorar uma feature',
    'Melhorar clareza e manutenção preservando o comportamento.',
    1,
    180
  ),
  (
    'professional-market',
    'code-quality-collaboration',
    'code-review',
    'Realizar uma revisão de código',
    'Avaliar correção, legibilidade, testes, segurança e impacto.',
    2,
    120
  ),
  (
    'professional-market',
    'code-quality-collaboration',
    'technical-communication',
    'Comunicar uma decisão técnica',
    'Explicar contexto, alternativas, escolha e trade-offs com clareza.',
    3,
    90
  ),
  (
    'professional-market',
    'product-delivery',
    'requirements',
    'Transformar um problema em requisitos',
    'Definir resultado, critérios de aceite e limites do escopo.',
    1,
    120
  ),
  (
    'professional-market',
    'product-delivery',
    'planning',
    'Planejar uma entrega',
    'Dividir o trabalho, estimar riscos e priorizar dependências.',
    2,
    120
  ),
  (
    'professional-market',
    'product-delivery',
    'outcome-metrics',
    'Medir o resultado entregue',
    'Escolher indicadores e comparar o estado anterior e posterior.',
    3,
    120
  ),
  (
    'professional-market',
    'performance-observability',
    'profiling',
    'Encontrar um gargalo de performance',
    'Medir carregamento, renderização, rede ou consulta antes de otimizar.',
    1,
    180
  ),
  (
    'professional-market',
    'performance-observability',
    'monitoring',
    'Configurar monitoramento',
    'Registrar erros, logs e contexto suficiente para diagnóstico.',
    2,
    150
  ),
  (
    'professional-market',
    'performance-observability',
    'production-incident',
    'Investigar um problema de produção',
    'Reproduzir, identificar causa, corrigir e documentar prevenção.',
    3,
    180
  ),
  (
    'professional-market',
    'portfolio-personal-brand',
    'case-study',
    'Criar um estudo de caso',
    'Apresentar problema, responsabilidade, decisões e resultados mensuráveis.',
    1,
    180
  ),
  (
    'professional-market',
    'portfolio-personal-brand',
    'github-profile',
    'Organizar GitHub e projetos',
    'Destacar repositórios com README, instruções e demonstração.',
    2,
    150
  ),
  (
    'professional-market',
    'portfolio-personal-brand',
    'resume-linkedin',
    'Atualizar currículo e LinkedIn',
    'Alinhar título, competências, projetos e impacto às vagas desejadas.',
    3,
    180
  ),
  (
    'professional-market',
    'interviews-career',
    'behavioral-stories',
    'Preparar histórias profissionais',
    'Estruturar exemplos sobre desafios, decisões, conflitos e resultados.',
    1,
    150
  ),
  (
    'professional-market',
    'interviews-career',
    'technical-interview',
    'Simular uma entrevista técnica',
    'Praticar fundamentos, arquitetura e explicação do raciocínio.',
    2,
    180
  ),
  (
    'professional-market',
    'interviews-career',
    'career-plan',
    'Criar um plano de candidatura e evolução',
    'Definir vagas-alvo, lacunas, rotina de estudo e acompanhamento.',
    3,
    150
  );

insert into public.checklist_items (
  official_checklist_id,
  slug,
  title,
  description,
  position,
  is_required,
  estimated_minutes
)
select
  official_checklists.id,
  seed.item_slug,
  seed.title,
  seed.description,
  seed.position,
  true,
  seed.estimated_minutes
from _madev_seed_checklist_items as seed
join public.tracks
  on tracks.slug = 'full-stack'
join public.phases
  on phases.track_id = tracks.id
  and phases.slug = seed.phase_slug
join public.skills
  on skills.phase_id = phases.id
  and skills.slug = seed.skill_slug
join public.official_checklists
  on official_checklists.skill_id = skills.id
  and official_checklists.slug = 'core'
on conflict (
  official_checklist_id,
  slug
)
where
  official_checklist_id is not null
  and slug is not null
do update set
  title = excluded.title,
  description = excluded.description,
  position = excluded.position,
  is_required = excluded.is_required,
  estimated_minutes = excluded.estimated_minutes;
