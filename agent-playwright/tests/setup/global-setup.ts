import type { FullConfig } from '@playwright/test';
import { createLogger } from '../../src/utils/logger.js';

const log = createLogger('global-setup');

async function globalSetup(_config: FullConfig): Promise<void> {
  log.info('Iniciando setup global da suíte de testes Twygo');
  // Ponto de extensão: autenticação programática, seeding, etc.
}

export default globalSetup;
