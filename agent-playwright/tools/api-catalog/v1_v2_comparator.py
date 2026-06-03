from __future__ import annotations

import json
import unicodedata
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import requests


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config" / "test-config.json"


def load_config() -> dict:
    if not CONFIG_PATH.exists():
        raise FileNotFoundError("Crie automation/config/test-config.json antes de executar o comparador.")
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def extract_v2_users_base_from_collection(base_url: str, collection_path: str | None) -> str:
    default_base = f"{base_url}/api/v2/users"
    if not collection_path:
        return default_base

    target = (ROOT / collection_path).resolve()
    if not target.exists():
        return default_base

    try:
        data = json.loads(target.read_text(encoding="utf-8"))
        items = data.get("item", [])
        for section in items:
            if (section.get("name") or "").strip().lower() != "usuários" and (section.get("name") or "").strip().lower() != "usuarios":
                continue
            for it in section.get("item", []):
                req = it.get("request", {})
                url = req.get("url", {})
                raw = ""
                if isinstance(url, dict):
                    raw = url.get("raw", "")
                elif isinstance(url, str):
                    raw = url
                raw = raw.replace("{{baseUrl}}", base_url).replace("{{base_url}}", base_url)
                if "/api/v2/users" in raw:
                    return raw.split("?")[0].replace("/:userId", "").replace("/:user_id", "")
    except Exception:
        return default_base

    return default_base


def parse_json_or_none(text: str) -> Any:
    try:
        return json.loads(text) if text else None
    except json.JSONDecodeError:
        return None


def request_with_capture(
    method: str, url: str, headers: dict | None = None, body: dict | None = None
) -> dict:
    started = datetime.now(UTC).isoformat()
    resp = requests.request(method=method, url=url, headers=headers or {}, json=body, timeout=30)
    ended = datetime.now(UTC).isoformat()
    return {
        "request": {"method": method, "url": url, "headers": headers or {}, "body": body},
        "response": {
            "status": resp.status_code,
            "headers": dict(resp.headers),
            "body_raw": resp.text,
            "body_json": parse_json_or_none(resp.text),
        },
        "timestamps": {"started_at": started, "ended_at": ended},
    }


def normalize_user_payload(payload: dict | None) -> dict:
    payload = payload or {}
    return {
        "id": payload.get("id") or payload.get("user_id"),
        "first_name": payload.get("first_name"),
        "last_name": payload.get("last_name"),
        "name": payload.get("name"),
        "email": payload.get("email"),
        "enterprise": payload.get("enterprise"),
        "role": payload.get("role"),
        "department": payload.get("department"),
        "is_manager": payload.get("is_manager"),
    }


def normalize_response(capture: dict) -> dict:
    body = capture.get("response", {}).get("body_json")
    message = None
    user = None

    if isinstance(body, dict):
        message = body.get("message")
        if isinstance(body.get("student"), dict):
            user = normalize_user_payload(body["student"])
        elif isinstance(body.get("user"), dict):
            user = normalize_user_payload(body["user"])
        elif isinstance(body.get("data"), dict):
            data = body["data"]
            if isinstance(data.get("student"), dict):
                user = normalize_user_payload(data["student"])
            elif isinstance(data.get("user"), dict):
                user = normalize_user_payload(data["user"])
    return {
        "status": capture["response"]["status"],
        "message": message,
        "user": user,
    }


def compare_normalized(v1: dict, v2: dict) -> dict:
    status_eq = v1.get("status") == v2.get("status")
    msg_eq = v1.get("message") == v2.get("message")
    user_eq = (v1.get("user") or {}) == (v2.get("user") or {})
    if status_eq and msg_eq and user_eq:
        divergence_class = "equivalent"
    else:
        diffs: list[str] = []
        if not status_eq:
            diffs.append("status")
        if not msg_eq:
            diffs.append("message")
        if not user_eq:
            diffs.append("user")
        divergence_class = "mixed" if len(diffs) > 1 else f"{diffs[0]}_diff"
    return {
        "status_equal": status_eq,
        "message_equal": msg_eq,
        "user_fields_equal": user_eq,
        "divergence_class": divergence_class,
    }


def _fold(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c)).lower()


