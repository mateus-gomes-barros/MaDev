# MaDev

Aplicativo mobile e web para orientar a evolução profissional de desenvolvedores.

> Saiba o que aprender, o que praticar, como comprovar e quando você está pronto para o próximo passo.

## Estrutura

```text
apps/
  mobile/       Expo + React Native + Expo Router
  web/          Next.js + TypeScript
packages/
  config/       Identidade e configurações compartilhadas
  types/        Tipos de domínio
  ui-tokens/    Cores e tokens visuais
  validation/   Schemas Zod
```

## Requisitos

- Node.js 22 ou superior
- npm
- Xcode, para executar no iPhone ou iPad

## Primeiros comandos

```bash
npm install
npm run dev:web
```

Em outro terminal, para o aplicativo mobile:

```bash
npm run dev:mobile
```

Para conferir todo o projeto:

```bash
npm run typecheck
npm run lint
npm run build
```

## Estado atual

Esta primeira etapa contém a fundação do monorepo e telas iniciais estáticas. Supabase, autenticação, roadmap, persistência offline e IA serão adicionados em etapas separadas.
