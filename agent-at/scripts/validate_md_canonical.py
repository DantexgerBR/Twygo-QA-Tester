"""
Valida o test-analysis.md contra anti-patterns e gaps que causariam
intervenção manual ou fixme/skip durante execução pelo agent-playwright.

Erros (severity=error) BLOQUEIAM a entrega da AT.
Warnings (severity=warning) não bloqueiam mas são reportados.
Com --strict, warnings também bloqueiam.

Uso:
    python validate_md_canonical.py <path-to-md>
    python validate_md_canonical.py <path-to-md> --strict

Exit codes:
    0 — OK (ou apenas warnings sem --strict)
    1 — pelo menos 1 erro
"""

import argparse
import re
import sys
from pathlib import Path
from typing import Any

from md_canonical_parser import parse_canonical_md


# ============================================================================
# Tabelas canônicas (decisão 2026-05-19 — agent-at/.claude/skills/generate-md-canonical/SKILL.md §Tabelas-keyword)
# ============================================================================

# Keyword na prosa → playbook obrigatório.
# Cada regex roda contra a prosa concatenada de pré-condições + passos
# (action + expected) da suíte.
PLAYBOOK_KEYWORDS: dict[str, str] = {
    "flipper": r"feature flag|flipper",
    "super-admin": r"super.?admin|tabela de preços|contrato (vigente|ativo)|funcionalidade.*(habilitad|desabilitad)",
    "trial": r"\btrial\b|\bicp\b|excluir informações|sophia(tech)?",
    "filtro-drawer": r"drawer|filtrar|filtros?\b",
    "toast-chakra": r"toast|mensagem (de sucesso|de erro|exibida)",
    "switch-chakra": r"\bswitch\b|ativar.*toggle|desativar.*toggle",
    "beforeunload": r"cancelar.*(altera|edição)|sair.*(altera|wizard|edição)|fechar (modal|wizard|edição)",
    "perfil-switch": r"perfil (aluno|gestor|instrutor|colaborador|administrador)",
    "cleanup-dados": r"\b(criar|adicionar|cadastrar)\b|salvar.*novo|inserir.*novo",
    "ambientes-adicionais": r"ambiente adicional|tenant pareado|sufixo.*aditional",
}

# Keyword na prosa → catálogo obrigatório.
CATALOG_KEYWORDS: dict[str, str] = {
    "textos_literais": r"toast|mensagem (exibida|de sucesso|de erro)",
    "modais_relevantes": r"\bmodal\b|\bdiálogo\b|\bdialog\b",
    "endpoints": r"\bendpoint\b|\bPOST /|\bGET /|\bPATCH /|\bDELETE /",
}

# Anti-patterns: regex → (código, descrição). Aplicado em ações, resultados ou
# pré-condições conforme contexto.
ANTIPATTERNS_ACTION: list[tuple[str, str, str]] = [
    # A — Ação vaga: começa com "verificar/validar/conferir/testar" sem objeto literal entre aspas
    (
        r"^\s*(verificar|validar|conferir|testar)\b(?!.*\".*\")",
        "A",
        "Ação vaga sem objeto literal entre aspas",
    ),
    # C — Combinar 2 ações no mesmo passo
    (
        r"\b(clicar|preencher|selecionar|marcar|ativar|fazer upload).+\b e (clicar|preencher|selecionar|marcar|ativar|fazer upload)\b",
        "C",
        "Passo combina 2 ações ('X e Y')",
    ),
    # D — Referenciar passo anterior
    (
        r"(repetir.*passo|idem.*caso|conforme.*item|veja o passo|igual ao caso)",
        "D",
        "Referência a passo anterior",
    ),
]

ANTIPATTERNS_EXPECTED: list[tuple[str, str, str]] = [
    # B — Resultado sem objeto verificável.
    # Heurística: prosa vaga (frase com 1 dos templates abaixo) sem aspas
    # duplas (texto literal) nem palavras-objeto verificáveis. O check de
    # "tem objeto?" é feito post-match em check_antipatterns.
    (
        r"\b(sistema funciona|tudo certo|comportamento esperado|funciona corretamente|sem erros|tudo ok)\b",
        "B",
        "Resultado sem objeto verificável (prosa vaga)",
    ),
    # H — Nome de componente interno como asserção.
    # Padrão: prefixo "componente" + slug-de-implementação (snake/kebab-case)
    (
        r"componente ['\"]?[a-z][a-z0-9-]+[-_][a-z0-9-]+['\"]?",
        "H",
        "Nome de componente interno como asserção (não-assertável via UI)",
    ),
]


