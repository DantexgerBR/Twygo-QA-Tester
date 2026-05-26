# Ambientes adicionais

Os 3 TCs validam funcionalidade de Painéis em **ambientes adicionais**
(multi-tenant — org adicional pareada à principal, contrato compartilhado,
feature flag por env):

1. **Funcionalidade de Painéis em ambiente adicional** — aba 'Painéis' aparece + listagem carrega no env adicional.
2. **Painéis criados no principal não aparecem no adicional** — isolamento de dados (R1).
3. **Modo de uso no adicional usa painel local** — dropdown 'Espaço' do form de item de menu lista painel criado no adicional.

## Infraestrutura

- **Env adicional**: `staging-widgets-aditional`, pareado a `staging-widgets` (host/orgId em `.env`).
- **Storage**: `outputs/.auth/storage-aditional.json` — gerado automaticamente por `global-setup.ts` ao detectar env com sufixo `-aditional`.
- **POM**: `PaineisListPage`/`PainelFormPage` aceitam `orgIdOverride` opcional no constructor — permite reuso completo dos POMs em specs de env adicional.

## Padrões

Skill canônica: [`testar-ambientes-adicionais-twygo`](../../../../.claude/skills/testar-ambientes-adicionais-twygo/SKILL.md).

## Notas

- **TC2** cria painel no principal + valida ausência no adicional + cleanup no principal (`afterAll` com 2 contextos).
- **TC3** descobre `useModeId` dinamicamente no adicional via `goToModosDeUso` + scrape de href — não hardcoda valor (env adicional pode ter useModes distintos dos do principal).
