import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { createLogger } from '../../src/utils/logger.js';
import { FILES } from '../../src/utils/constants.js';
import { ensureDir, ensureParentDir, toPascalCase, slugify } from '../../src/utils/helpers.js';
import type {
  ParsedAnalysis,
  ParsedScenario,
  ParsedStep,
  ParsedAssertion,
} from '../twygo-xml-parser/parser.js';

const log = createLogger('test-executor');

type CliFlags = {
  generateOnly: boolean;
  dryRun: boolean;
};

type ProjectConfig = {
  codeGeneration: {
    pagesDir: string;
    featuresDir: string;
    overwriteExistingPages: boolean;
    overwriteExistingTests: boolean;
  };
};

type PageDescriptor = {
  key: string;
  className: string;
  fileName: string;
  path: string;
  locators: Map<string, string>;
};

function parseFlags(argv: string[]): CliFlags {
  return {
    generateOnly: argv.includes('--generate-only'),
    dryRun: argv.includes('--dry-run'),
  };
}

function loadProjectConfig(): ProjectConfig {
  const raw = readFileSync(resolve(process.cwd(), FILES.projectConfig), 'utf-8');
  return JSON.parse(raw) as ProjectConfig;
}

function deriveTargets(scenarios: ParsedScenario[]): PageDescriptor[] {
  const registry = new Map<string, PageDescriptor>();
  for (const scenario of scenarios) {
    for (const testCase of scenario.testCases) {
      for (const step of testCase.steps) {
        const target = step.target;
        if (!target) continue;
        if (!registry.has(target)) {
          const className = `${toPascalCase(target.replace(/_page$/i, ''))}Page`;
          registry.set(target, {
            key: target,
            className,
            fileName: `${className}.ts`,
            path: `/${slugify(target.replace(/_page$/i, ''))}`,
            locators: new Map(),
          });
        }
        if (step.locator) {
          const descriptor = registry.get(target)!;
          descriptor.locators.set(step.locator, inferLocatorStrategy(step.locator));
        }
      }
      for (const assertion of testCase.assertions) {
        if (!assertion.locator) continue;
        const target = assertion.target ?? inferTargetForAssertion(testCase.steps) ?? 'current_page';
        if (!registry.has(target)) {
          const className = `${toPascalCase(target.replace(/_page$/i, ''))}Page`;
          registry.set(target, {
            key: target,
            className,
            fileName: `${className}.ts`,
            path: `/${slugify(target.replace(/_page$/i, ''))}`,
            locators: new Map(),
          });
        }
        registry.get(target)!.locators.set(assertion.locator, inferLocatorStrategy(assertion.locator));
      }
    }
  }
  return [...registry.values()];
}

function inferTargetForAssertion(steps: ParsedStep[]): string | undefined {
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i]?.target) return steps[i].target;
  }
  return undefined;
}

/**
 * Locators vindos do XML são identificadores lógicos (ex.: `email_input`).
 * Inferimos a estratégia mais resiliente possível a partir do nome.
 */
function inferLocatorStrategy(locator: string): string {
  const name = locator.toLowerCase();
  if (name.endsWith('_button') || name.endsWith('_btn')) {
    const label = toPascalCase(name.replace(/_(button|btn)$/i, ''));
    return `page.getByRole('button', { name: /${label}/i })`;
  }
  if (name.endsWith('_input')) {
    const label = toPascalCase(name.replace(/_input$/i, ''));
    return `page.getByLabel(/${label}/i)`;
  }
  if (name.endsWith('_link')) {
    const label = toPascalCase(name.replace(/_link$/i, ''));
    return `page.getByRole('link', { name: /${label}/i })`;
  }
  if (name.endsWith('_message') || name.endsWith('_alert')) {
    return `page.getByRole('alert')`;
  }
  return `page.getByTestId('${name}')`;
}

function renderPageObject(descriptor: PageDescriptor, template: string): string {
  const locatorDeclarations: string[] = [];
  const locatorInits: string[] = [];
  for (const [logical, strategy] of descriptor.locators) {
    const prop = logical.replace(/_([a-z])/g, (_m, c: string) => c.toUpperCase());
    locatorDeclarations.push(`  readonly ${prop}: Locator;`);
    locatorInits.push(`    this.${prop} = ${strategy};`);
  }
  return template
    .replace(/\{\{CLASS_NAME\}\}/g, descriptor.className)
    .replace(/\{\{PATH\}\}/g, descriptor.path)
    .replace(/\{\{LOCATOR_DECLARATIONS\}\}/g, locatorDeclarations.join('\n') || '  // sem locators declarados')
    .replace(/\{\{LOCATOR_INITIALIZATIONS\}\}/g, locatorInits.join('\n') || '    // sem locators inicializados');
}

type PageLookup = {
  varFor: (target: string | undefined) => string;
  varForLocator: (locator: string) => string;
  primary: PageDescriptor | undefined;
};

