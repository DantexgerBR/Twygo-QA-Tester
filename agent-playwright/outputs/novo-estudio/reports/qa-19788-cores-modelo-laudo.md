# Laudo — Retrabalho 19788 [P2] "Não está salvando cores nos modelos"

- **Atividade Artia**: 19788 (Tech - Bug Retrabalho) — Solicitante: Jeiel Alves de Oliveira
- **PR de correção**: https://github.com/Twygo/twyg-app/pull/10534
- **Ambiente**: 🧪 Stage — novoestudio.stage.twygoead.com (org 37061) / banco MySQL `twygo_db_rc`
- **Alvo**: Configurações → Aparência → Kit de marca "Roxo" (`/o/37061/brands/807573/edit`, aba Cores), brand id 1435
- **Execução**: 08/06/2026 — E2E Playwright (login → editar cor → salvar → reload) + cross-check no banco

## Resultado: ✅ PASSOU (corrigido)

As cores **estão sendo salvas**. Validado em 3 camadas:

| Camada | Evidência |
|---|---|
| UI (salvar) | Mudei a cor **Primária** `#9349DE` → `#AB12CD`; toast **"Paleta de cores salva com sucesso"** |
| Persistência (reload) | Após recarregar o editor, a Primária permaneceu `#AB12CD` |
| Banco (fonte de verdade) | `brand_colors` (brand 1435, pos 0) gravou `#AB12CD` com `updated_at` 2026-06-08 16:42 (as demais cores intactas) |

**Cleanup**: a Primária foi **restaurada** para o valor original `#9349DE` ao final (banco confirma, updated_at 16:43) — org de volta ao estado anterior.

## Como foi testado (reprodução)
1. Login na org 37061; Configurações → Aparência → aba Kit de marca.
2. Editar o kit "Roxo" → aba **Cores** (`#brand-form-colors-row-0-hex-input` = Primária).
3. Alterar a Primária para `#AB12CD` e clicar **Salvar** → toast de sucesso.
4. Recarregar o editor e reabrir a aba Cores → valor mantido (`#AB12CD`).
5. Conferir no banco `SELECT ... FROM brand_colors WHERE brand_id=1435` → valor e timestamp atualizados.
6. Restaurar para `#9349DE` (cleanup).

## Comentário KQA (para o Artia 19788)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage — novoestudio (org 37061), Aparência > Kit de marca "Roxo"
:: Validação ::
Correção do PR #10534 validada de ponta a ponta: alterei a cor Primária do Kit de marca
(#9349DE → #AB12CD) e Salvei — toast "Paleta de cores salva com sucesso". Após recarregar o
editor a cor permaneceu, e o banco (brand_colors) registrou o novo valor com timestamp atual.
Cor restaurada ao original ao final (cleanup). As cores estão salvando corretamente.
:: Evidência(s) ::
- Pós-salvar (toast): evidencias/cores_modelo_19788/30-apos-salvar.png
- Pós-reload (persistiu): evidencias/cores_modelo_19788/31-pos-reload.png
- Banco antes/depois: agent-db/evidencias/cores-modelo-antes.txt e cores-modelo-depois.txt
```
