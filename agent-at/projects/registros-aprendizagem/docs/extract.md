# Extract — KPI Cards de Registros de Aprendizagem

## Objetivo (1 frase)

Especificar o comportamento dos 4 KPI cards (Emitidos, Expirados, Pendentes, Recusados) das telas de Registros de Aprendizagem nos 3 perfis (Aluno, Líder, Admin), incluindo cálculo da contagem, regras de atualização, escopo por perfil e estado vazio (contagem = 0), fechando pontas de back/regra de negócio que ainda não estão definidas em `docs/specs/registros-aprendizagem.md` §5 + §6.

## Atores

- **Aluno (Colaborador)** — vê os 4 KPIs no Meu histórico (tela `MeuHistoricoPage`) escopados ao próprio usuário. Cards clicáveis funcionam como filtro de status sobre a lista.
- **Líder** — vê os 4 KPIs na AdminRegistrosPage escopados aos seus liderados diretos (regra §4 da spec). Cards são estáticos (dashboard).
- **Administrador** — vê os 4 KPIs na AdminRegistrosPage escopados a toda a organização. Cards são estáticos.
- **Backend / sistema** — calcula contagens, mantém status "Expirado" coerente com a data de validade do registro.

## Capacidades brutas

- Os 4 KPI cards aparecem nas duas telas (Meu histórico do aluno + Aprendizagem > Registros do admin/líder).
- Cada card mostra: donut chart (proporção sobre o total) + número (contagem do status) + label do status + tooltip.
- 4 status fixos cobertos pelos cards: **Emitido**, **Expirado**, **Pendente**, **Recusado**.
- Cores dos cards: Emitido `#38A169` (verde), Expirado `#F56565` (vermelho), Pendente `#DD6B20` (laranja), Recusado `#718096` (cinza).
- O conjunto de status do registro tem 6 valores no mock: Emitido, Expirado, Pendente, Recusado, Substituído, "Em andamento". **Substituído e Em andamento NÃO aparecem como KPI cards** — só nos chips e na coluna da lista.
- **Aluno**: card clicável funciona como filtro de status sobre a lista (toggle on/off).
- **Aluno**: o card ativo ganha borda + leve elevação; demais ficam dimmed (grayscale + opacity reduzida).
- **Aluno**: contagem não reage ao filtro do drawer "Lista de filtros" (a contagem é sempre do total do colaborador, independente do que está filtrado na lista abaixo).
- **Admin/Líder**: cards estáticos. Sem cursor pointer, sem hover transform, sem clique. Função puramente de resumo executivo.
- **Admin/Líder**: contagem não reage a filtros nenhum — é o total bruto da organização (Admin) ou dos liderados (Líder).
- **Total** que serve de denominador do donut:
  - Aluno: total de registros do próprio colaborador.
  - Admin: total de registros da organização.
  - Líder: total de registros das pessoas que ele lidera diretamente.
- **Estado vazio (contagem = 0)**: donut renderiza como anel cinza completo `#EDF2F7`; número "0" preto bold; label normal; sem dimming. Vale igual pros 3 perfis.
- **Fix técnico do estado vazio**: o `DonutChart` em `StatsCards.tsx` cobre o caso "1 slice 100%" renderizando 2 círculos (anel + buraco branco) em vez do path SVG, que degenerava quando uma fatia ocupa 100% do anel.
- **Tooltip do card**: hoje no protótipo o texto varia por perfil (Aluno usa tom "você", Admin usa tom institucional). Tooltip é opcional (componente aceita `tooltip?: string`).
- **Carga horária total**: mostrada à direita dos KPIs (não é um card próprio). Aluno: total do colaborador. Admin: total da organização. Líder: total dos liderados.

## Pontos de incerteza — respostas

- **Atualização do KPI após ações** (Aprovar/Recusar/Editar/Excluir/Adicionar) → **imediato após cada ação**, sem reload. UX impacta a percepção de feedback.
- **Status "Expirado" cruzando meia-noite** → **reflete no mesmo instante**. UX exige consistência rígida. Implementação fica com o dev (vira Spike de cálculo on-the-fly vs job materializado).
- **Mudança de hierarquia do Líder** → **decisão técnica do dev**. Max não tem preferência de produto. Vira Premissa registrada + Spike pra dev decidir política (snapshot/cache/realtime).
- **Pessoas inativadas/desligadas** → **somem completamente do KPI e da lista**. Regra de negócio definida. Spike só pra confirmar como implementar o filtro no back.
- **Estado "tudo zero"** → **faixa aparece com 4 cards zerados** (4 anéis cinza completos). Aluno novo entra na empresa e já vê a faixa. Mesma regra do §6.

## Decisões adicionais durante o Round 2/3

- **Total do donut (denominador)**: soma de TODOS os 6 status (Emitido + Expirado + Pendente + Recusado + Substituído + "Em andamento"), não só os 4 do KPI. Donut bate com volume real, mas soma dos 4 cards pode ser menor que o total.
- **Multi-organização do Aluno**: NÃO vai existir nessa feature. Registros sempre escopados à org ativa.

## Referências externas mencionadas

- `docs/specs/registros-aprendizagem.md` §5 — KPI cards: comportamento divergente entre Aluno e Admin
- `docs/specs/registros-aprendizagem.md` §6 — Estado vazio (contagem = 0)
- `docs/specs/registros-aprendizagem.md` §4 — Escopo do Líder (só atua sobre liderados diretos)
- Memory `project_lms_kpi_estado_vazio_2026_05_25.md`
- Memory `project_lms_admin_2026_05_19.md` (sessões 2026-05-19 a 22)
- Código do protótipo: `frontend/src/components/MeuHistoricoPage.tsx` (Aluno), `frontend/src/components/AdminRegistrosPage.tsx` (Admin/Líder), `frontend/src/components/StatsCards.tsx` (componente `DonutChart`)
- Contexto Twygo no produto: domínio 3 (Aprendizagem/Conteúdos/Eventos) — `context/twygo/database/03_learning_content.md`. Hoje não há entidade `RegistroAprendizagem` no twyg-app; o protótipo opera com mock próprio.

## Premissas / decisões já tomadas (não vão virar pergunta)

- Status do KPI fixos: Emitido, Expirado, Pendente, Recusado. Substituído e "Em andamento" ficam fora dos cards (só na lista).
- Tooltip do card varia por perfil — fica como decisão de copy já validada.
- Não há card de KPI pra carga horária — segue como label à direita.
- Toggle de filtro do Aluno: clicar no card ativo deseleciona. Mesma UX do `FiltroRadio` do drawer.
- Card vazio do Aluno continua clicável (filtra pro empty state da lista).
- Cor verde do donut "Emitido" é a mesma do produto (`#38A169`); cor vermelha do "Expirado" foi suavizada de `#E53E3E` pra `#F56565` na sessão 2026-05-21 (decisão validada).
- Estado vazio do donut: anel cinza completo `#EDF2F7`, sem dimming, número "0" bold. Pattern decidido em 2026-05-25.
