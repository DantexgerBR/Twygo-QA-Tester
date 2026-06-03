---
name: debugar-filename-too-long-windows
description: Em Windows com `MAX_PATH=260` (default), operações git (`pull`, `stash`, `checkout`, `clone`, `reset`) falham com `fatal: Unable to process path ... Filename too long` quando o repo tem paths em `outputs/widgets/reports/<run-id>/artifacts/<test-folder>/step-NN-<descrição-longa>-<sha>.png` ou similares. Use quando uma operação git abortar com `Filename too long` no working tree (não no protocolo SSH/HTTP — esse é outro erro).
when_to_use: |
  - `git pull`/`git checkout`/`git stash` aborta com `Filename too long`
  - `git add outputs/<slug>/reports/` falha em Windows
  - Path em `outputs/<slug>/reports/<run-id>/artifacts/` excede 260 chars
triggers:
  - "Filename too long"
  - "Unable to process path"
  - "MAX_PATH"
  - "core.longpaths"
  - "Windows path"
  - "outputs/reports"
  - "git pull falhou"
version: 1.0.0
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

## Notas

- **Por que `core.longpaths` não é default**: legado de compatibilidade com toolchains pré-2017 do Windows. Hoje, qualquer ferramenta moderna lida com paths longos sem problema. Habilitá-lo não tem downside conhecido em ambientes de dev moderno.
- **macOS e Linux**: não têm esse limite (path max ~4096 chars). Skill aplicável apenas a Windows.
- **WSL** (Linux dentro do Windows): se você opera o repo via WSL2, o limite é do Linux (não há problema). Mas se opera o mesmo repo via PowerShell/Git Bash nativo, dá erro. Recomendação: habilitar `core.longpaths` independentemente — não custa nada e cobre os dois cenários.
