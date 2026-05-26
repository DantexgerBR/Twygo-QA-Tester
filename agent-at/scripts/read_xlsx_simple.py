"""Lê xlsx sem depender de openpyxl — usa zipfile + xml.etree.

Uso: python read_xlsx_simple.py <path-to-xlsx>
"""
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}


def read_shared_strings(z):
    strings = []
    if 'xl/sharedStrings.xml' not in z.namelist():
        return strings
    with z.open('xl/sharedStrings.xml') as f:
        data = f.read().decode('utf-8')
    tree = ET.fromstring(data)
    for si in tree.findall('s:si', NS):
        parts = []
        for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
            parts.append(t.text or '')
        strings.append(''.join(parts))
    return strings


def col_letter_to_index(letters):
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch.upper()) - ord('A') + 1)
    return n - 1


def parse_sheet(z, sheet_path, shared):
    with z.open(sheet_path) as f:
        data = f.read().decode('utf-8')
    tree = ET.fromstring(data)
    rows = []
    for row in tree.findall('.//s:row', NS):
        cells = {}
        max_col = -1
        for c in row.findall('s:c', NS):
            ref = c.attrib.get('r', '')
            letters = ''.join(ch for ch in ref if ch.isalpha())
            if not letters:
                continue
            idx = col_letter_to_index(letters)
            t = c.attrib.get('t', '')
            v = c.find('s:v', NS)
            inline = c.find('s:is', NS)
            val = ''
            if v is not None and v.text is not None:
                if t == 's':
                    val = shared[int(v.text)] if int(v.text) < len(shared) else v.text
                else:
                    val = v.text
            elif inline is not None:
                parts = []
                for tnode in inline.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                    parts.append(tnode.text or '')
                val = ''.join(parts)
            cells[idx] = val
            if idx > max_col:
                max_col = idx
        row_list = [cells.get(i, '') for i in range(max_col + 1)] if max_col >= 0 else []
        rows.append(row_list)
    return rows


def main():
    xlsx_path = Path(sys.argv[1])
    out_mode = sys.argv[2] if len(sys.argv) > 2 else 'pretty'
    with zipfile.ZipFile(xlsx_path) as z:
        shared = read_shared_strings(z)
        with z.open('xl/workbook.xml') as f:
            wb = ET.fromstring(f.read().decode('utf-8'))
        sheets = []
        for s in wb.findall('s:sheets/s:sheet', NS):
            sheets.append({
                'name': s.attrib.get('name'),
                'id': s.attrib.get('sheetId'),
                'rid': s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'),
            })
        with z.open('xl/_rels/workbook.xml.rels') as f:
            rels = ET.fromstring(f.read().decode('utf-8'))
        rid_to_target = {r.attrib.get('Id'): r.attrib.get('Target')
                         for r in rels.findall('{http://schemas.openxmlformats.org/package/2006/relationships}Relationship')}

        for s in sheets:
            print(f"\n=== Sheet: {s['name']} ===")
            target = rid_to_target.get(s['rid'])
            sheet_path = f'xl/{target}' if not target.startswith('xl/') else target
            if sheet_path.startswith('xl//'):
                sheet_path = sheet_path.replace('xl//', 'xl/')
            rows = parse_sheet(z, sheet_path, shared)
            print(f"Rows: {len(rows)}")
            if out_mode == 'full':
                for i, r in enumerate(rows):
                    print(f"\n--- ROW {i+1} ---")
                    for j, val in enumerate(r):
                        print(f"  Col {j}: {val}")
            else:
                for i, r in enumerate(rows):
                    print(f"R{i+1}: " + " | ".join(repr(c)[:120] for c in r))


if __name__ == '__main__':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    main()
