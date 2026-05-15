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
   * Nome do painel criado manualmente como pré-condição. XML usa "Painel do
   * Admin Trial" literal — preservado pra paridade com a documentação do TC,
   * sem worker suffix porque a exclusão zera o tenant inteiro (`afterAll`
   * não precisa cleanup — o teste em si é o cleanup).
   */
  adminPanelName: 'Painel do Admin Trial',
} as const;
