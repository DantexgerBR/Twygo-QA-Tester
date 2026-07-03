# Validação — Card Artia 20488 (P2) — Mensagens e notificação da ação em massa [Registros F2]

**PR a validar**: https://github.com/Twygo/twyg-app/pull/10978
**Ambiente alvo**: `https://registrosf2.stage.twygoead.com` (org 37079)

## Bloqueio de acesso — não foi possível autenticar na org 37079

Nenhuma credencial disponível em `.env` consegue autenticar em
`registrosf2.stage.twygoead.com` (org 37079), impedindo o acesso à tela de
Registros de treinamentos externos e, consequentemente, a validação do
mérito do PR #10978 (textos de toast/notificação da ação em massa).

### O que foi tentado (4 tentativas, todas registradas com screenshot)

| # | Credencial | Host alvo | Resultado |
|---|---|---|---|
| 1 | `TWYGO_STAGING_RECERTIFICACAO_EMAIL` (`agents.qa@claude.com`) | registrosf2.stage.twygoead.com (org 37079) | ❌ "Login ou senha inválidos" |
| 2 | `TWYGO_STAGING_MARCA_DAGUA_EMAIL` (`dante.tavares@twygo.com`) | registrosf2.stage.twygoead.com (org 37079) | ❌ "Login ou senha inválidos" |
| 3 (sanity) | `TWYGO_STAGING_RECERTIFICACAO_EMAIL` | **twygo1772627238.stage.twygoead.com — o próprio host "home" dessa credencial (org 36675)**, per comentário do `.env` | ❌ "Login ou senha inválidos" |
| 4 (sanity) | `TWYGO_STAGING_MARCA_DAGUA_EMAIL` | twygo1772627238.stage.twygoead.com (org 36675, host "home" desta credencial) | ✅ Login OK → `/dashboard_students` |

### Diagnóstico (cross-check feito antes de concluir)

O teste #3 é o achado central: a credencial `TWYGO_STAGING_RECERTIFICACAO_EMAIL`
(`agents.qa@claude.com` / `123456`) foi rejeitada até no **seu próprio host de
origem** (org 36675, onde ela é documentada como válida no `.env`). A rejeição
não é um problema de seletor/timing — a submissão do form gerou request real
(`POST` → `302` de volta para `/users/login`) com a mensagem de erro do
Devise "Login ou senha inválidos", confirmando rejeição client-server
genuína, não falha de automação. Isso indica que essa credencial está
**morta/rotacionada** independente da org 37079.

Já `TWYGO_STAGING_MARCA_DAGUA_EMAIL` (`dante.tavares@twygo.com`) está viva e
funcional (teste #4 confirma login com sucesso), mas está escopada à org
36675 — não existe (ou a senha não é a mesma) na org 37079/registrosf2. Isso
é uma falha de **autenticação** (não de autorização/permissão): a rejeição
ocorreu antes de qualquer verificação de acesso à org, então não há como
inferir se o problema é "usuário não existe na 37079" ou "senha diferente
na 37079" — apenas que nenhuma das duas credenciais do `.env` autentica lá.

Não há, em `config/environment.json`, `.env` ou `.env.example`, nenhuma
entrada dedicada para `registrosf2.stage.twygoead.com` / org 37079 (a
validação anterior do card 20283 nesse mesmo host não deixou rastro de qual
credencial usou — não está documentado em nenhum artefato versionado).

### Consequência

**Não foi possível avaliar o mérito do PR #10978** (textos das 3 toasts de
ação em massa — Aprovar/Excluir/Recusar — e comportamento da notificação).
Nenhuma tela de Registros, ação em massa, toast ou notificação foi
alcançada ou observada. O veredito abaixo é sobre **bloqueio de acesso**,
não sobre a correção em si — não deve ser lido como reprovação do fix.

## Veredito

**❌ Falhou** — por bloqueio de acesso (nenhuma credencial do `.env`
autentica na org 37079/registrosf2.stage.twygoead.com; uma delas
(RECERTIFICACAO) está morta até no próprio host de origem). Card não pôde
ser validado quanto ao mérito do PR #10978.

## Comentário KQA (pronto pra colar no Artia)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage (registrosf2.stage.twygoead.com, org 37079)
:: Validação ::
Não foi possível validar o PR #10978 (textos de toast/notificação da ação em massa
de Registros — Aprovar/Excluir/Recusar) por bloqueio de acesso: nenhuma credencial
disponível autentica na org 37079. Testadas 2 credenciais de staging contra
registrosf2.stage.twygoead.com — ambas rejeitadas com "Login ou senha inválidos"
(request real, 302 de volta pro login, não é falha de automação).
:: Obs ::
❌ aqui é por BLOQUEIO DE ACESSO, não por reprovação da correção — nenhuma tela de
Registros/ação em massa foi alcançada, então nada foi observado sobre o mérito do
PR. Cross-check feito antes de reportar: a credencial TWYGO_STAGING_RECERTIFICACAO
(agents.qa@claude.com) foi testada também no seu PRÓPRIO host de origem (org 36675)
e foi rejeitada igualmente — indica que essa credencial está morta/rotacionada,
independente da org 37079. Já a credencial TWYGO_STAGING_MARCA_DAGUA
(dante.tavares@twygo.com) está viva (login OK confirmado em org 36675), mas não
autentica na 37079 — falta provisionar/confirmar um login válido para essa org.
Pedido a Dante: (1) confirmar/atualizar senha de agents.qa@claude.com, e (2)
indicar qual credencial usar para a org 37079 (registrosf2.stage) — sem isso o
card 20488 não pode ser executado. Reabrir a validação assim que a credencial
estiver disponível.
:: Evidência(s) ::
- 01-registrosf2-login-recertificacao-falhou.png
- 02-registrosf2-login-marcadagua-falhou.png
- 03-sanity-recertificacao-no-home-36675-falhou.png
- 04-sanity-marcadagua-no-home-36675-sucesso.png
Evidência no link: <preencher com a URL do commit após push>
```
