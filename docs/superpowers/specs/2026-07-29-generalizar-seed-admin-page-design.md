# Generalizar SeedAdminPage (Fase 2 de pré-requisitos)

## Contexto

`agent-playwright/src/fixtures/seed-fixtures.ts` (fixtures Playwright de seed —
`cursoSeed`, `trilhaSeed`, `alunoMatriculadoSeed`, `alunoComSenhaSeed`, etc.)
importa `SeedAdminPage` de `agent-playwright/projects/recertificacao/pages/SeedAdminPage.ts`.
O arquivo nasceu dentro do projeto Recertificação, mas seu conteúdo (criar/deletar
Curso, Trilha, Pacote, Usuário aluno, Matrícula via UI admin) opera em entidades
Twygo core — não há lógica de negócio específica de Recertificação nele, exceto
um parâmetro `hasRecertification` já documentado como DEPRECATED/NO-OP.

Investigação confirmou que outros projetos (`modelos`) **não** precisam de
Curso/Aluno/Trilha hoje — o domínio deles é outro (Modelo de conteúdo/Design/Kit
de marca). Esta fase é infraestrutura preventiva: deixar o mecanismo de
Curso/Aluno utilizável por qualquer projeto que precisar no futuro, sem
consumidor concreto agora.

## O que muda

1. **Mover** `agent-playwright/projects/recertificacao/pages/SeedAdminPage.ts` →
   `agent-playwright/src/pages/SeedAdminPage.ts` (ao lado de `BasePage.ts` e
   `ProfileSwitcher.ts`, de onde já importa).
2. **Corrigir** o fallback de URL hardcoded em `completarCursoComoAluno`
   (`data.baseURL || process.env.API_BASE_URL || 'https://recertificacao-testeqa.stage.twygoead.com'`)
   para usar `getBaseUrl()` (`src/utils/environment.ts`) em vez do literal
   específico de Recertificação.
3. **Atualizar import** em `src/fixtures/seed-fixtures.ts` pro novo caminho, e
   ajustar o comentário de topo do arquivo (remover o enquadramento "para o
   projeto Recertificação" — o arquivo já é genérico por forma, só a doc estava
   desatualizada).
4. **Atualizar imports** nos specs de Recertificação que importam
   `SeedAdminPage` diretamente (hoje 6 arquivos, todos com
   `import { SeedAdminPage } from '../../../pages/SeedAdminPage.js'`):
   - `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc1-switch-aparece-com-flag-on.spec.ts`
   - `.../tc3-ativar-e-salvar-persiste.spec.ts`
   - `.../tc4-desativar-com-participants.spec.ts`
   - `.../tc5-paridade-haml-react.spec.ts`
   - `projects/recertificacao/tests/features/_smoke/matricular-aluno.spec.ts`

## Por que essa abordagem (e não outras)

- **Mover de verdade** (em vez de deixar o arquivo em `projects/recertificacao/`
  e importar entre projetos, ou criar um shim de re-export) porque a localização
  física deve refletir que o módulo é compartilhado — import cross-project
  (`modelos` importando de dentro de `recertificacao`) seria confuso e frágil
  se o projeto Recertificação for arquivado depois. Um shim de re-export evitaria
  tocar nos 6 specs, mas é complexidade desnecessária pra um diff mecânico de 8
  arquivos.
- Nenhuma mudança de comportamento é esperada nos specs de Recertificação além
  do caminho de import — `ensureAdminProfile()` e a convenção `*_safe` continuam
  idênticas.

## Fora de escopo

- Nenhum recurso novo (Kit de marca, Modelo de conteúdo, Design) — isso é
  brainstorm próprio se/quando um projeto precisar.
- Nenhuma mudança na UI (`twygo-qa-ui`) — isso é puramente código de pipeline.
- Não remove o parâmetro `hasRecertification` (já é NO-OP documentado,
  remover teria que auditar call sites fora do escopo desta fase).

## Validação

- `npm run typecheck` (`tsc --noEmit`, dentro de `agent-playwright/`) limpo
  após a mudança — pega qualquer import não atualizado.
- `npm run agent:suites` continua listando normalmente (sem erro de import ao
  carregar specs).
