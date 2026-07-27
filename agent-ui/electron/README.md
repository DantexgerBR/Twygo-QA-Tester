# Twygo QA — Desktop (Electron) · esqueleto

Wrap Electron do `agent-ui`. **Não reescreve nada** — sobe o `server.mjs` (zero-dep) com o
Node embutido do Electron e abre uma janela em `http://localhost:4321`.

## Rodar em dev (na sua máquina — precisa de tela)
```bash
cd agent-ui/electron
npm install            # baixa electron (~200 MB) + electron-builder
npm start              # abre a janela do app
```

## Gerar o executável (local, SEM assinatura)
```bash
npm run dist           # o SO atual
npm run dist:win       # Windows (.exe NSIS)
npm run dist:mac       # macOS (.dmg)  — só roda no macOS
npm run dist:linux     # Linux (AppImage)
```
Saída em `dist-electron/`. **Cross-build tem limites:** `.dmg` do Mac só builda no macOS;
Win/Linux dá pra buildar de outros SOs, mas o ideal é a CI (matrix) buildar cada um no seu.

## ⚠️ Pendências do épico (o que falta pra virar release de verdade)
1. **Repos irmãos NÃO são empacotados.** O app referencia `../agent-playwright`, `../agent-db`,
   `../agent-at` em disco (é o pipeline que os QAs já clonam). Então o executável tem que rodar
   **de dentro do clone `Twygo-QA-Tester`** — não é um instalador que funciona em qualquer pasta.
   Decisão do épico: (a) app roda dentro do monorepo (o auto-update dá `git pull` — já implementado),
   ou (b) empacotar/baixar os repos junto. Hoje o esqueleto assume (a).
2. **Assinatura:** Mac precisa de conta Apple Developer + notarização; Windows de cert. Sem isso,
   abre com aviso de "app não identificado". `mac.identity: null` = sem assinar (dev).
3. **CI:** GitHub Actions com matrix (win/mac/linux) buildando e publicando nos Releases do repo Twygo.
4. **Ícone:** adicionar um `icon.png` 512×512 (ou `.ico`/`.icns`) e apontar em `build.icon`
   (por ora usa o ícone padrão do Electron; o `assets/favicon.png` é pequeno demais).
5. **Auto-updater:** `electron-updater` + GitHub Releases — plugar depois da CI/assinatura.

## Notas técnicas
- `main.mjs` roda `server.mjs` via `ELECTRON_RUN_AS_NODE` (sem Node separado) e espera a porta subir
  antes de carregar a janela. Single-instance (não abre 2 servers na mesma porta).
- `asar: false` pra os caminhos relativos (`../server.mjs`, `../assets`) resolverem simples.
- `node_modules/` e `dist-electron/` são gitignored (ver `.gitignore` deste dir).
