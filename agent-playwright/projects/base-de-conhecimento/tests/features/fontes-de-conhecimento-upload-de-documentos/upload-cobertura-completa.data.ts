// Dados do spec "upload-cobertura-completa".
//
// Itera por TODOS os arquivos disponíveis em `test-assets/uploads/` cobrindo:
//   - Fontes (PDF/DOCX/PPTX/MP4/MP3 — todos os arquivos válidos para esse accept)
//   - Recursos de mídia (JPG/PNG — todos os arquivos válidos para esse accept)
//   - Rejeição de formatos não suportados (.zip/.csv/.json/.mkv)
//
// Catálogo tipado de paths em `src/utils/test-assets.ts` (Anti-pattern H §7.6).
// Basenames usados para asserções `getByText(...)` na UI pós-upload.
import { basename } from 'node:path';
import { uploadFixtures } from '../../../../../src/utils/test-assets.js';

export interface UploadFixtureEntry {
  /** Label curto para o título do allure.step + nome único do recurso na UI. */
  readonly label: string;
  /** Path absoluto para `setInputFiles()`. */
  readonly path: string;
  /** Basename do arquivo — útil para asserções "linha contém o filename". */
  readonly filename: string;
}

const fontesValidas: readonly UploadFixtureEntry[] = [
  { label: 'PDF — GRAMMAR e QUICK TIPS', path: uploadFixtures.documents.pdfValidIndexable },
  { label: 'PDF — Livro dos 8 poderes', path: uploadFixtures.documents.pdfLivro8Poderes },
  { label: 'DOCX — Músicas em Inglês', path: uploadFixtures.documents.docxValid },
  { label: 'PPTX — GMUD troca de ambiente', path: uploadFixtures.documents.pptxValid },
  { label: 'MP4 — Xmind Converter', path: uploadFixtures.media.mp4Valid },
  { label: 'MP4 — GIF', path: uploadFixtures.media.mp4Small },
  { label: 'MP4 — Comando ANALYZE', path: uploadFixtures.media.mp4Medium },
  { label: 'MP3 — Teu Santo Nome', path: uploadFixtures.media.mp3Valid },
  { label: 'MP3 — Atos 2', path: uploadFixtures.media.mp3Large },
].map((e) => ({ ...e, filename: basename(e.path) }));

// `Chamada com Edu Claude.mp4` (~199 MB) excede o limite 50 MB da aba Fontes.
// Removido de `fontesValidas` para não falhar como upload válido. Cobertura do
// cenário oversize segue no spec `tentar-upload-acima-do-limite.spec.ts` (fixme
// até audit live confirmar mensagem exata do produto pra erro de tamanho).
//
// uploadFixtures.media.mp4ChamadaEdu ainda existe no catálogo para uso futuro.

const recursosValidos: readonly UploadFixtureEntry[] = [
  { label: 'JPG — Anel', path: uploadFixtures.images.jpgValidSmall },
  { label: 'JPG — Colibri', path: uploadFixtures.images.jpgValidNearLimit },
  { label: 'PNG — Cursos Udemy', path: uploadFixtures.images.pngValid },
  { label: 'PNG — Playwritgh', path: uploadFixtures.images.pngValidSmall },
].map((e) => ({ ...e, filename: basename(e.path) }));

const formatosInvalidos: readonly UploadFixtureEntry[] = [
  { label: 'ZIP — Nova Pasta Compactada', path: uploadFixtures.documents.unsupportedExe },
  { label: 'CSV — Validar erros', path: uploadFixtures.documents.unsupportedCsv },
  { label: 'JSON — Insomnia v2', path: uploadFixtures.documents.unsupportedJson },
  { label: 'MKV — vídeo container', path: uploadFixtures.media.unsupportedMkv },
].map((e) => ({ ...e, filename: basename(e.path) }));

export const uploadCoberturaData = {
  storageState: 'outputs/.auth/storage.json',
  fontesValidas,
  recursosValidos,
  formatosInvalidos,
  /** Mensagem inline na dropzone quando o arquivo está fora do accept
   *  (validado live 2026-05-20 em chrome-devtools-mcp). */
  erroFormatoInvalido: /Formato do arquivo não suportado\.?\s*Tente novamente/i,
} as const;
