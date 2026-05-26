// Constantes compartilhadas pela suíte "Recursos de Mídia - Upload de imagens".
//
// Caminhos resolvidos via `uploadFixtures` (helper centralizado em
// src/utils/test-assets.ts — Anti-pattern H §7.6 do CLAUDE.md). Arquivos
// físicos devem estar em test-assets/uploads/images/. Tamanhos esperados
// (catálogo completo em test-assets/README.md):
//   - png-valid.png       (~2 MB, PNG válido)
//   - jpg-valid-small.jpg (~2 MB, JPG válido) — JPEG = JPG
//   - unsupported.bmp     (~50 KB, BMP — fora de [JPG, JPEG, PNG])
//   - png-oversized.png   (>50 MB — pendente decisão LFS/runtime)
//
// Limite (do MD §Limites de campos): uploadMaxSizeMB = 50.
import { basename, resolve } from 'node:path';
import { uploadFixtures } from '../../../../../src/utils/test-assets.js';

export const midiaSharedData = {
  storageState: resolve(process.cwd(), 'outputs/.auth/storage.json'),

  /** Paths absolutos pra setInputFiles. */
  paths: {
    png: uploadFixtures.images.pngValid,
    jpg: uploadFixtures.images.jpgValidSmall,
    invalid: uploadFixtures.images.unsupportedBmp,
    oversized: uploadFixtures.images.pngOversized,
  },

  /** Basenames pra asserções `getByText(...)`. */
  names: {
    png: basename(uploadFixtures.images.pngValid),
    jpg: basename(uploadFixtures.images.jpgValidSmall),
    invalid: basename(uploadFixtures.images.unsupportedBmp),
    oversized: basename(uploadFixtures.images.pngOversized),
  },

  // Formatos aceitos (do MD §Tipos de arquivo aceitos para Recursos de mídia):
  acceptedFormats: ['JPG', 'JPEG', 'PNG'] as const,
  uploadMaxSizeMB: 50,
  toastSucesso: /Imagem enviada com sucesso|Mídia enviada com sucesso|Arquivo enviado com sucesso/i,
  toastErroFormato: /Formato (não suportado|inválido)/i,
  toastErroTamanho: /Tamanho máximo|excede o limite|50\s*MB/i,
} as const;
