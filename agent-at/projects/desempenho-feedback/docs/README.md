# PRDs do POC Desempenho

Documentos de apoio pra dev do **twyg-app** (Rails + React Clean Arch), extraídos a partir do protótipo já validado em `claude-twygo-prototype`.

> 📚 **Entrypoint do diretório**: [`../README.md`](../README.md) (mapa de leitura por persona) + [`../glossary.md`](../glossary.md) (vocabulário canônico).
> 🐛 **Divergências protótipo vs PRDs**: [`../gaps/README.md`](../gaps/README.md) — 15 gaps catalogados.

## Convenções de leitura

- **Refs no protótipo** usam **linguagem da UI literal** (ex: "Sidebar > Gestão de Time(s) > Feedbacks e Anotações"), nunca nomes de arquivo/componente. Componentes só são citados quando relevantes pra entender uma estrutura interna (ex: `RegistrarFeedbackLider`).
- **#RN com numeração global contínua** — RN 1, RN 2, RN 3... independente da HU. RN 7 pode estar em qualquer HU.
- **Critérios de aceite (CA)** em formato **DADO/QUANDO/ENTÃO** (Gherkin estrito — ver [`../glossary.md § 10`](../glossary.md#10-critérios-de-aceite-formato-gherkin-estrito)).
- **Foco no WHAT**, não no HOW. Decisões de reuso (tabela `Event`? entidade nova? Service vs Interactor?) ficam pro time do twyg-app — PRD descreve comportamento esperado.
- **Fora de escopo** explícito em cada HU pra blindar contra scope creep.
- Cada PRD termina com 2 seções extras: **§ 7 Como testar** (fixtures + comandos) e **§ 8 Cross-references** (gaps + modelo compartilhado + glossário + twy plan).

## Os 7 PRDs

| # | Perfil | Áreas | Arquivo |
|---|--------|-------|---------|
| 1 | **Admin** | Gestão de Time(s) > Desenvolvimento | `prd-admin-desenvolvimento.md` |
| 2 | **Admin** | Gestão de Time(s) > Feedbacks e Anotações | `prd-admin-feedbacks-anotacoes.md` |
| 3 | **Líder** | Gestão de Time(s) > Desenvolvimento | `prd-lider-desenvolvimento.md` |
| 4 | **Líder** | Gestão de Time(s) > Feedbacks e Anotações | `prd-lider-feedbacks-anotacoes.md` |
| 5 | **Aluno** | Desenvolvimento > Avaliações a preencher | `prd-aluno-avaliacoes.md` |
| 6 | **Aluno** | Desenvolvimento > Feedbacks recebidos | `prd-aluno-feedbacks-recebidos.md` |
| 7 | **Admin** | Usuários (Dados DHO — cadastro, edição, importação CSV) | `prd-admin-usuarios-dho.md` |

## Naming canônico (validado 2026-05-13)

- **Módulo na UI**: "Feedbacks e Anotações"
- **Conceito interno** (entidade, código, refs históricas): "Registros" / `Registro`
- Quando o PRD mencionar **comportamento de usuário**, usar "Feedbacks e Anotações". Quando mencionar **modelo de dado**, citar "Registro" com seus 5 tipos.

## Fora do escopo desta leva de PRDs

- **Eficácia (Participativo)** — vive no protótipo por conveniência, sem relação com o escopo desta entrega. Não documentar aqui.
- **PDI / Competências / Mapa de Transições (Sucessão)** — pesquisa dos outros grupos, fora do recorte do grupo Desempenho.
- **Refactor de protótipo** — PRDs descrevem o estado validado, não propõem mudanças retroativas. Eventuais decisões de naming/divergências entram como nota, não como tarefa de port.
- **Gestor matricial** — decisão Twygo (review 2026-05-08, confirmada 2026-05-14): não existe na realidade. Cada Pessoa tem **no máximo 1 `liderDiretoId`**. PRDs #1 e #6 foram ajustados pra refletir essa decisão; PRD #7 codifica como RN.

## Decisões consolidadas em 2026-05-14

- **PRD #7 adicionado** — cobre cadastro de Usuário com Dados DHO (admissão, líder direto, cargo nível, responsável por desenvolvimento). Destrava os outros 6 (filtro de público-alvo de campanha, hierarquia avaliativa, dashboard do Líder).
- **Sem derivação automática nos Dados DHO** — campos calculados (ex: tempo na empresa) ficam como UI hint local no frontend, sem persistência nem RN.
- **Sem dependências cross-campo automáticas** — `responsavelDesenvolvimentoId` é campo independente, sem default e sem validação atrelada ao líder direto.
