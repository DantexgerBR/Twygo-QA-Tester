---
name: debugar-filename-too-long-windows
description: Em Windows com `MAX_PATH=260` (default), operações git (`pull`, `stash`, `checkout`, `clone`, `reset`) falham com `fatal: Unable to process path ... Filename too long` quando o repo tem paths em `outputs/widgets/reports/<run-id>/artifacts/<test-folder>/step-NN-<descrição-longa>-<sha>.png` ou similares. Use quando uma operação git abortar com `Filename too long` no working tree (não no protocolo SSH/HTTP — esse é outro erro). COBRE TAMBÉM a variante silenciosa — clone/checkout que aborta no meio e deixa o working tree parcial (`git status` cheio de `D`, runtime/projeto inteiro ausente do disco), facilmente confundida com "branch quebrada no remoto".
version: 1.1.0
---

# debugar-filename-too-long-windows

## Sintoma canônico

Qualquer operação git que toca o working tree falha com:

```
warning: in the working copy of '...', LF will be replaced by CRLF the next time Git touches it
error: lstat("agent-playwright/outputs/widgets/reports/<run-id>/artifacts/<test-folder>/step-01-<...>-<sha>.png"): Filename too long
fatal: Unable to process path agent-playwright/outputs/widgets/reports/...
Cannot save the untracked files
```

ou em `pull` / `checkout`:

```
error: unable to create file <path>: Filename too long
```

O path culpado é tipicamente em `outputs/widgets/reports/` ou similar — combina:
- dir-tree profunda (`outputs/<slug>/reports/<run-id>/artifacts/<test-folder>/`)
- nome do teste Twygo em PT-BR transliterado (`projects-widgets-tests-fea-1e9eb-xistente-via-ícone-de-lápis-chromium`)
- prefixo de step da fixture exploratória (`step-01-Pr--condi-o-criar-painel-e-abrir-aba-Layouts-`)
- hash SHA truncado (`9ea0df1d8005e280917ca79c524b083983591d20.png`)

Esses 4 fatores somam frequentemente >260 chars.

## Variante silenciosa: clone/checkout parcial (a mais traiçoeira)

Nem sempre o erro aparece na sua cara. Quando o `git clone` (ou um `checkout`
de branch) bate no primeiro path longo demais, ele **aborta o checkout no meio**
— o `.git` é populado por completo (todos os commits estão lá), mas o working
tree fica **parcial**: tudo que vinha na ordem de escrita ANTES do path culpado
foi gravado, tudo DEPOIS não. O erro "Filename too long" rola durante o clone e
some do scroll; o que sobra é um working tree mutilado sem mensagem óbvia.

**Sintoma enganoso** — parece "branch quebrada no remoto" ou "clone corrompido":

- `git status` mostra **centenas/milhares de arquivos como `D`** (staged
  deletion), porque o index tem entradas que o disco não tem.
- Pastas/arquivos inteiros **faltam do disco** (ex.: `package.json`, `src/`,
  `tests/`, `projects/<slug>/` sumiram), embora estejam no commit.
- O corte é **cirúrgico e ordenado**: subpastas alfabeticamente anteriores
  (ex.: `agent-at/`, `agent-db/`) vêm 100% completas; a pasta onde o path
  longo vive (ex.: `agent-playwright/`, por causa de `outputs/.../reports/`)
  vem cortada no meio.

**Diagnóstico em 3 comandos** (confirma que é isto e NÃO problema de remoto):

```bash
# 1. O remoto está íntegro? HEAD local == upstream → conteúdo do commit OK
git rev-parse HEAD; git rev-parse @{u}        # iguais = branch remota não tem culpa

# 2. Quantos arquivos do commit faltam no disco?
git ls-tree -r HEAD --name-only | while read -r p; do [ -e "$p" ] || echo "$p"; done | wc -l

# 3. Existe path > 260 chars no commit? (a causa)
git ls-tree -r HEAD --name-only | awk '{ if (length($0) > 259) print length($0), $0 }' | sort -rn | head
```

Se (1) bate, (2) é alto e (3) lista paths longos → é clone parcial por
`longpaths`, não branch quebrada.

**Fix** (liga longpaths e re-materializa o que faltou — seguro, nada a perder
porque o disco não tem modificações, só falta arquivo):

```bash
git config --global core.longpaths true
git reset --hard HEAD      # ou: git checkout HEAD -- .
```

Depois confira que o working tree ficou limpo (`git status` sem `D`).

> **Por que confundir com "branch quebrada" é o risco real**: o instinto é
> culpar o remoto ou refazer o clone numa branch diferente. Antes disso, rode
> o comando (1) — se HEAD == upstream, o remoto está perfeito e o problema é
> 100% local de checkout no Windows.

## Por que acontece

