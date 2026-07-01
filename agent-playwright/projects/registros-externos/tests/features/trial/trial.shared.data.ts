import trialEnv from '../../../data/trial-env.json' with { type: 'json' };

/**
 * Dados da Trial dedicada do projeto registros-externos (org 37078).
 * Carrega URL/orgId de `data/trial-env.json` e resolve email/senha do `.env`
 * via as env vars declaradas. Ver skill `testar-exclusao-dados-trial-twygo`
 * §"<test-case>.data.ts canônico".
 */

const email =
  'email' in trialEnv && (trialEnv as { email?: string }).email
    ? (trialEnv as unknown as { email: string }).email
    : process.env[(trialEnv as { emailEnvVar: string }).emailEnvVar];

const password = process.env[trialEnv.passwordEnvVar];

if (!email) {
  throw new Error(
    `Email da Trial ausente. Esperado no campo \`email\` de trial-env.json ou na env var \`${trialEnv.emailEnvVar}\`.`,
  );
}
if (!password) {
  throw new Error(
    `${trialEnv.passwordEnvVar} ausente em .env. Preencher após provisionamento (provisionar-trial-projeto-twygo).`,
  );
}

export const TRIAL = {
  url: trialEnv.url,
  orgId: trialEnv.orgId,
  email,
  password,
  emailEnvVar: trialEnv.emailEnvVar,
  passwordEnvVar: trialEnv.passwordEnvVar,
} as const;