def _expected_has_verifiable_object(text: str) -> bool:
    """Heurística: o resultado tem objeto verificável se contém:
    - aspas duplas com texto literal (ex: Toast exibida: "Salvo com sucesso")
    - URL com barras (/o/X/path)
    - palavras-objeto explícitas (botão, link, modal, toast, tabela, etc.) + objeto
    """
    if re.search(r'"[^"]{2,}"', text):
        return True
    if re.search(r"/[a-z_]+/", text, re.IGNORECASE):
        return True
    # Frases tipo "Toast exibida...", "Modal X é exibido" SEM aspas são duvidosas;
    # consideramos OK se mencionam "exibid"+aspas em outro lugar OU texto literal.
    return False

ANTIPATTERNS_PRECONDITION: list[tuple[str, str, str]] = [
    # E — Pré-condição referenciando trabalho de dev
    (
        r"\bdev\s*\d+\.\d+\b|\bmigration\b|\.rb\b|\bendpoint.*implementad",
        "E",
        "Pré-condição referencia trabalho de dev (use o estado visível)",
    ),
    # F — Hardcode de credentials/orgIds
    (
        r"@(twygo|gmail)\.com|\borgId.*[0-9]{4,}",
        "F",
        "Hardcode de credenciais/orgIds reais (use chave simbólica)",
    ),
]


# ============================================================================
# Helpers
# ============================================================================

def _suite_prose(suite: dict[str, Any]) -> str:
    """Concatena toda a prosa da suíte (pré-condições + ações + resultados)."""
    fm = suite["frontmatter"]
    parts: list[str] = []
    pre = fm.get("preconditions") or []
    if isinstance(pre, str):
        parts.append(pre)
    elif isinstance(pre, list):
        parts.extend(str(p) for p in pre)
    for tc in suite["test_cases"]:
        parts.append(tc.get("objective", ""))
        for step in tc["steps"]:
            parts.append(step["action"])
            parts.append(step["expected"])
    return " ".join(parts).lower()


def _all_prose(data: dict[str, Any]) -> str:
    """Prosa de todas as suítes concatenada."""
    return " ".join(_suite_prose(s) for s in data["suites"])


# ============================================================================
# Validações
# ============================================================================

Issue = tuple[str, str]  # (severity, message)


def check_playbooks(suite: dict[str, Any]) -> list[Issue]:
    issues: list[Issue] = []
    fm = suite["frontmatter"]
    suite_name = fm["suite"]
    declared = set(fm.get("playbooks") or [])
    # Inclui também playbooks adicionais declarados em TCs
    for tc in suite["test_cases"]:
        for pb in tc.get("playbooks_adicionais") or []:
            declared.add(pb)
    prose = _suite_prose(suite)
    for playbook, pattern in PLAYBOOK_KEYWORDS.items():
        if re.search(pattern, prose, re.IGNORECASE):
            if playbook not in declared:
                issues.append((
                    "warning",
                    f"Suíte '{suite_name}': prosa menciona keyword sugerindo playbook '{playbook}' "
                    f"mas não declarado. Adicione: playbooks: [{playbook}]",
                ))
    return issues


def check_catalogs(data: dict[str, Any]) -> list[Issue]:
    issues: list[Issue] = []
    catalogs = data.get("catalogs") or {}
    prose = _all_prose(data)
    for catalog_key, pattern in CATALOG_KEYWORDS.items():
        if re.search(pattern, prose, re.IGNORECASE):
            content = (catalogs.get(catalog_key) or "").strip()
            if not content:
                pretty_name = {
                    "textos_literais": "## Textos literais",
                    "modais_relevantes": "## Modais relevantes",
                    "endpoints": "## Endpoints (referência)",
                }.get(catalog_key, catalog_key)
                issues.append((
                    "error",
                    f"Catálogo '{pretty_name}' obrigatório (prosa menciona keyword correspondente) "
                    f"mas está ausente/vazio. Preencha com conteúdo extraído de docs/.",
                ))
    return issues