function pageVarName(descriptor: PageDescriptor): string {
  return descriptor.className.charAt(0).toLowerCase() + descriptor.className.slice(1);
}

function renderStep(step: ParsedStep, lookup: PageLookup): string {
  const pageVar = lookup.varFor(step.target);
  const locatorRef = step.locator
    ? resolveLocatorRef(step.locator, lookup.varForLocator(step.locator))
    : null;
  switch (step.action) {
    case 'navigate':
      return `    await ${pageVar}.goto();`;
    case 'fill':
      return `    await ${locatorRef}.fill(${JSON.stringify(step.value ?? '')});`;
    case 'type':
      return `    await ${locatorRef}.pressSequentially(${JSON.stringify(step.value ?? '')});`;
    case 'click':
      return `    await ${locatorRef}.click();`;
    case 'double_click':
      return `    await ${locatorRef}.dblclick();`;
    case 'hover':
      return `    await ${locatorRef}.hover();`;
    case 'select':
      return `    await ${locatorRef}.selectOption(${JSON.stringify(step.value ?? '')});`;
    case 'check':
      return `    await ${locatorRef}.check();`;
    case 'uncheck':
      return `    await ${locatorRef}.uncheck();`;
    case 'upload':
      return `    await ${locatorRef}.setInputFiles(${JSON.stringify(step.value ?? '')});`;
    case 'wait_for_navigation':
      return `    await page.waitForURL(/.*/);`;
    case 'wait_for_element':
      return `    await expect(${locatorRef}).toBeVisible();`;
    case 'screenshot':
      return `    await page.screenshot({ path: 'outputs/screenshots/${slugify(step.id)}.png' });`;
    default:
      return `    // TODO: ação não mapeada: ${step.action} (${step.id})`;
  }
}

function renderAssertion(assertion: ParsedAssertion, lookup: PageLookup): string {
  const locatorRef = assertion.locator
    ? resolveLocatorRef(assertion.locator, lookup.varForLocator(assertion.locator))
    : null;
  switch (assertion.type) {
    case 'url_contains':
      return `    await expect(page).toHaveURL(new RegExp(${JSON.stringify(assertion.value ?? '')}));`;
    case 'url_equals':
      return `    await expect(page).toHaveURL(${JSON.stringify(assertion.value ?? '')});`;
    case 'element_visible':
      return `    await expect(${locatorRef}).toBeVisible();`;
    case 'element_hidden':
      return `    await expect(${locatorRef}).toBeHidden();`;
    case 'text_equals':
      return `    await expect(${locatorRef}).toHaveText(${JSON.stringify(assertion.value ?? '')});`;
    case 'text_contains':
      return `    await expect(${locatorRef}).toContainText(${JSON.stringify(assertion.value ?? '')});`;
    case 'value_equals':
      return `    await expect(${locatorRef}).toHaveValue(${JSON.stringify(assertion.value ?? '')});`;
    case 'count_equals':
      return `    await expect(${locatorRef}).toHaveCount(${Number(assertion.value ?? 0)});`;
    case 'attribute_equals': {
      const [attr, val] = String(assertion.value ?? '').split('=');
      return `    await expect(${locatorRef}).toHaveAttribute(${JSON.stringify(attr ?? '')}, ${JSON.stringify(val ?? '')});`;
    }
    default:
      return `    // TODO: asserção não mapeada: ${assertion.type} (${assertion.id})`;
  }
}

function resolveLocatorRef(logical: string, pageVar: string): string {
  const prop = logical.replace(/_([a-z])/g, (_m, c: string) => c.toUpperCase());
  return `${pageVar}.${prop}`;
}

function renderScenarioSpec(
  scenario: ParsedScenario,
  pages: PageDescriptor[],
  template: string,
): string {
  const primary = pages[0];

  const imports = pages
    .map((p) => `import { ${p.className} } from '../../src/pages/${p.className}.js';`)
    .join('\n');

  // Map each logical locator to the page that owns it.
  const locatorOwner = new Map<string, PageDescriptor>();
  for (const p of pages) {
    for (const locator of p.locators.keys()) {
      if (!locatorOwner.has(locator)) locatorOwner.set(locator, p);
    }
  }

  const lookup: PageLookup = {
    varFor: (target) => {
      if (!target) return primary ? pageVarName(primary) : 'page';
      const found = pages.find((p) => p.key === target);
      return found ? pageVarName(found) : primary ? pageVarName(primary) : 'page';
    },
    varForLocator: (locator) => {
      const owner = locatorOwner.get(locator) ?? primary;
      return owner ? pageVarName(owner) : 'page';
    },
    primary,
  };

  const tests = scenario.testCases
    .map((tc) => {
      const usedPages = new Set<PageDescriptor>();
      for (const s of tc.steps) {
        if (s.target) {
          const found = pages.find((p) => p.key === s.target);
          if (found) usedPages.add(found);
        }
        if (s.locator) {
          const owner = locatorOwner.get(s.locator);
          if (owner) usedPages.add(owner);
        }
      }
      for (const a of tc.assertions) {
        if (a.target) {
          const found = pages.find((p) => p.key === a.target);
          if (found) usedPages.add(found);
        }
        if (a.locator) {
          const owner = locatorOwner.get(a.locator);
          if (owner) usedPages.add(owner);
        }
      }
      const instantiations = [...usedPages]
        .map((p) => `    const ${pageVarName(p)} = new ${p.className}(page);`)
        .join('\n');
      const body = [
        ...tc.steps.map((s) => renderStep(s, lookup)),
        ...tc.assertions.map((a) => renderAssertion(a, lookup)),
      ].join('\n');
      return `  test(${JSON.stringify(tc.name)}, async ({ page }) => {
${instantiations}
${body}
  });`;
    })
    .join('\n\n');

  return template
    .replace(/\{\{IMPORTS\}\}/g, imports)
    .replace(/\{\{DESCRIBE_TITLE\}\}/g, JSON.stringify(scenario.name))
    .replace(/\{\{TESTS\}\}/g, tests);
}

