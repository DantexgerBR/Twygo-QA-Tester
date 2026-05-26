import type { Page, Locator } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';

export class AprenderPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async abrirAtividade(eventoId: number): Promise<void> {
    await safeGoto(this.page, `/e/${eventoId}/learn?learn_origin=my-contents`);
  }

  getVideoPlayer(): Locator {
    return this.page.locator('video').first();
  }

  async iniciarReproducao(): Promise<void> {
    await this.getVideoPlayer().evaluate((v: HTMLVideoElement) => {
      v.muted = true;
      void v.play();
    });
  }

  async currentTime(): Promise<number> {
    return this.getVideoPlayer().evaluate((v: HTMLVideoElement) => v.currentTime);
  }

  async duration(): Promise<number> {
    return this.getVideoPlayer().evaluate((v: HTMLVideoElement) => v.duration);
  }

  async esperarPosicao(segundos: number, opts: { timeoutMs?: number } = {}): Promise<void> {
    const timeoutMs = opts.timeoutMs ?? 60_000;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const ct = await this.currentTime();
      if (ct >= segundos) return;
      await new Promise((r) => setTimeout(r, 500));
    }
    throw new Error(`Vídeo não atingiu ${segundos}s em ${timeoutMs}ms`);
  }

  getBotaoDownload(): Locator {
    return this.page.locator('#download-content');
  }
}