def check_antipatterns(suite: dict[str, Any]) -> list[Issue]:
    issues: list[Issue] = []
    fm = suite["frontmatter"]
    suite_name = fm["suite"]

    # Pré-condições
    pre_list = fm.get("preconditions") or []
    if isinstance(pre_list, str):
        pre_list = [pre_list]
    for pre in pre_list:
        for pattern, code, desc in ANTIPATTERNS_PRECONDITION:
            if re.search(pattern, str(pre), re.IGNORECASE):
                issues.append((
                    "error",
                    f"Suíte '{suite_name}': anti-pattern {code} ({desc}). "
                    f"Pré-condição: '{pre}'",
                ))
        if re.search(r"\b(previamente|já cadastrado|existente)\b", str(pre), re.IGNORECASE):
            issues.append((
                "warning",
                f"Suíte '{suite_name}': pré-condição '{pre}' assume seed pré-existente — "
                f"generator pode marcar fixme se org não tiver o estado. Documente como criar.",
            ))

    # Passos
    for tc in suite["test_cases"]:
        tc_label = f"TC{tc['number']} ({tc['title']}) em '{suite_name}'"
        for idx, step in enumerate(tc["steps"], start=1):
            step_num = step.get("step_number", idx)
            for pattern, code, desc in ANTIPATTERNS_ACTION:
                if re.search(pattern, step["action"], re.IGNORECASE):
                    issues.append((
                        "error",
                        f"{tc_label} passo {step_num}: anti-pattern {code} ({desc}). "
                        f"Ação: '{step['action'][:80]}'",
                    ))
            for pattern, code, desc in ANTIPATTERNS_EXPECTED:
                if re.search(pattern, step["expected"], re.IGNORECASE):
                    # Refino do anti-pattern B: só é erro se NÃO houver objeto
                    # verificável no resultado. Frases vagas COM aspas/URL passam.
                    if code == "B" and _expected_has_verifiable_object(step["expected"]):
                        continue
                    issues.append((
                        "error",
                        f"{tc_label} passo {step_num}: anti-pattern {code} ({desc}). "
                        f"Resultado: '{step['expected'][:80]}'",
                    ))
    return issues


def check_v1_restrictions(suite: dict[str, Any]) -> list[Issue]:
    """As restrições v1 já são enforçadas pelo parser (raise ValueError).
    Esta função roda DEPOIS do parse — se chegou aqui, parser já validou.
    Mantida como sanity check defensivo."""
    issues: list[Issue] = []
    fm = suite["frontmatter"]
    if fm.get("executor") != "playwright":
        issues.append((
            "error",
            f"Suíte '{fm['suite']}': executor inválido em v1 (deveria ter sido bloqueado pelo parser)",
        ))
    for tc in suite["test_cases"]:
        if tc.get("type") == "mixed":
            issues.append((
                "error",
                f"TC '{tc['title']}': type='mixed' inválido em v1 (deveria ter sido bloqueado pelo parser)",
            ))
    return issues


def check_schema_completeness(data: dict[str, Any]) -> list[Issue]:
    """Sanity check de campos obrigatórios não enforçados pelo parser."""
    issues: list[Issue] = []
    fm = data["project_frontmatter"]
    if not fm.get("totals"):
        issues.append(("warning", "Frontmatter de projeto sem 'totals' (informativo)"))
    if not fm.get("source_docs"):
        issues.append(("warning", "Frontmatter de projeto sem 'source_docs' (rastreabilidade)"))
    return issues


# ============================================================================
# Validações específicas de contract_version 1.1 (placeholders)
# ============================================================================
# Cada função aqui é chamada APENAS quando contract_version >= 1.1.
# Implementadas progressivamente nas próximas fases do roadmap 1.1.
# Em 2026-05-22 (Fase 0), todas retornam lista vazia — placeholders.