function writeIfAllowed(path: string, content: string, allowOverwrite: boolean, dryRun: boolean): void {
  if (existsSync(path) && !allowOverwrite) {
    log.info(`Mantendo arquivo existente (overwrite=false): ${path}`);
    return;
  }
  if (dryRun) {
    log.info(`[dry-run] escreveria: ${path}`);
    return;
  }
  ensureParentDir(path);
  writeFileSync(path, content, 'utf-8');
  log.info(`Escrito: ${path}`);
}

async function runPlaywright(): Promise<number> {
  return new Promise((resolvePromise) => {
    const child = spawn('npx', ['playwright', 'test'], {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('close', (code) => resolvePromise(code ?? 1));
  });
}

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2));
  const config = loadProjectConfig();

  const parsedPath = resolve(process.cwd(), FILES.parsedAnalysis);
  if (!existsSync(parsedPath)) {
    throw new Error(
      `JSON parseado ausente: ${parsedPath}. Rode "npm run agent:parse" antes.`,
    );
  }

  const analysis = JSON.parse(readFileSync(parsedPath, 'utf-8')) as ParsedAnalysis;

  const pageTemplate = readFileSync(
    resolve(process.cwd(), FILES.pageObjectTemplate),
    'utf-8',
  );
  const testTemplate = readFileSync(resolve(process.cwd(), FILES.testTemplate), 'utf-8');

  const pagesDir = resolve(process.cwd(), config.codeGeneration.pagesDir);
  const featuresDir = resolve(process.cwd(), config.codeGeneration.featuresDir);
  ensureDir(pagesDir);
  ensureDir(featuresDir);

  const allPages = deriveTargets(analysis.scenarios);
  log.info(`Páginas únicas identificadas: ${allPages.length}`);

  for (const descriptor of allPages) {
    const outPath = join(pagesDir, descriptor.fileName);
    const content = renderPageObject(descriptor, pageTemplate);
    writeIfAllowed(outPath, content, config.codeGeneration.overwriteExistingPages, flags.dryRun);
  }

  for (const scenario of analysis.scenarios) {
    const involvedTargets = new Set<string>();
    const involvedLocators = new Set<string>();
    for (const tc of scenario.testCases) {
      for (const s of tc.steps) {
        if (s.target) involvedTargets.add(s.target);
        if (s.locator) involvedLocators.add(s.locator);
      }
      for (const a of tc.assertions) {
        if (a.target) involvedTargets.add(a.target);
        if (a.locator) involvedLocators.add(a.locator);
      }
    }
    const scenarioPages = allPages.filter(
      (p) =>
        involvedTargets.has(p.key) ||
        [...p.locators.keys()].some((l) => involvedLocators.has(l)),
    );
    const content = renderScenarioSpec(scenario, scenarioPages.length ? scenarioPages : allPages, testTemplate);
    const outPath = join(featuresDir, `${slugify(scenario.name)}.spec.ts`);
    writeIfAllowed(outPath, content, config.codeGeneration.overwriteExistingTests, flags.dryRun);
  }

  if (flags.generateOnly) {
    log.info('Flag --generate-only: não executando Playwright.');
    return;
  }
  if (flags.dryRun) {
    log.info('Flag --dry-run: não executando Playwright.');
    return;
  }

  log.info('Invocando Playwright CLI');
  const code = await runPlaywright();
  if (code !== 0) {
    log.warn(`Playwright finalizou com código ${code}`);
    process.exit(code);
  }
}

const invokedDirectly = process.argv[1]?.endsWith('executor.ts');

if (invokedDirectly) {
  main().catch((err) => {
    log.error('Falha no executor', err);
    process.exit(1);
  });
}
