---
name: diagnosticar-perda-acesso-opt-out-beta-twygo
description: Diagnóstico e prevenção do gotcha de sair de um BETA teste no Twygo. Clicar "Interromper BETA teste" (botão `#beta-testing-end-beta-test-button` no banner amarelo de features BETA, ex. "Registros de avaliação") NÃO é um confirm simples — abre uma pesquisa NPS OBRIGATÓRIA, e ao concluir o opt-out a feature some do menu e passa a retornar "Você não tem permissão para acessar esta página" (provável org-wide, não autorreparável pelo admin da org). Use quando um teste/validação precisar sair de um BETA, quando uma feature sumir do menu após opt-out, ou ANTES de acionar qualquer opt-out de BETA numa org compartilhada.
version: 1.0.0
---

# diagnosticar-perda-acesso-opt-out-beta-twygo

Skill de diagnóstico **e prevenção**. O caro aqui não é o fix — é ter
acionado uma ação stateful irreversível-pelo-perfil numa org compartilhada
sem plano de restauração. Leia antes de sair de qualquer BETA.

## O gotcha (caso real — card 20504, 2026-07-06)

Org `37079` (registrosf2.stage) estava em "modo BETA da funcionalidade
Registros de avaliação". Pra tentar alcançar a listagem antiga (com mais
colunas), acionamos o botão do banner **"Interromper BETA teste"**
(`#beta-testing-end-beta-test-button`). Dois fatos não-óbvios:

1. **Não é confirm/cancelar.** O clique abre uma **pesquisa de satisfação
   NPS obrigatória** (título "Antes de cancelar o BETA teste, conta pra
   gente como foi sua experiência", ~5 campos marcados com `*`). O botão
   "Enviar" só ativa com todos os obrigatórios preenchidos. Só depois de
   enviar a pesquisa a ação de opt-out se conclui. O modal **não avisa**
   se a ação é reversível.
2. **O opt-out remove o acesso à feature.** Após enviar (com um pequeno
   atraso de propagação no backend — na mesma aba ainda funcionou por
   alguns segundos), o item da feature **some do menu lateral** e a rota
   direta (`/o/37079/records`) passa a retornar **HTTP 200 + página
   "Você não tem permissão para acessar esta página."** Reproduzido em
   sessões de login novas do mesmo usuário.

## Sintoma canônico

- Uma feature que estava acessível (com badge "BETA") **desaparece do
  menu** e a rota dá "sem permissão" — logo após alguém ter clicado
  "Interromper BETA teste"/opt-out.
- OU: um spec/validação que precisa **sair** do BETA trava numa pesquisa
  NPS inesperada em vez de um confirm.

## Sequência de diagnóstico

1. A feature tinha badge "BETA" e um banner amarelo com "Interromper BETA
   teste"? Alguém acionou o opt-out (ou um spec clicou o botão)? → é este
   caso.
2. Confirme o bloqueio em **sessão nova** (login do zero), não só na aba
   atual — a propagação não é instantânea; a aba antiga pode enganar.
3. Dump do menu (`#menu a`) — o item da feature sumiu de vez? Rota direta
   → "sem permissão"? Então é perda de **acesso/rota**, não de **dado**
   (os registros/certificados continuam no backend; só a tela ficou
   inacessível — **não** alegue "dado perdido").
4. Escopo: confirme com um **2º usuário/credencial** se o bloqueio é
   org-wide (mais provável — enrollment de BETA no Twygo costuma ser por
   organização) ou restrito à sessão. Com 1 credencial é inferência.

## Reversão

- **NÃO é autorreparável pelo perfil Administrador da org.** Não há
  botão/rota de re-opt-in visível (checado: menu, dropdown de perfil,
  todas as páginas de Configurações). `/admin` → 404 pra conta sem Super
  Admin.
- Restauração provável é via **Super Admin**: re-habilitar via Flipper
  actor `Organization;<orgId>` ou configuração de contrato (ver skills
  `testar-feature-flag-twygo` e `alterar-funcionalidade-contrato-twygo`).
  Fora do alcance de quem só tem admin da org → **escalar pro time**.

## Anti-pattern (prevenção — o mais importante)

- ⛔ **Nunca acione opt-out de BETA (`Interromper BETA teste`) numa org
  COMPARTILHADA** (envs de stage usados por vários cards/QAs) sem:
  (a) confirmar que existe caminho de restauração ao alcance, e
  (b) alinhar com quem mais usa a org — o opt-out provavelmente derruba a
  feature pra todos e trava os cards irmãos naquele env.
- Se um card pede validar a saída do BETA, faça-o numa org **dedicada**
  (ex.: Trial provisionada — ver `provisionar-trial-projeto-twygo`), não
  na compartilhada.
- Se precisar da listagem "antiga"/pré-BETA só pra alcançar colunas/telas,
  **procure outro caminho antes** (a mudança pode ser por design do
  redesenho BETA; confirme com o dev onde a tela/coluna vive) — opt-out
  raramente é o caminho certo e o custo do erro é alto.
