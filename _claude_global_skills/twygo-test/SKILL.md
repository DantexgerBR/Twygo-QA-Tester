---
name: twygo-test
description: Automatizar casos de teste manuais da plataforma Twygo no repositório ~/playwright-tests (Python + Playwright). Disparar quando o usuário (1) colar um caso de teste no formato Twygo (Objetivo/Pré-condições/Passos numerados com Resultado Esperado), (2) pedir para rodar testes nesse repo, ou (3) mencionar "incidente"/"reportar falha"/"bug report" no contexto Twygo.
---

# Skill: Twygo Test Automation

Esta skill cobre o ciclo completo de automação de casos de teste manuais da Twygo, no repositório local `~/playwright-tests`.

## Quando disparar

1. **Caso de teste novo colado pelo usuário** — texto com Objetivo + Pré-condições + tabela de passos numerados (#, Ações do Passo, Resultados Esperados, Execução, Status).
2. **Pedido para rodar testes** — usuário diz "rode os testes", "execute o pytest", "valida no Twygo", etc.
3. **Pedido de reproduzir/reportar incidente** — usuário diz "tem um bug", "reportar incidente", "gerar incident report".
4. **Pergunta sobre o repo `playwright-tests`** — qualquer dúvida sobre estrutura, execução ou padrão de testes da Twygo.

## Pré-requisito sempre

**Primeiro cheque se `~/playwright-tests/.env` já está preenchido.** Se as credenciais estão lá, use direto sem perguntar. Chaves típicas:

```
# Origem (org principal)
BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ALUNO_EMAIL, ALUNO_PASSWORD
ORG_ID, EVENTO_ID, ATIVIDADE_VIDEO_MARCA_DAGUA_ID, EVENTO_DESTINO_ID

# Destinatária (caso o teste envolva compartilhamento entre orgs — ex. T-1599)
BASE_URL_DESTINATARIA, ADMIN_DESTINATARIA_EMAIL, ADMIN_DESTINATARIA_PASSWORD
ORG_DESTINATARIA_ID, TOKEN_DESTINATARIA
```

Só **perguntar via `AskUserQuestion`** (um campo por pergunta) quando algum dos necessários estiver em branco. Grave a resposta no `.env` (preserva o resto). Nunca commitar `.env`.

Conta padrão deste ambiente: `dante.tavares@twygo.com` é admin+aluno na org de stage `https://twygo1772627238.stage.twygoead.com/`.

## Workflow para caso novo

1. **Transcrever** o caso para `~/playwright-tests/docs/casos/T-<numero>.md` — usar o **ID do TestLink (T-XXXX) como nome do arquivo**. O doc é **focado em passos** — NÃO repetir Objetivo, Pré-condições ou Metadados (esses ficam no docstring do arquivo pytest). Conteúdo obrigatório, nesta ordem:
   - Título no formato `# T-XXXX — <título do caso>`
   - Status geral (✅/❌/⚠️) + 1 linha de resumo no topo
   - Última execução (data + ambiente)
   - `---` divisor
   - Cada passo como `### Passo N — <ação>` com: Resultado esperado, Descrição expandida (notas detalhadas pra colar no campo Notas do TestLink), Status (✅/❌/⚠️ + observação concreta da execução)
   - Seção Evidências (paths de screenshots/trace)
   - Seção Automação (links pra teste pytest e scripts)
   - Observações técnicas (se houver) ficam por último
2. **Criar/editar Page Objects** em `~/playwright-tests/pages/<area>/` com locators baseados em rótulos PT-BR (preferir `get_by_label`, `get_by_role`, `get_by_text`). Marcar com `# TODO confirmar seletor` quando não for verificável sem rodar.
3. **Criar arquivo de teste** em `~/playwright-tests/tests/<area>/test_<slug>.py` usando o **template obrigatório** (ver `~/playwright-tests/CLAUDE.md`):
   - Docstring no topo = transcrição literal (objetivo, pré-condições, perfil, plataforma, ambiente) + referência para `docs/casos/T-XXXX.md`.
   - Cada passo manual = `# Passo N — ação` + `# Esperado: resultado` + ações/asserções.
   - Pré-condições atendidas por fixtures (`admin_logado`, `aluno_logado`, `base_url`).
   - Nenhum seletor solto no teste — tudo via Page Object.
4. **Markers** apropriados (`@pytest.mark.admin`, `@pytest.mark.<feature>`).
5. **Ao terminar a execução do caso (sucesso ou falha):**
   - Copiar screenshots/evidências de `test-results/<caso>/*.png` para `evidencias/T-XXXX/` usando `scripts/save_evidencias.py T-XXXX <pngs...>`. Esse diretório `evidencias/` é commitado no repo (diferente de `test-results/` que está no .gitignore).
   - Commit + push do diretório `evidencias/T-XXXX/` para o GitHub — assim as URLs `https://raw.githubusercontent.com/DantexgerBR/twygo-playwright-tests/main/evidencias/T-XXXX/<arquivo>.png` ficam acessíveis publicamente (úteis para colar em bug reports externos como Jam, Linear, Slack).
   - Atualizar `docs/casos/T-XXXX.md` com o status de cada passo. Pra evidências usar URLs `raw.githubusercontent.com` quando linkar individualmente dentro dos passos (NÃO usar paths locais como `test-results/...`). A seção `## Evidências` no fim do doc fica enxuta — UM único link pra pasta no GitHub: `https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-XXXX`. Sem listar PNG por PNG.
   - **Abrir o doc automaticamente** via `xdg-open ~/playwright-tests/docs/casos/T-XXXX.md` no fim do Bash, OU enviar via `SendUserFile` para o usuário visualizar imediatamente. **Não esperar o usuário pedir.**

## Workflow para falha de teste

Quando `pytest` reportar falha, responda no chat com **este formato exato**:

```
:: Incidente identificado ::
<resumo de 1 linha do que falhou>

    :: Passo a passo para reprodução ::
» Passo 1: <ação>
» Passo 2: <ação>
» ...
» Passo N: <passo que falhou — destacar>

    :: Comportamento esperado ::
<Resultado Esperado literal do passo que falhou>

    :: Informações ::
url: <BASE_URL>
login: <email usado no passo>
senha: <senha correspondente>
org_id: <ORG_ID ou -1>
<linha extra: erro do pytest, valor recebido vs esperado>

    :: Evidência(s) ::
<descrição>
Link da evidência: <test-results/<...>/trace.zip ou test-failed-1.png>
```

Os artefatos de evidência são gerados automaticamente pelo `pytest.ini` do projeto (`--tracing retain-on-failure`, `--screenshot only-on-failure`, `--video retain-on-failure`).

## Comandos

```bash
cd ~/playwright-tests
source .venv/bin/activate              # se já houver venv
pytest -v                              # todos os testes
pytest tests/<area>/ -v                # uma feature
pytest -k "<nome>" -v --headed         # filtrar por nome, modo visível
```

## Notas

- `~/playwright-tests/CLAUDE.md` tem as rules completas do projeto — leia-o sempre que abrir o repo.
- O template de teste é **inegociável** (docstring + comentários por passo + Page Objects). Quem ler o código tem que conseguir bater 1:1 com o caso manual.
- Use `python-dotenv` (já em `requirements.txt`) e `conftest.py` que já carrega o `.env`.

## Padrão: descoberta de UI desconhecida

Quando um caso novo mexe com tela ainda não mapeada (ex.: T-1599 — aba Compartilhar, modo externo, aceite na destinatária):

1. **Escreva `scripts/inspect_<area>.py` antes de criar o Page Object.** É iterativo — sucessivos scripts numerados (`inspect_compartilhar.py`, `..._2.py`, `..._3.py`...) cada um aprofundando um nível.
2. Padrão do script:
   - `LoginPage(page).login(BASE, EMAIL, SENHA)` (reusar PO, não refazer `page.fill` em `#user_email`/`#user_password`).
   - `page.goto(url, wait_until="domcontentloaded", timeout=20000)` + `page.wait_for_timeout(5-7s)` para Chakra hidratar.
   - Screenshot full-page de cada estado em `test-results/inspect_<area>/`.
   - `page.evaluate()` retornando dicts com `tag`, `text`, `id`, `href`, `cls`, `aria` de candidatos — não chutar seletores.
3. **Padrão obrigatório de resiliência:** wrappar cada `page.goto` em try/except (URLs admin frequentemente retornam 404/timeout). Não deixar uma URL ruim derrubar todo o discovery.
4. Após mapear, **converter os achados em Page Object** com locators preferindo `get_by_role`, `get_by_label`, `get_by_text`, IDs estáveis (`#shared-events-add-button`, `#user_email`).

## Padrões da UI Twygo (reutilizáveis)

- **Pós-login cai sempre em `/dashboard_students`.** Para entrar no Admin de uma org específica, navegar para `/o/{org_id}/events?tab=events&profile=admin`. O switch via UI é o botão `#btn-profile` (topo direito) → menu com `#admin-profile` e `#student-profile`. Quando o caso requer logar como admin numa org diferente da origem, use uma fixture dedicada como `admin_destinataria_logado` em `conftest.py` (padrão do T-1599) e SEMPRE faça o redirect para `?profile=admin` depois do login.
- **Chakra toast empilha 3 instâncias.** `expect(page.get_by_text("...").to_be_visible())` quebra com strict-mode. Sempre usar `.first`: `expect(page.get_by_text("Conteúdo compartilhado com sucesso").first).to_be_visible(timeout=12000)`.
- **`material-symbols-outlined` icons são `<span>`, NÃO clickable.** Quando um botão é só um ícone (ex.: pencil "edit" na linha de share), o `<span>` em si não tem handler — subir N níveis até um ancestral `BUTTON`/`A`/`onclick` setado. Padrão em JS evaluate:
  ```js
  let p = icon;
  for (let i = 0; i < 6 && p; i++) {
      if (p.tagName === 'BUTTON' || p.tagName === 'A' || p.onclick) break;
      p = p.parentElement;
  }
  (p || icon).click();
  ```
- **react-select com placeholder PT-BR** (ex.: dropdown "Ambientes" no `/shared_events/new`): a abertura é `combobox.click()` (espera ~2.5s pro Chakra renderizar opções), seguida de `combobox.fill("texto")` para filtrar, depois `page.evaluate` em `[role="option"], .chakra-react-select__option` para listar/escolher.
- **Click via `page.evaluate(() => document.querySelector('#x')?.click())` quando há overlay/chat-widget interceptando o click nativo do Playwright.** Padrão útil para botões de Chakra que abrem modal ou navegam.
- **Origem NÃO expõe deletar share por linha.** Em testes envolvendo compartilhamento, o backend bloqueia duplicidade com alert "Conteúdo já compartilhado com esse ambiente". Tornar o teste idempotente checando `existe_share_para(nome_org)` ANTES de tentar criar, e pulando se existir. Idem na destinatária — se `linha_share().situacao == "aceito"`, pular o aceite.
- **Modo Controlado (espelho) ≠ Cópia livre.** No espelho, a atividade na destinatária tem o MESMO `data-id` da origem (referência); na cópia, tem id novo (T-1598 → 9280224). **No espelho, `/e/{evento_destino}/contents/{atividade}/edit` retorna 403 JSON** (`{"status":"error","msg":"Você não tem permissão para realizar essa ação."}`) — destinatária não pode editar espelho. Validações de "config preservada" via form NÃO são possíveis no modo Controlado; usar comparação implícita (mesmo data-id = mesma config).
- **Token de ambiente externo** para shares cross-tenant fica em `/o/{org}/integrations` aba **Token** (ao lado de Chave de API e SSO/SAML). Pode estar **bloqueado por plano** ("Ops! Essa opção não está disponível no seu plano") — se sim, pedir ao usuário para liberar no stage antes de prosseguir; não tem workaround técnico.
- **Fluxo de aceitação na destinatária:** `/o/{org}/shared_events` aba **Recebidos** → clicar no span material-symbols `edit` da linha do share → navega para `/o/{org}/shared_events/{share_id}/accept_shared_content` → botões `Aceitar` (✓) e `Recusar` (✗). Toast pós-aceite: "Compartilhamento aceito com sucesso. Estamos copiando o conteúdo para o seu ambiente. Isso pode levar alguns minutos."
- **Listagem de cursos admin (`/o/{org}/events?tab=events`):** as linhas usam `<tr data-item-id="..." data-item-name="...">` — extrair o ID via atributo do `<tr>`, NÃO via `href` de `<a>` (não há link no `<a>`).
- **Listagem de atividades dentro de um curso (`/e/{evento}/contents`):** itens são `<li class="dd-item" data-id="...">`. Padrão é jQuery legacy + simplemodal para o copy de atividade.

## Armadilhas conhecidas (rever em próximas análises)

- **Marca d'água em desktop — NÃO confiar apenas em `childCount` do `<div z-index:99999>` filho do `.plyr`.** Esse seletor foi descrito como sendo o overlay HTML/CSS no T-1595/T-1596 v1, mas na execução do T-1597 (2026-05-20) ele retornou `childCount=0` em DESKTOP mesmo com a marca d'água VISÍVEL na screenshot (6 posições com `CPF :` + `E-MAIL: DANTE.TAVARES@TWYGO.COM`). E o `TreeWalker SHOW_TEXT` em `document` + shadow roots também não encontrou texto com "CPF/E-MAIL/DANTE" no DOM. Hipótese: o overlay passou a ser renderizado fora do DOM textual (canvas, `<img>` base64, SVG sem `<text>`, ou injeção pós-React em outro nó). **Antes de assertar a presença/ausência da marca d'água, abrir investigação dedicada para identificar o seletor real atual**, ou validar visualmente (comparação de pixel: screenshot do player completo × frame puro do `<video>` via `canvas.drawImage`). Os testes T-1595 e T-1596 podem precisar de revisão.
- O frame extraído via `canvas.drawImage(<video>)` continua sendo a fonte confiável pra confirmar que a marca d'água **não está queimada** no stream MP4: o pixel buffer do `<video>` reflete apenas o conteúdo servido pelo backend.
- **Caso esperando "Formulário/visualização" na destinatária em modo Controlado** (T-1599 passo 4): o caso manual pode estar desatualizado — a UI atual retorna 403 no `/edit`. Antes de marcar como bug, verificar se existe uma rota de "preview" admin que ainda não foi mapeada (testar `/e/{id}/contents/{id}` sem `/edit`, ou um "Visualizar" diferente). Se de fato não existir, registrar como sugestão de melhoria no doc do caso (não como bug "fatal", já que o modo Controlado garante propagação por design).