def check_v11_rn_to_tc(data: dict[str, Any]) -> list[Issue]:
    """v1.1 §1.1 — cada RN listada em requisitos_extraidos.md (e referenciada
    em pré-condições/passos) precisa de pelo menos 1 TC referenciando via
    `**RNs cobertas**`.

    Heurística:
    1. Coleta todas as RNs declaradas em `tc['rns_cobertas']` (set A)
    2. Coleta todas as RNs mencionadas na prosa das suítes (set B), via
       regex `RN (\\d+(?:\\.\\d+)*)` no objetivo + passos
    3. RNs em B mas não em A → warning (potencialmente não cobertas)
    4. Suítes sem nenhum `rns_cobertas` declarado em qualquer TC → warning
       informativo (AT pode aproveitar para mapping explícito)
    """
    issues: list[Issue] = []
    declared_rns: set[str] = set()
    mentioned_rns: set[str] = set()
    suites_without_rns_declarados: list[str] = []

    rn_pattern = re.compile(r"\bRN\s*(\d+(?:\.\d+)*)\b", re.IGNORECASE)

    for suite in data["suites"]:
        fm = suite["frontmatter"]
        # Coleta menções na prosa
        prose_parts: list[str] = []
        for pre in (fm.get("preconditions") or []):
            prose_parts.append(str(pre))
        for tc in suite["test_cases"]:
            prose_parts.append(tc.get("objective", ""))
            for step in tc["steps"]:
                prose_parts.append(step["action"])
                prose_parts.append(step["expected"])
        prose = " ".join(prose_parts)
        for m in rn_pattern.finditer(prose):
            mentioned_rns.add(m.group(1))

        # Coleta RNs declaradas pelos TCs
        suite_has_declared = False
        for tc in suite["test_cases"]:
            for rn in tc.get("rns_cobertas", []):
                declared_rns.add(str(rn).strip())
                suite_has_declared = True
        if not suite_has_declared:
            suites_without_rns_declarados.append(fm["suite"])

    # 1. RNs mencionadas na prosa mas não declaradas — warning por RN
    gap = mentioned_rns - declared_rns
    for rn in sorted(gap, key=lambda x: tuple(int(p) for p in x.split("."))):
        issues.append((
            "warning",
            f"v1.1 §1.1: RN {rn} é mencionada na prosa mas nenhum TC declara "
            f"`**RNs cobertas**` incluindo-a. Adicione a RN ao campo do TC que "
            f"a cobre para rastreabilidade.",
        ))

    # 2. Suítes inteiras sem nenhum `rns_cobertas` — warning informativo único
    if suites_without_rns_declarados:
        nomes = ", ".join(f"'{n}'" for n in suites_without_rns_declarados[:5])
        suffix = f" (+{len(suites_without_rns_declarados) - 5} mais)" if len(suites_without_rns_declarados) > 5 else ""
        issues.append((
            "warning",
            f"v1.1 §1.1: {len(suites_without_rns_declarados)} suíte(s) sem nenhum "
            f"`**RNs cobertas**` declarado em qualquer TC: {nomes}{suffix}. "
            f"Sem mapping explícito, rastreabilidade RN→TC fica fraca.",
        ))

    return issues


# Mapping campo → categorias obrigatórias por tipo (skill cenarios-negativos-twygo)
_FIELD_TYPE_CATEGORIES: dict[str, set[str]] = {
    "input": {"A", "B", "C", "D"},
    "input texto": {"A", "B", "C", "D"},
    "input numérico": {"A", "B", "E"},
    "input numerico": {"A", "B", "E"},
    "input data": {"A", "E"},
    "textarea": {"A", "B", "C", "D"},
    "select": {"A"},
    "dropdown": {"A"},
    "switch": set(),
    "toggle": set(),
    "file": {"A", "F", "G", "H"},
    "upload": {"A", "F", "G", "H"},
}


def _extract_obrigatorios_do_catalogo(catalogs: dict[str, str]) -> list[dict[str, str]]:
    """Extrai campos obrigatórios da seção `## Campos e validações` (markdown
    table). Retorna lista de dicts com `name`, `type`, `required`."""
    raw = (catalogs or {}).get("campos_e_validacoes", "") or ""
    if not raw.strip():
        return []
    fields: list[dict[str, str]] = []
    lines = [ln.strip() for ln in raw.split("\n") if ln.strip().startswith("|")]
    if len(lines) < 2:
        return fields

    def _split(line: str) -> list[str]:
        return [p.strip() for p in line.strip("|").split("|")]

    headers = [h.lower() for h in _split(lines[0])]
    col_name = next((i for i, h in enumerate(headers) if "campo" in h or "nome" in h or "label" in h), 0)
    col_type = next((i for i, h in enumerate(headers) if "tipo" in h), -1)
    col_req = next((i for i, h in enumerate(headers) if "obrigatóri" in h or "obrigatori" in h or "required" in h), -1)

    for line in lines[1:]:
        if all(set(p) <= {"-", ":"} for p in _split(line) if p):
            continue
        cells = _split(line)
        if len(cells) <= max(col_name, col_type, col_req):
            continue
        name = cells[col_name].strip()
        if not name or name.startswith("-"):
            continue
        ftype = cells[col_type].lower().strip() if col_type >= 0 else "input"
        required_cell = cells[col_req].strip().lower() if col_req >= 0 else ""
        is_required = required_cell.startswith("sim") or required_cell == "yes" or required_cell == "true"
        fields.append({"name": name, "type": ftype, "required": "yes" if is_required else "no"})
    return fields


