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
# Entrada
# ============================================================================

def validate(md_path: str | Path) -> tuple[list[str], list[str]]:
    """Retorna (errors, warnings)."""
    data = parse_canonical_md(md_path)
    all_issues: list[Issue] = []
    for suite in data["suites"]:
        all_issues.extend(check_v1_restrictions(suite))
        all_issues.extend(check_antipatterns(suite))
        all_issues.extend(check_playbooks(suite))
    all_issues.extend(check_catalogs(data))
    all_issues.extend(check_schema_completeness(data))

    errors = [m for sev, m in all_issues if sev == "error"]
    warnings = [m for sev, m in all_issues if sev == "warning"]
    return errors, warnings


def main() -> None:
    parser = argparse.ArgumentParser(description="Valida MD canônico contra anti-patterns e gaps.")
    parser.add_argument("md_path", help="Caminho para test-analysis.md")
    parser.add_argument(
        "--strict", action="store_true",
        help="Warnings também bloqueiam (exit 1)",
    )
    args = parser.parse_args()

    try:
        errors, warnings = validate(args.md_path)
    except (FileNotFoundError, ValueError) as e:
        print(f"[FATAL] Parser falhou antes da validação: {e}", file=sys.stderr)
        sys.exit(1)

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