def _suite_matches(user_f: str, suite_name: str, exact: bool) -> bool:
    u = user_f.strip()
    s = suite_name.strip()
    if exact:
        return _fold(u) == _fold(s)
    a, b = _fold(u), _fold(s)
    return a in b or b in a


def _comparison_matches_filter(comp: dict, filt: str | None, exact: bool) -> bool:
    if not filt or not str(filt).strip():
        return True
    suites = comp.get("testlink_suites") or []
    if not suites:
        return False
    return any(_suite_matches(filt, sn, exact) for sn in suites)


def extract_first_student_id(list_capture: dict) -> int | None:
    body = list_capture.get("response", {}).get("body_json")
    if not isinstance(body, dict):
        return None
    data = body.get("data")
    if not isinstance(data, dict):
        return None
    students = data.get("students")
    if isinstance(students, list) and students:
        first = students[0]
        if isinstance(first, dict):
            return first.get("id")
    return None


def main() -> None:
    import os

    cfg = load_config()
    base_url = cfg["base_url"].rstrip("/")
    org_id = cfg["org_id"]
    compare_cfg = cfg.get("comparison", {})
    v1_auth_cfg = compare_cfg.get("v1_auth", {})
    out_rel = compare_cfg.get("output_json", "../reports/v1-v2-comparison.json")
    if os.environ.get("AUTOMATION_REPORT_DIR"):
        output_path = Path(os.environ["AUTOMATION_REPORT_DIR"]) / "comparison.json"
    else:
        output_path = (ROOT / out_rel).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # V1 token (oauth password)
    v1_token_capture = request_with_capture(
        "POST",
        f"{base_url}/oauth/token",
        headers={"Content-Type": "application/json"},
        body={
            "grant_type": "password",
            "username": v1_auth_cfg.get("username", ""),
            "password": v1_auth_cfg.get("password", ""),
        },
    )
    v1_token = (v1_token_capture.get("response", {}).get("body_json") or {}).get("access_token", "")
    v2_token = cfg.get("auth", {}).get("token", "")

    v1_headers = {"Authorization": f"Bearer {v1_token}", "Content-Type": "application/json"}
    v2_headers = {"Authorization": f"Bearer {v2_token}", "Content-Type": "application/json"}

    v1_base = f"{base_url}/api/v1/o/{org_id}/students"
    v2_base = extract_v2_users_base_from_collection(base_url, compare_cfg.get("v2_collection_path"))

    common_invalid_create_body = {"first_name": "TesteComparativo"}
    common_valid_create_body = {
        "first_name": "Comparativo",
        "last_name": "Criacao",
        "email": f"cmp.v2.{datetime.now(UTC).strftime('%Y%m%d%H%M%S')}@example.com",
        "enterprise": "Empresa Comparativo",
        "cpf": "12345678909",
        "rg": "1234567",
        "role": "QA",
        "department": "Qualidade",
        "business_line": "Tecnologia",
        "number_of_employees": "10",
        "country": "Brasil",
        "state": "SC",
        "city": "Joinville",
        "district": "Centro",
        "address": "Rua A",
        "address_number": "10",
        "zip_code": "89200000",
        "address2": "Sala 1",
        "cell_phone": "47999990000",
        "phone1": "4733330000",
        "phone2": "4733330001",
    }

    comparisons: list[dict] = []

    # Scenario 1: invalid create body (required missing)
    v1_invalid_create = request_with_capture("POST", v1_base, headers=v1_headers, body=common_invalid_create_body)
    v2_invalid_create = request_with_capture("POST", v2_base, headers=v2_headers, body=common_invalid_create_body)
    comparisons.append(
        {
            "scenario": "create_invalid_missing_required",
            "intent": "Mesmo body invalido em V1 e V2 para comparar retorno de validacao.",
            "testlink_suites": ["Criação de usuário (API V2)"],
            "v1": v1_invalid_create,
            "v2": v2_invalid_create,
            "normalized_diff": compare_normalized(normalize_response(v1_invalid_create), normalize_response(v2_invalid_create)),
        }
    )

    # Scenario 1.1: invalid email format
    invalid_email = dict(common_valid_create_body)
    invalid_email["email"] = "not-email"
    v1_invalid_email = request_with_capture("POST", v1_base, headers=v1_headers, body=invalid_email)
    v2_invalid_email = request_with_capture("POST", v2_base, headers=v2_headers, body=invalid_email)
    comparisons.append(
        {
            "scenario": "create_invalid_email_format",
            "intent": "Comparar tratamento de formato de e-mail inválido.",
            "testlink_suites": ["Criação de usuário (API V2)"],
            "v1": v1_invalid_email,
            "v2": v2_invalid_email,
            "normalized_diff": compare_normalized(normalize_response(v1_invalid_email), normalize_response(v2_invalid_email)),
        }
    )

    # Scenario 1.2: duplicate email
    v2_create_once = request_with_capture("POST", v2_base, headers=v2_headers, body=common_valid_create_body)
    v1_dup_email = request_with_capture("POST", v1_base, headers=v1_headers, body=common_valid_create_body)
    v2_dup_email = request_with_capture("POST", v2_base, headers=v2_headers, body=common_valid_create_body)
    comparisons.append(
        {
            "scenario": "create_duplicate_email",
            "intent": "Comparar comportamento ao tentar criar e-mail já existente.",
            "testlink_suites": ["Criação de usuário (API V2)"],
            "v1": v1_dup_email,
            "v2": v2_dup_email,
            "normalized_diff": compare_normalized(normalize_response(v1_dup_email), normalize_response(v2_dup_email)),
        }
    )

    # Scenario 1.3: invalid token
    bad_headers = {"Authorization": "Bearer __invalid__", "Content-Type": "application/json"}
    v1_bad_token = request_with_capture("POST", v1_base, headers=bad_headers, body=common_invalid_create_body)
    v2_bad_token = request_with_capture("POST", v2_base, headers=bad_headers, body=common_invalid_create_body)
    comparisons.append(
        {
            "scenario": "create_invalid_token",
            "intent": "Comparar autenticação inválida em criação.",
            "testlink_suites": ["Criação de usuário (API V2)"],
            "v1": v1_bad_token,
            "v2": v2_bad_token,
            "normalized_diff": compare_normalized(normalize_response(v1_bad_token), normalize_response(v2_bad_token)),
        }
    )

    # Scenario 1.4: invalid CPF
    invalid_cpf = dict(common_valid_create_body)
    invalid_cpf["email"] = f"cmp.cpf.{datetime.now(UTC).strftime('%Y%m%d%H%M%S')}@example.com"
    invalid_cpf["cpf"] = "00000000000"
    v1_invalid_cpf = request_with_capture("POST", v1_base, headers=v1_headers, body=invalid_cpf)
    v2_invalid_cpf = request_with_capture("POST", v2_base, headers=v2_headers, body=invalid_cpf)
    comparisons.append(
        {
            "scenario": "create_invalid_cpf",
            "intent": "Comparar validação de CPF inválido na criação.",
            "testlink_suites": ["Criação de usuário (API V2)"],
            "v1": v1_invalid_cpf,
            "v2": v2_invalid_cpf,
            "normalized_diff": compare_normalized(normalize_response(v1_invalid_cpf), normalize_response(v2_invalid_cpf)),
        }
    )

    # Scenario 1.5: special characters/accents
    special_chars = dict(common_valid_create_body)
    special_chars["first_name"] = "João"
    special_chars["last_name"] = "Ç-Áéíóú"
    special_chars["email"] = f"cmp.special.{datetime.now(UTC).strftime('%Y%m%d%H%M%S')}@example.com"
    v1_special = request_with_capture("POST", v1_base, headers=v1_headers, body=special_chars)
    v2_special = request_with_capture("POST", v2_base, headers=v2_headers, body=special_chars)
    comparisons.append(
        {
            "scenario": "create_special_characters",
            "intent": "Comparar tratamento de caracteres especiais e acentuação.",
            "testlink_suites": ["Criação de usuário (API V2)"],
            "v1": v1_special,
            "v2": v2_special,
            "normalized_diff": compare_normalized(normalize_response(v1_special), normalize_response(v2_special)),
        }
    )

    # cleanup user created for duplicate scenario (best-effort)
    created_uid = (
        ((v2_create_once.get("response") or {}).get("body_json") or {}).get("data", {}).get("user", {}).get("id")
    )
    if created_uid:
        request_with_capture("DELETE", f"{v2_base}/{created_uid}", headers=v2_headers, body=None)
    special_uid = (
        ((v2_special.get("response") or {}).get("body_json") or {}).get("data", {}).get("user", {}).get("id")
    )
    if special_uid:
        request_with_capture("DELETE", f"{v2_base}/{special_uid}", headers=v2_headers, body=None)

    # Scenario 2: update non-existing id
    update_body = {"role": "Comparativo V1 V2"}
    v1_invalid_update = request_with_capture("PUT", f"{v1_base}/999999999", headers=v1_headers, body=update_body)
    v2_invalid_update = request_with_capture(
        "PATCH", f"{v2_base}/999999999", headers=v2_headers, body=update_body
    )
    comparisons.append(
        {
            "scenario": "update_non_existing_id",
            "intent": "Mesmo body e ID inexistente em V1 e V2.",
            "testlink_suites": ["Atualização de usuário (API V2)"],
            "v1": v1_invalid_update,
            "v2": v2_invalid_update,
            "normalized_diff": compare_normalized(normalize_response(v1_invalid_update), normalize_response(v2_invalid_update)),
        }
    )

    # Scenario 3: update existing id from list
    v1_list = request_with_capture("GET", f"{v1_base}?page=1&per_page=25", headers=v1_headers, body=None)
    student_id = extract_first_student_id(v1_list)
    if student_id:
        v1_existing_update = request_with_capture("PUT", f"{v1_base}/{student_id}", headers=v1_headers, body=update_body)
        v2_existing_update = request_with_capture(
            "PATCH", f"{v2_base}/{student_id}", headers=v2_headers, body=update_body
        )
        comparisons.append(
            {
                "scenario": "update_existing_id_same_body",
                "intent": "Mesma operacao e body em ID real para comparar comportamento funcional.",
                "testlink_suites": ["Atualização de usuário (API V2)"],
                "target_student_id": student_id,
                "v1": v1_existing_update,
                "v2": v2_existing_update,
                "normalized_diff": compare_normalized(normalize_response(v1_existing_update), normalize_response(v2_existing_update)),
            }
        )

    # --- GET usuário (suíte TestLink: Buscar por ID / external) ---
    v1_get_nf = request_with_capture("GET", f"{v1_base}/999999998", headers=v1_headers, body=None)
    v2_get_nf = request_with_capture("GET", f"{v2_base}/999999998", headers=v2_headers, body=None)
    comparisons.append(
        {
            "scenario": "fetch_user_not_found_by_id",
            "intent": "Comparar resposta ao buscar usuário com ID inexistente (GET V1 vs GET V2).",
            "testlink_suites": ["Buscar usuário por ID e External ID (API V2)"],
            "v1": v1_get_nf,
            "v2": v2_get_nf,
            "normalized_diff": compare_normalized(normalize_response(v1_get_nf), normalize_response(v2_get_nf)),
        }
    )
    bad_get_headers = {
        "Authorization": "Bearer __invalid__",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    v1_get_bad = request_with_capture("GET", f"{v1_base}/999999998", headers=bad_get_headers, body=None)
    v2_get_bad = request_with_capture("GET", f"{v2_base}/999999998", headers=bad_get_headers, body=None)
    comparisons.append(
        {
            "scenario": "fetch_user_invalid_token",
            "intent": "Comparar autenticação inválida na busca por ID (GET V1 vs GET V2).",
            "testlink_suites": ["Buscar usuário por ID e External ID (API V2)"],
            "v1": v1_get_bad,
            "v2": v2_get_bad,
            "normalized_diff": compare_normalized(normalize_response(v1_get_bad), normalize_response(v2_get_bad)),
        }
    )
    v1_get_mal = request_with_capture("GET", f"{v1_base}/abc", headers=v1_headers, body=None)
    v2_get_mal = request_with_capture("GET", f"{v2_base}/abc", headers=v2_headers, body=None)
    comparisons.append(
        {
            "scenario": "fetch_user_malformed_id",
            "intent": "Comparar resposta ao usar identificador não numérico na URL de busca.",
            "testlink_suites": ["Buscar usuário por ID e External ID (API V2)"],
            "v1": v1_get_mal,
            "v2": v2_get_mal,
            "normalized_diff": compare_normalized(normalize_response(v1_get_mal), normalize_response(v2_get_mal)),
        }
    )

    suite_listagem = "Listagem de usuários e filtro por CPF (API V2)"
    v1_list_page = request_with_capture(
        "GET", f"{v1_base}?page=1&per_page=10", headers=v1_headers, body=None
    )
    v2_list_page = request_with_capture(
        "GET", f"{v2_base}?page=1&per_page=10", headers=v2_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "list_users_paginated_default",
            "intent": "Comparar listagem paginada padrão (GET V1 students vs GET V2 users).",
            "testlink_suites": [suite_listagem],
            "v1": v1_list_page,
            "v2": v2_list_page,
            "normalized_diff": compare_normalized(
                normalize_response(v1_list_page), normalize_response(v2_list_page)
            ),
        }
    )
    v1_list_cpf0 = request_with_capture(
        "GET", f"{v1_base}?cpf=00000000000", headers=v1_headers, body=None
    )
    v2_list_cpf0 = request_with_capture(
        "GET", f"{v2_base}?cpf=00000000000", headers=v2_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "list_users_cpf_not_found",
            "intent": "Comparar filtro por CPF inexistente na listagem (V1 vs V2).",
            "testlink_suites": [suite_listagem],
            "v1": v1_list_cpf0,
            "v2": v2_list_cpf0,
            "normalized_diff": compare_normalized(
                normalize_response(v1_list_cpf0), normalize_response(v2_list_cpf0)
            ),
        }
    )
    v1_list_bad = request_with_capture(
        "GET", f"{v1_base}?page=1&per_page=10", headers=bad_get_headers, body=None
    )
    v2_list_bad = request_with_capture(
        "GET", f"{v2_base}?page=1&per_page=10", headers=bad_get_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "list_users_invalid_token",
            "intent": "Comparar token inválido na listagem (GET V1 vs GET V2).",
            "testlink_suites": [suite_listagem],
            "v1": v1_list_bad,
            "v2": v2_list_bad,
            "normalized_diff": compare_normalized(
                normalize_response(v1_list_bad), normalize_response(v2_list_bad)
            ),
        }
    )

    suite_atualizacao = "Atualização de usuário (API V2)"
    v1_update_bad_tok = request_with_capture(
        "PUT", f"{v1_base}/999999999", headers=bad_get_headers, body=update_body
    )
    v2_update_bad_tok = request_with_capture(
        "PATCH", f"{v2_base}/999999999", headers=bad_get_headers, body=update_body
    )
    comparisons.append(
        {
            "scenario": "update_invalid_token",
            "intent": "Comparar token inválido na atualização (PUT V1 vs PATCH V2).",
            "testlink_suites": [suite_atualizacao],
            "v1": v1_update_bad_tok,
            "v2": v2_update_bad_tok,
            "normalized_diff": compare_normalized(
                normalize_response(v1_update_bad_tok), normalize_response(v2_update_bad_tok)
            ),
        }
    )
    if student_id:
        bad_cpf_update = {"cpf": "12345678900"}
        v1_update_bad_cpf = request_with_capture(
            "PUT", f"{v1_base}/{student_id}", headers=v1_headers, body=bad_cpf_update
        )
        v2_update_bad_cpf = request_with_capture(
            "PATCH", f"{v2_base}/{student_id}", headers=v2_headers, body=bad_cpf_update
        )
        comparisons.append(
            {
                "scenario": "update_invalid_cpf",
                "intent": "Comparar validação de CPF inválido na atualização (corpo mínimo com CPF inválido).",
                "testlink_suites": [suite_atualizacao],
                "target_student_id": student_id,
                "v1": v1_update_bad_cpf,
                "v2": v2_update_bad_cpf,
                "normalized_diff": compare_normalized(
                    normalize_response(v1_update_bad_cpf), normalize_response(v2_update_bad_cpf)
                ),
            }
        )

    suite_inativar = "Inativar e Ativar usuário (API V2)"
    fid_inout = 999991111
    v1_inact_nf = request_with_capture(
        "DELETE", f"{v1_base}/{fid_inout}/inactivate", headers=v1_headers, body=None
    )
    v2_inact_nf = request_with_capture(
        "DELETE", f"{v2_base}/{fid_inout}/inactivate", headers=v2_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "inactivate_non_existing_id",
            "intent": "Comparar inativação com ID inexistente (DELETE V1 vs DELETE V2).",
            "testlink_suites": [suite_inativar],
            "v1": v1_inact_nf,
            "v2": v2_inact_nf,
            "normalized_diff": compare_normalized(
                normalize_response(v1_inact_nf), normalize_response(v2_inact_nf)
            ),
        }
    )
    v1_rest_nf = request_with_capture(
        "POST", f"{v1_base}/{fid_inout}/restore", headers=v1_headers, body=None
    )
    v2_rest_nf = request_with_capture(
        "POST", f"{v2_base}/{fid_inout}/restore", headers=v2_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "restore_non_existing_id",
            "intent": "Comparar restauração com ID inexistente (POST V1 vs POST V2).",
            "testlink_suites": [suite_inativar],
            "v1": v1_rest_nf,
            "v2": v2_rest_nf,
            "normalized_diff": compare_normalized(
                normalize_response(v1_rest_nf), normalize_response(v2_rest_nf)
            ),
        }
    )
    v1_inact_bad = request_with_capture(
        "DELETE", f"{v1_base}/{fid_inout}/inactivate", headers=bad_get_headers, body=None
    )
    v2_inact_bad = request_with_capture(
        "DELETE", f"{v2_base}/{fid_inout}/inactivate", headers=bad_get_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "inactivate_invalid_token",
            "intent": "Comparar token inválido na inativação (DELETE V1 vs DELETE V2).",
            "testlink_suites": [suite_inativar],
            "v1": v1_inact_bad,
            "v2": v2_inact_bad,
            "normalized_diff": compare_normalized(
                normalize_response(v1_inact_bad), normalize_response(v2_inact_bad)
            ),
        }
    )
    v1_rest_bad = request_with_capture(
        "POST", f"{v1_base}/{fid_inout}/restore", headers=bad_get_headers, body=None
    )
    v2_rest_bad = request_with_capture(
        "POST", f"{v2_base}/{fid_inout}/restore", headers=bad_get_headers, body=None
    )
    comparisons.append(
        {
            "scenario": "restore_invalid_token",
            "intent": "Comparar token inválido na restauração (POST V1 vs POST V2).",
            "testlink_suites": [suite_inativar],
            "v1": v1_rest_bad,
            "v2": v2_rest_bad,
            "normalized_diff": compare_normalized(
                normalize_response(v1_rest_bad), normalize_response(v2_rest_bad)
            ),
        }
    )

    suite_f = os.environ.get("AUTOMATION_SUITE_FILTER", "").strip()
    suite_exact = os.environ.get("AUTOMATION_SUITE_EXACT", "").strip().lower() in ("1", "true", "yes")
    if suite_f:
        comparisons = [c for c in comparisons if _comparison_matches_filter(c, suite_f, suite_exact)]

    run_id = os.environ.get("AUTOMATION_RUN_ID", "")
    divergent = sum(
        1
        for c in comparisons
        if (c.get("normalized_diff") or {}).get("divergence_class") != "equivalent"
    )
    report = {
        "metadata": {
            "generated_at": datetime.now(UTC).isoformat(),
            "run_id": run_id or None,
            "org_id": org_id,
            "base_url": base_url,
            "scope": "Comparativo V1 vs V2 com mesma operacao e mesmo body",
            "v2_update_http_method": "PATCH",
            "suite_filter": suite_f or None,
            "suite_exact": suite_exact,
        },
        "auth": {
            "v1_token_generation_status": v1_token_capture["response"]["status"],
            "v2_fixed_token_present": bool(v2_token),
        },
        "comparisons": comparisons,
        "summary": {
            "scenarios_total": len(comparisons),
            "divergences_count": divergent,
        },
    }

    output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(str(output_path))


if __name__ == "__main__":
    main()