def check_v11_negative_coverage(suite: dict[str, Any], catalogs: dict[str, str]) -> list[Issue]:
    """v1.1 §1.3 — cobertura mínima de cenários negativos por campo (categorias
    A-H da skill cenarios-negativos-twygo).

    Heurística:
    1. Lê catálogo `## Campos e validações` (declarado no MD)
    2. Para cada campo obrigatório/upload, identifica categorias obrigatórias
       por tipo (A-H)
    3. Procura TCs da suíte com `**Validation matrix**` mencionando o campo
       e cobrindo as categorias
    4. Reporta warnings para campos cujas categorias não são cobertas
    """
    issues: list[Issue] = []
    fm = suite["frontmatter"]
    suite_name = fm["suite"]

    fields = _extract_obrigatorios_do_catalogo(catalogs)
    if not fields:
        return issues  # sem catálogo, sem o que validar

    # Coleta TCs com validation_matrix nesta suíte
    suite_matrices: list[dict[str, Any]] = []
    for tc in suite["test_cases"]:
        if tc.get("validation_matrix"):
            suite_matrices.append({
                "title": tc["title"],
                "rows": tc["validation_matrix"],
            })

    for field in fields:
        # Heurística de tipo (lowercased)
        ftype = field["type"]
        required_categories: set[str] = set()
        for prefix, cats in _FIELD_TYPE_CATEGORIES.items():
            if prefix in ftype:
                required_categories |= cats
                break
        if not required_categories:
            continue  # tipo não mapeado (switch, toggle, etc.)

        # Procura matriz mencionando esse campo
        matching_matrix_rows: list[dict[str, str]] = []
        for m in suite_matrices:
            # Heurística: título do TC menciona o nome do campo
            if field["name"].lower() in m["title"].lower():
                matching_matrix_rows.extend(m["rows"])

        if not matching_matrix_rows:
            issues.append((
                "warning",
                f"v1.1 §1.3: Suíte '{suite_name}' tem campo '{field['name']}' (tipo "
                f"'{ftype}') mas nenhum TC com `**Validation matrix**` cobre. "
                f"Categorias obrigatórias por tipo: {sorted(required_categories)}.",
            ))
            continue

        covered = {row.get("categoria", "").strip().upper() for row in matching_matrix_rows}
        missing = required_categories - covered
        if missing:
            issues.append((
                "warning",
                f"v1.1 §1.3: Campo '{field['name']}' (suíte '{suite_name}') "
                f"tem matriz mas não cobre categorias obrigatórias: "
                f"{sorted(missing)}. Categorias cobertas: {sorted(covered)}.",
            ))

    return issues


