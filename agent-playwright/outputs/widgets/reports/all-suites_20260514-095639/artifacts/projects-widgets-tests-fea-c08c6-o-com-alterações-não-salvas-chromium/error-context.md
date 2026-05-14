# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\widgets\tests\features\layout-das-abas\cancelar-edicao-com-alteracoes.spec.ts >> Layout das abas >> Cancelar edição com alterações não salvas
- Location: projects\widgets\tests\features\layout-das-abas\cancelar-edicao-com-alteracoes.spec.ts:15:3

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByTestId('panel-layout-cancel-button')
    - locator resolved to <button type="button" class="chakra-button css-7vf75e" data-test-id="panel-layout-cancel-button">Cancelar</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action

```

```
Tearing down "exploratory" exceeded the test timeout of 120000ms.
```