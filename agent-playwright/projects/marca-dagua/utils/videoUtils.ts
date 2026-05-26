import type { Page, Locator } from '@playwright/test';

/**
 * Aguarda o vídeo atingir `targetSeconds` sem usar waitForTimeout.
 * Realiza polling em `video.currentTime` a cada 500ms.
 */
export async function waitForVideoTime(
  page: Page,
  videoLocator: Locator,
  targetSeconds: number,
  opts: { timeoutMs?: number } = {},
): Promise<void> {
  const timeoutMs = opts.timeoutMs ?? 60_000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const ct = await videoLocator
      .evaluate((v: HTMLVideoElement) => v.currentTime)
      .catch(() => 0);
    if (ct >= targetSeconds) return;
    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error(
    `waitForVideoTime: vídeo não atingiu ${targetSeconds}s em ${timeoutMs}ms`,
  );
}

/**
 * Extrai o frame atual do vídeo como base64 via canvas.drawImage.
 * Retorna string vazia se o vídeo não estiver pronto (readyState < 2).
 */
export async function captureVideoFrame(
  page: Page,
  videoLocator: Locator,
): Promise<string> {
  return page.evaluate((video: HTMLVideoElement) => {
    if (video.readyState < 2) return '';
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 180;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, await videoLocator.elementHandle() as unknown as HTMLVideoElement);
}
