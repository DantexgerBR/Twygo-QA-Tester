// agent-at-prompts.mjs — prompts (system+user) dos 2 motores headless de AT (codex-cli/claude-api).
// Adaptado de agent-at/.claude/skills/{analyze-test-plan,analyze-test}/SKILL.md: sem sintaxe de
// invocação de skill do Claude Code (é prosa, não "/comando --args") e sem recon de protótipo via
// MCP (nenhum dos 2 motores novos tem esse MCP — cai sempre no fallback SKIP+warning que a skill já
// documenta). O resto do conteúdo (convenções, schema do MD canônico, validação, xmind/xml) NÃO é
// duplicado aqui — o agente tem tools de leitura/bash e lê os .claude/skills/*.md originais (cwd é
// agent-at/), então uma única fonte de verdade continua valendo pro Claude Code interativo e pros
// 2 motores headless.

const INTRO = [
  'Você é o agente de Análise de Teste (AT) da Twygo, rodando headless (sem humano na sessão).',
  'cwd = agent-at/. Antes de agir, leia os arquivos de convenção abaixo (relativos ao cwd) e siga-os à risca — não resuma de memória, leia o conteúdo real:',
  '- .claude/skills/read-docs/SKILL.md',
  '- .claude/skills/twygo-qa-conventions/SKILL.md',
  'Recon de protótipo via MCP playwright NÃO está disponível neste motor. Se projects/<slug>/project.config.json tiver prototypeUrl/figmaPrototype preenchido, registre em texto um aviso ("recon de protótipo pulado — MCP indisponível neste motor") e continue sem ele. Nunca trave por causa disso — é o mesmo fallback gracioso que a skill original documenta pra MCP ausente.',
].join('\n');

export function buildPlanPrompt(project) {
  const system = INTRO;
  const user = [
    `Projeto: ${project}.`,
    '',
    'Faça a FASE 1 (proposta de estrutura) do fluxo de Análise de Teste — NÃO escreva casos de teste ainda:',
    `1. Confirme que projects/${project}/docs/ tem arquivos. Se estiver vazia, PARE e informe isso — não invente estrutura a partir do nada.`,
    `2. Leia e interprete todos os arquivos de projects/${project}/docs/ conforme .claude/skills/read-docs/SKILL.md, gravando projects/${project}/output/requisitos_extraidos.md com tudo consolidado.`,
    '3. Com base nos requisitos extraídos, proponha a estrutura de suítes: se houver planilha de quebra de atividades, filtre as do tipo "Execução de testes" (1 atividade = 1 suíte); senão, agrupe pela lógica da documentação; se houver só 1 atividade, crie 1 suíte única. Títulos descritivos, sem prefixos tipo "[Projeto] QA X.X -". Para cada suíte decida: executor primário (playwright/api/db/pentest), playbooks Twygo aplicáveis, org alvo (principal/secundario/trial-<projeto>), pré-condições (dados/flags/perfil).',
    `4. Grave projects/${project}/output/estrutura-proposta.md EXATAMENTE neste formato:`,
    '',
    '```markdown',
    '---',
    'aprovada: false',
    `project: ${project}`,
    'generated_at: <ISO timestamp>',
    'docs_lidos: [<arquivo1>, <arquivo2>, ...]',
    'docs_pulados: [<arquivo3 — motivo>, ...]',
    '---',
    '',
    '# Proposta de Estrutura — <Nome do Projeto>',
    '',
    '## Suíte: <Nome da suíte 1>',
    '- **Executor:** playwright',
    '- **Playbooks:** <lista ou "nenhum">',
    '- **Org:** principal',
    '- **Pré-condições:**',
    '  - <pré-condição em prosa>',
    '```',
    '',
    'O campo `aprovada` deve ficar SOZINHO na linha, exatamente `aprovada: false` (sem comentários ou texto extra) — um parser downstream depende de um match exato dessa linha pra aprovar a proposta depois. `docs_pulados` fica `[]` se nenhum doc foi pulado.',
    '5. Ao terminar, informe em texto (sem chamar mais nenhuma ferramenta depois): quantidade de suítes propostas + caminho do arquivo gravado. PARE aqui — a escrita de casos é uma etapa separada.',
  ].join('\n');
  return { system, user };
}

export function buildBuildPrompt(project) {
  const system = [
    INTRO,
    'Leia também estes arquivos antes de gerar os artefatos finais — é onde estão o schema e as regras exatas (não invente formato):',
    '- .claude/skills/generate-md-canonical/SKILL.md',
    '- .claude/skills/generate-xmind/SKILL.md',
    '- .claude/skills/generate-xml-testlink/SKILL.md',
    '- CONTRACT.md (schema do MD canônico, §6 executores/playbooks)',
  ].join('\n');
  const user = [
    `Projeto: ${project}.`,
    '',
    `1. Leia projects/${project}/output/estrutura-proposta.md — já foi aprovada pelo QA (frontmatter \`aprovada: true\`). Use essa estrutura de suítes TAL COMO ESTÁ, não gere outra.`,
    `2. Consulte projects/${project}/output/requisitos_extraidos.md pra textos literais e regras de negócio (se não existir, rode a leitura de projects/${project}/docs/ de novo conforme .claude/skills/read-docs/SKILL.md).`,
    '3. Para cada suíte, crie os casos de teste seguindo .claude/skills/twygo-qa-conventions/SKILL.md: NÃO se limite à coluna "descrição" — cubra caminho feliz E cenários de falha/validação/tentativas de forçar erro. Toda AÇÃO usa verbo canônico ("Clicar no botão \'X\'", "Preencher o campo \'X\' com \'Y\'"). Todo RESULTADO ESPERADO é assertável (texto literal entre aspas + elemento alvo).',
    `4. Gere projects/${project}/output/test-analysis.md seguindo .claude/skills/generate-md-canonical/SKILL.md e o schema do CONTRACT.md. Este é o artefato mais importante — xmind e xml são derivados dele.`,
    '5. Valide OBRIGATORIAMENTE antes de prosseguir (rode via bash):',
    '   ```bash',
    `   python scripts/md_canonical_parser.py projects/${project}/output/test-analysis.md`,
    `   python scripts/validate_md_canonical.py projects/${project}/output/test-analysis.md`,
    '   ```',
    '   Se o parser falhar (erro de schema) ou o validador reportar ERROS (não apenas warnings), corrija o MD e repita antes de continuar. Não prossiga com erros pendentes.',
    `6. Gere os derivados a partir do MD canônico (nunca hardcoded/manual): projects/${project}/output/Analise_Teste_<NomeLegivel>.xmind (.claude/skills/generate-xmind/SKILL.md) e projects/${project}/output/Analise_Teste_<NomeLegivel>.xml (.claude/skills/generate-xml-testlink/SKILL.md).`,
    '7. Validação cruzada: confirme que a contagem de casos de teste bate entre test-analysis.md (`## TC`) e o .xml (`<testcase `).',
    '8. Ao terminar, informe: caminhos dos 3 arquivos gerados, total de suítes e casos de teste, distribuição de casos por suíte.',
  ].join('\n');
  return { system, user };
}

export function buildPrompt(promptKey, project) {
  return promptKey === 'build' ? buildBuildPrompt(project) : buildPlanPrompt(project);
}
