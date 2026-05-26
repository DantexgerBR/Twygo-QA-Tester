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
