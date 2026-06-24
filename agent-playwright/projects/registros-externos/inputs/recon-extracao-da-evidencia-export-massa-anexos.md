# Recon — Extração de dados da Evidência (export em massa de anexos)

> Suíte RN79 (`test-analysis.md:3608`). Mesma porta de entrada da suíte irmã
> **"Extração de dados e evidências (assíncrona com modal de atenção)"** — o
> recon de UI (drawer, seletores, endpoint) é reaproveitado de
> [`recon-extracao-de-dados-evidencias-assincrona-modal-de-atencao.md`](recon-extracao-de-dados-evidencias-assincrona-modal-de-atencao.md)
> (ao vivo 2026-06-23, env `staging-registros-externos`, org 37079). Este doc
> registra apenas as decisões de design **específicas desta suíte**.

## O que esta suíte cobre (e por que é majoritariamente manual)

A suíte valida a **estrutura interna do pacote ZIP** gerado pelo job de export
assíncrono de anexos — não a UI. As 5 TCs têm o **passo 2 marcado "(etapa
manual)"** no próprio test-analysis: baixar o ZIP (via notificação do sino /
e-mail) e inspecionar pastas/arquivos. Isso **não é automatizável por
Playwright UI** — Playwright não baixa o e-mail/notificação assíncrona nem
inspeciona a árvore interna do ZIP gerado por worker.

| TC | Verificação distintiva (o ponto da TC) | Automatizável por UI? |
|---|---|---|
| TC1 — pasta por pessoa no ZIP | estrutura de pastas dentro do ZIP | ❌ manual (download + unzip) |
| TC2 — log de falhas parciais | `export_errors.txt` no ZIP + arquivo corrompido no storage | ❌ manual + seed/infra (arquivo corrompido simulado) |
| TC3 — split de export grande | múltiplos ZIPs + notificação única | ❌ manual + seed (volume acima do threshold) |
| TC4 — expiração do link (TTL) | link expirado nega download | ❌ seed/infra (link com TTL expirado preparado) |
| TC5 — inclusão de mirrors | anexos de participantes de conteúdo espelhado no ZIP | ❌ manual + seed (conteúdo compartilhado) |

## Única superfície automatizável: o **dispatch** do job de export

O passo 1 comum a TC1/TC3/TC5 é "Disparar extração de Evidências". O recon da
suíte irmã confirmou que isso dispara **`201 POST
/api/v1/o/{org}/subscription_attachments_exports`** e fecha o drawer (backend
OK), **porém sem toast** "Extração iniciada" (gap de feedback do BETA — já
reportado pela suíte irmã, TC6; não reabrimos o mesmo vermelho aqui).

Esse dispatch é a **precondição de toda a suíte**: se o job não é criado, nenhum
ZIP existe e nenhuma das verificações manuais é possível. Logo:

- **TC1** automatiza esse dispatch (assert `201` + drawer fecha) — é o sinal
  verde/vermelho real da suíte — e documenta a inspeção do ZIP como etapa manual.
- **TC2/TC3/TC4/TC5** são `test.fixme` legítimo (verificação manual + seed/infra
  ausente — categoria "verificação 100% manual" da matriz §7.6-F do CLAUDE.md,
  mesma decisão da TC8 da suíte irmã). O dispatch já é coberto pela TC1; reasertá-lo
  em cada TC seria duplicação sem sinal adicional.

## Reuso de código

- POM: **`ExtracaoDrawerPage`** (já existe; criado pela suíte irmã). `goto()` +
  `open()` + `selectType('Evidências')` + `triggerEvidExtract(scope)`.
- Seletores do drawer Evidências: `records-extraction-evidences-scope-current`
  / `-scope-all` / `-submit` / `-cancel` (ver recon irmão).
- Endpoint: `POST /api/v1/o/{org}/subscription_attachments_exports` → 201.

## Operação

Rodar **isolado** com `--retries=1` (contenção de sessão clobbera outputs e
gera ENOENT em trace-write no Windows — ver memory acoes-em-massa-suite). Sem
cleanup (memory sem-cleanup-seed-persistente): disparar um export não deixa
orphan na listagem.
