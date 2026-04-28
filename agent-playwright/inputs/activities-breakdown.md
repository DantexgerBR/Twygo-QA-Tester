# Activities Breakdown

Quebra das atividades de automação a partir da análise de teste.

## Formato sugerido

| ID  | Cenário       | Caso de Teste                    | Prioridade | Owner  | Status     |
|-----|---------------|----------------------------------|------------|--------|------------|
| A01 | Autenticação  | Login com credenciais válidas    | Alta       | QA     | Pendente   |
| A02 | Autenticação  | Login com credenciais inválidas  | Alta       | QA     | Pendente   |

## Critérios de pronto (DoD) por atividade
- [ ] Page Object existe e cobre seletores do cenário.
- [ ] Spec `*.spec.ts` gerada em `tests/features/`.
- [ ] `npm run typecheck` limpo.
- [ ] Teste roda verde ao menos 3× seguidas em `staging`.
- [ ] Screenshots/traces configurados para falhas.

> Atualize esta planilha conforme o avanço dos cenários do XML.