Windows tem 2 modos de path:
- **Legacy** (`MAX_PATH = 260`): default em todos os processos compilados sem opt-in.
- **Long paths** (até 32767 chars): exige `\\?\` prefix OU opt-in via manifest do exe OU registry key + opt-in per-process.

`git for Windows` (e o `git.exe` empacotado em Git Bash, GitHub Desktop, Tortoise, etc.) NÃO opta in por default. Para habilitar:

```bash
git config core.longpaths true
```

Isso liga a flag **só para esse repo** (`.git/config`). Para todos os repos do usuário:

```bash
git config --global core.longpaths true
```

> **Importante**: `core.longpaths` controla apenas o que o `git.exe` faz. Outros executáveis (Explorer, alguns editores, ferramentas de zip) **continuam** com limite 260. Isso quase nunca importa pra desenvolvimento, mas se o build/CI usar PowerShell/cmd com `dir`/`Remove-Item` em paths longos, pode dar problema separado.

## Fix imediato (1 comando)

Dentro do repo afetado:

```bash
git config core.longpaths true
```

Retentar a operação que falhou. Não precisa reabrir sessão, não precisa restart de nada.

## Fix permanente (recomendado pra dev Windows)

```bash
git config --global core.longpaths true
```

Vale para qualquer repo futuro que você clonar. Tradeoff: zero — é uma config moderna do git, suportada desde 2.4.

Se o time inteiro está em Windows, vale documentar isso no `SETUP.md` ou no `.gitconfig` template do dev box, **ou** commitar via `[includeIf]` num config compartilhado.

Para o monorepo `twygo-agents-qa`, vale adicionar nota em `.claude/SETUP.md` (instrução de instalação inicial).

## Checklist de 1 minuto

1. **Confirme que é esse erro** (não outra coisa):
   ```bash
   git status 2>&1 | grep -i "filename too long"
   ```
   Se mostrar o erro, é esse o problema.

2. **Identifique o path culpado** (vai aparecer no output do comando que falhou). Conte os chars:
   ```bash
   # PowerShell
   "agent-playwright/outputs/...".Length
   # Bash
   echo -n "agent-playwright/outputs/..." | wc -c
   ```
   Se >250, é certeza.

3. **Aplique o fix local**:
   ```bash
   git config core.longpaths true
   git status   # deve voltar a funcionar
   ```

4. **Se for incômodo recorrente, aplique global**:
   ```bash
   git config --global core.longpaths true
   ```

## Anti-patterns

- ❌ **Deletar manualmente os arquivos que dão erro.** O working tree fica em estado misto e o próximo `git pull` ressuscita arquivos com mesmo path. Resolve sintoma, não causa.
- ❌ **Renomear paths longos no working tree antes do pull.** Cria mismatch entre working tree e o que o git tem em index/HEAD — vira merge bagunçado.
- ❌ **Encurtar nomes de specs Twygo em PT-BR pra reduzir path.** O nome do test ID e os steps são dado de domínio — encurtar prejudica leitura do relatório. Habilitar `longpaths` é a abordagem correta.
- ❌ **Mover `outputs/` pra fora do repo.** Em `agent-playwright/`, decisão recente do projeto (commits `bd09c76`, `072e43c`) foi manter outputs em git pra registro de execuções — não desfazer essa decisão por causa de limite de path do Windows.
- ❌ **Usar `git rm --cached outputs/widgets/reports/.../step-NN-*.png` pra resolver.** Não resolve o erro de `git stash`/`pull` — eles falham antes de qualquer rm.

## Por que esta skill existe

Em 2026-05-12, em sessão de `git pull origin chore/agentes-qa-overhaul` na branch `project/paineis-dos-usuarios-widgets`, o `git stash push -u -- outputs/` falhou com `Filename too long` num path de 270+ chars em `outputs/widgets/reports/adicionar-editar-aba_20260511-165802/artifacts/projects-widgets-tests-fea-1e9eb-xistente-via-ícone-de-lápis-chromium/step-01-Pr--condi-o-criar-painel-e-abrir-aba-Layouts-9ea0df1d8005e280917ca79c524b083983591d20.png`.

Fix foi `git config core.longpaths true` no repo local — 1 comando, problema desaparece. Sem essa skill, a próxima sessão Windows perde 15-30min entendendo o erro, tentando renomear/deletar arquivos, ou abandonando o stash.

Em 2026-06-25, na branch `project/registros-externos`, a **variante silenciosa**
apareceu: o clone tinha abortado no meio (sem `core.longpaths`), deixando
`git status` com 2057 arquivos `D` e o working tree sem o runtime inteiro do
`agent-playwright` (`package.json`, `src/`, `tests/`, `projects/registros-externos/`
— 1431 de 2057 arquivos faltando). `agent-at/` e `agent-db/` vieram completos
(paths curtos, vêm antes na ordem); `agent-playwright/` cortou exatamente em
`outputs/registros-externos/reports/.../artifacts/...` (primeiro path > 260).
A confusão inicial foi achar que a branch remota estava quebrada — `git rev-parse
HEAD == @{u}` provou que o commit estava íntegro e o problema era só o checkout
local. Fix: `core.longpaths true` + `git reset --hard HEAD` re-materializou os
1431 arquivos. Esse caso motivou a seção "Variante silenciosa" acima.

## Notas

- **Por que `core.longpaths` não é default**: legado de compatibilidade com toolchains pré-2017 do Windows. Hoje, qualquer ferramenta moderna lida com paths longos sem problema. Habilitá-lo não tem downside conhecido em ambientes de dev moderno.
- **macOS e Linux**: não têm esse limite (path max ~4096 chars). Skill aplicável apenas a Windows.
- **WSL** (Linux dentro do Windows): se você opera o repo via WSL2, o limite é do Linux (não há problema). Mas se opera o mesmo repo via PowerShell/Git Bash nativo, dá erro. Recomendação: habilitar `core.longpaths` independentemente — não custa nada e cobre os dois cenários.
