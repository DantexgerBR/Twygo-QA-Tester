# Status × Ações — Ciclo e Campanha

> Referência para devs. Fonte de verdade: `CiclosList.tsx` + `CampanhasList.tsx`.
> Última revisão: 2026-05-31.

---

## CICLO

### Máquina de estados

```
                    [criar]
                       │
                       ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  RASCUNHO            não publicado; em configuração         │
  │  chip: cinza claro   #EDF2F7 / #718096                      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  salvar / publicar
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  PROGRAMADO          publicado; data de início futura       │
  │  chip: âmbar         #FEEBC8 / #9C4221                      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  data de início atingida (automático)
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  EM ANDAMENTO        período vigente; campanhas rodando     │
  │  chip: verde         #C6F6D5 / #22543D                      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  "Encerrar ciclo"  (manual) ou
                                 │  data de fim atingida
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  FINALIZADO          ESTADO TERMINAL — não reabrível        │
  │  chip: azul claro    #BEE3F8 / #2C5282                      │
  └─────────────────────────────────────────────────────────────┘
```

---

### Menu 3 pontos por status

| Ação                | Rascunho | Programado | Em andamento | Finalizado |
|---------------------|:--------:|:----------:|:------------:|:----------:|
| Ver resumo          |          | ✓          | ✓            | ✓          |
| Editar              | ✓        | ✓          |              |            |
| Gerenciar campanhas |          | ✓          | ✓            |            |
| Prorrogar prazo     |          |            | ✓            |            |
| Ver histórico ¹     |          |            | ✓ (cond)     | ✓ (cond)   |
| Duplicar            |          | ✓          | ✓            | ✓          |
| Excluir ⚠           | ✓        | ✓          |              |            |

> ¹ **Ver histórico** aparece somente se `historicoMudancas.length > 0`.
> ⚠ Ações destrutivas (vermelhas no menu).

---

## CAMPANHA

### Máquina de estados

```
                    [criar]
                       │
                       ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  RASCUNHO            em configuração; não publicada         │
  │  chip: cinza claro   #EDF2F7 / #718096                      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  publicar
                                 │
                    ┌────────────┴────────────┐
           sem pares│                         │com pares
                    ▼                         ▼
  ┌─────────────────────────┐   ┌─────────────────────────────────────────┐
  │  AGENDADA               │   │  AGUARDANDO PARES                       │
  │  publicada; data futura │   │  aguardando indicação / aprovação       │
  │  chip: âmbar            │   │  de avaliadores de pares                │
  │  #FEEBC8 / #9C4221      │   │  chip: laranja  #FED7AA / #9A3412       │
  └────────────┬────────────┘   └──────────────────┬──────────────────────┘
               │                                   │  pares confirmados
               │                                   ▼
               │                   ┌───────────────────────────────┐
               │                   │  AGENDADA  (mesma caixa acima)│
               │                   └──────────────┬────────────────┘
               │                                  │
               └──────────────────────────────────┘
                                 │  data de início atingida (automático)
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  EM ANDAMENTO        período vigente; avaliações abertas    │
  │  chip: verde         #C6F6D5 / #22543D                      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │  data de fim atingida (automático)
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  ENCERRADA           ESTADO TERMINAL — não reabrível        │
  │  chip: azul claro    #BEE3F8 / #2C5282                      │
  └─────────────────────────────────────────────────────────────┘
```

---

### Menu 3 pontos por status

| Ação            | Rascunho | Aguardando pares | Agendada | Em andamento | Encerrada      |
|-----------------|:--------:|:----------------:|:--------:|:------------:|:--------------:|
| Ver detalhes    |          | ✓                | ✓        | ✓            | ✓              |
| Editar          | ✓        | ✓                | ✓        |              |                |
| Indicar pares   | ✓        | ✓                |          |              |                |
| Alterar pares   |          |                  | ✓        | ✓            |                |
| Prorrogar prazo |          |                  |          | ✓            | ✓ (≤5 d.u.) ² |
| Ver histórico ¹ |          |                  |          | ✓ (cond)     | ✓ (cond)       |
| Excluir ⚠       | ✓        | ✓                | ✓        |              |                |

> ² **Prorrogar prazo em Encerrada** só fica ativo se houver ≤ 5 dias úteis entre o fim da campanha e a data do pedido. Fora desse janela o item aparece desabilitado com explicação. Ao confirmar, a campanha retorna automaticamente para **Em andamento**.

> ¹ **Ver histórico** aparece somente se `historicoMudancas.length > 0`.
> ⚠ Ação destrutiva (vermelha no menu).

---

## Regras de validação na criação de Campanha

| Regra | Comportamento |
|-------|--------------|
| `dataFim` da campanha > `dataFim` do ciclo | Bloqueado — date picker limita o `max` ao fim do ciclo; mensagem inline se digitado manualmente. Não é possível salvar. |

## Relação Ciclo → Campanha

```
CICLO Programado  ──► pode ter campanhas Rascunho / Aguardando pares / Agendada
CICLO Em andamento ──► pode ter campanhas em qualquer status
CICLO Finalizado  ──► campanhas em andamento são INTERROMPIDAS;
                       ResumoCiclo (read-only) fica disponível nas campanhas
```

> Configuração avaliativa (tipos, pesos, etapas) vive **no Ciclo** e é herdada pelas campanhas (read-only lá).
> Período e público-alvo são exclusivos da **Campanha**.

---

## Legenda de cores (chips)

| Entidade  | Status           | bg        | color    | Semântica visual       |
|-----------|-----------------|-----------|----------|------------------------|
| Ciclo     | Rascunho         | `#EDF2F7` | `#718096`| neutro / inativo       |
| Ciclo     | Programado       | `#FEEBC8` | `#9C4221`| alerta / pendente      |
| Ciclo     | Em andamento     | `#C6F6D5` | `#22543D`| ativo / positivo       |
| Ciclo     | Finalizado       | `#BEE3F8` | `#2C5282`| histórico / concluído  |
| Campanha  | Rascunho         | `#EDF2F7` | `#718096`| neutro / inativo       |
| Campanha  | Aguardando pares | `#FED7AA` | `#9A3412`| pendência ativa        |
| Campanha  | Agendada         | `#FEEBC8` | `#9C4221`| alerta / pendente      |
| Campanha  | Em andamento     | `#C6F6D5` | `#22543D`| ativo / positivo       |
| Campanha  | Encerrada        | `#BEE3F8` | `#2C5282`| histórico / concluído  |
