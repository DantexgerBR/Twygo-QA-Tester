import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class {{CLASS_NAME}} extends BasePage {
  readonly path = '{{PATH}}';

{{LOCATOR_DECLARATIONS}}

  constructor(page: Page) {
    super(page);
{{LOCATOR_INITIALIZATIONS}}
  }
}
