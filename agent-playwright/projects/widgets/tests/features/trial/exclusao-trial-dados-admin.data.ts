import trialEnv from '../../../data/trial-env.json' with { type: 'json' };

const email =
  'email' in trialEnv
    ? (trialEnv as unknown as { email: string }).email
    : process.env[(trialEnv as { emailEnvVar: string }).emailEnvVar];

const password = process.env[trialEnv.passwordEnvVar];

if (!email) {
  throw new Error(
    `Email da Trial ausente. Esperado em \`${trialEnv.emailEnvVar ?? 'campo email do trial-env.json'}\`. Rode \`provisionar-trial-projeto-twygo\` ou preencha .env.`,
  );
}
if (!password) {
  throw new Error(
    `${trialEnv.passwordEnvVar} ausente em .env. Preencher após provisionamento.`,
  );
}

export const TRIAL = {
  url: trialEnv.url,
  orgId: trialEnv.orgId,
  email,
  password,
} as const;

export const adminTrialData = {
  /**
   * Nome base do painel criado como pré-condição. Spec adiciona suffix único
   * (workerIndex+timestamp) em runtime pra evitar strict-mode violation
   * quando há orfãos de runs anteriores acumulados na Trial. XML usa "Painel
   * do Admin Trial" literal — preservamos como prefixo.
   *
   * Histórico (2026-05-15): teste original usava nome literal sem suffix.
   * Confirmamos via Network/Console que o bug-produto da exclusão Sophia
   * "Todas informações" deixa painéis admin órfãos cumulativos, gerando
   * strict-mode violation na pré-condição. Suffix único isola cada run.
   */
  adminPanelNameBase: 'Painel do Admin Trial',
} as const;