def check_v11_combinatorial_filters(suite: dict[str, Any]) -> list[Issue]:
    """v1.1 §2.2 — suítes com playbook 'filtro-drawer' precisam de pelo menos
    1 TC combinatório (2+ filtros aplicados + busca textual).

    Heurística: TC combinatório é detectado quando passos do TC mencionam
    múltiplos filtros (regex `filtro` ou `aplicar.*filtro`) E também
    busca/pesquisa textual.
    """
    issues: list[Issue] = []
    fm = suite["frontmatter"]
    suite_name = fm["suite"]
    playbooks = set(fm.get("playbooks") or [])
    if "filtro-drawer" not in playbooks:
        return issues  # suite não usa filtro-drawer; sem o que validar

    # Procura TC combinatório
    combinatorial_pattern_filter = re.compile(r"\bfiltrar?\b|\baplicar.*filtro\b", re.IGNORECASE)
    combinatorial_pattern_busca = re.compile(r"\bbuscar?\b|\bbusca\b|\bpesquisar\b", re.IGNORECASE)

    found_combinatorial = False
    for tc in suite["test_cases"]:
        prose_parts = [tc.get("objective", "")]
        for step in tc["steps"]:
            prose_parts.append(step["action"])
        prose = " ".join(prose_parts)
        n_filters = len(combinatorial_pattern_filter.findall(prose))
        has_search = bool(combinatorial_pattern_busca.search(prose))
        if n_filters >= 2 and has_search:
            found_combinatorial = True
            break

    if not found_combinatorial:
        issues.append((
            "warning",
            f"v1.1 §2.2: Suíte '{suite_name}' tem playbook 'filtro-drawer' mas "
            f"nenhum TC combinatório (≥2 filtros + busca textual). Adicione "
            f"pelo menos 1 TC que combine múltiplos filtros simultaneamente.",
        ))

    return issues


# ============================================================================
# Entrada
# ============================================================================

def validate(md_path: str | Path) -> tuple[list[str], list[str], str]:
    """Retorna (errors, warnings, contract_version_aplicado).

    O conjunto de regras é selecionado pelo `contract_version` declarado no
    frontmatter do MD:
      - 1.0: regras originais (anti-patterns A-H + playbooks + catálogos +
             restrições v1 + schema)
      - 1.1: tudo de 1.0 + verificações novas (RN→TC, negativos amplos,
             combinatórias) — em Fase 0 (2026-05-22) ainda são placeholders.

    Ver CONTRACT.md §15 para detalhes.
    """
    data = parse_canonical_md(md_path)
    contract_version = data.get("contract_version", "1.0")

    all_issues: list[Issue] = []

    # === Regras comuns a 1.0 e 1.1 ===
    for suite in data["suites"]:
        all_issues.extend(check_v1_restrictions(suite))
        all_issues.extend(check_antipatterns(suite))
        all_issues.extend(check_playbooks(suite))
    all_issues.extend(check_catalogs(data))
    all_issues.extend(check_schema_completeness(data))

    # === Regras adicionais de 1.1 ===
    if contract_version == "1.1":
        all_issues.extend(check_v11_rn_to_tc(data))
        catalogs = data.get("catalogs") or {}
        for suite in data["suites"]:
            all_issues.extend(check_v11_negative_coverage(suite, catalogs))
            all_issues.extend(check_v11_combinatorial_filters(suite))

    errors = [m for sev, m in all_issues if sev == "error"]
    warnings = [m for sev, m in all_issues if sev == "warning"]
    return errors, warnings, contract_version


def main() -> None:
    parser = argparse.ArgumentParser(description="Valida MD canônico contra anti-patterns e gaps.")
    parser.add_argument("md_path", help="Caminho para test-analysis.md")
    parser.add_argument(
        "--strict", action="store_true",
        help="Warnings também bloqueiam (exit 1)",
    )
    args = parser.parse_args()

    try:
        errors, warnings, contract_version = validate(args.md_path)
    except (FileNotFoundError, ValueError) as e:
        print(f"[FATAL] Parser falhou antes da validação: {e}", file=sys.stderr)
        sys.exit(1)

    print(f"[INFO] contract_version aplicada: {contract_version}")

    if errors:
        print(f"\n=== {len(errors)} ERRO(S) — bloqueiam entrega da AT ===")
        for e in errors:
            print(f"  [ERROR] {e}")

    if warnings:
        print(f"\n=== {len(warnings)} WARNING(S) — revisar antes de entregar ===")
        for w in warnings:
            print(f"  [WARN]  {w}")

    if not errors and not warnings:
        print("OK MD canonico valido - sem anti-patterns nem gaps detectados.")
        sys.exit(0)

    if errors:
        print(f"\n[FAIL] {len(errors)} erro(s). Corrija antes de entregar a AT.")
        sys.exit(1)

    if warnings and args.strict:
        print(f"\n[STRICT] {len(warnings)} warning(s) — modo strict bloqueia.")
        sys.exit(1)

    print(f"\n[PASS] Apenas warnings. Revise mas pode prosseguir.")
    sys.exit(0)


if __name__ == "__main__":
    main()
