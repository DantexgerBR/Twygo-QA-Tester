// Constantes compartilhadas pela suíte "Fontes de Conhecimento - Upload de documentos".
//
// Textos e estrutura validados live 2026-05-20 via chrome-devtools-mcp em
// stage10.stage.twygoead.com/o/36602. Catálogo de arquivos centralizado em
// src/utils/test-assets.ts (Anti-pattern H §7.6 CLAUDE.md).
import { basename, resolve } from 'node:path';
import { uploadFixtures } from '../../../../../src/utils/test-assets.js';

export const fontesSharedData = {
  storageState: resolve(process.cwd(), 'outputs/.auth/storage.json'),

  /** Paths absolutos pra setInputFiles — fonte de verdade no helper. */
  paths: {
    pdf: uploadFixtures.documents.pdfValidIndexable,
    docx: uploadFixtures.documents.docxValid,
    invalid: uploadFixtures.documents.unsupportedExe,
    oversized: uploadFixtures.documents.pdfOversized,
    /** PNG pequeno (~158 KB) para passagem pela aba Recursos de mídia. */
    png: uploadFixtures.images.pngValidSmall,
  },

  /** Basenames pra asserções `getByText(...)` (UI mostra o filename do upload). */
  names: {
    pdf: basename(uploadFixtures.documents.pdfValidIndexable),
    docx: basename(uploadFixtures.documents.docxValid),
    invalid: basename(uploadFixtures.documents.unsupportedExe),
    oversized: basename(uploadFixtures.documents.pdfOversized),
    png: basename(uploadFixtures.images.pngValidSmall),
  },

  // Formatos aceitos (validados live no rótulo "Formato aceito:" do form):
  //   Fontes:   .pdf, .doc, .docx, .ppt, .pptx, .mp4, .mp3
  //   Recursos: .jpg, .jpeg, .png
  acceptedSourceFormats: ['DOCX', 'DOC', 'PPTX', 'PPT', 'PDF', 'MP4', 'MP3'] as const,
  acceptedResourceFormats: ['JPG', 'JPEG', 'PNG'] as const,
  /** Alias mantido para TC5 (validar exibição dos formatos aceitos — fixme).
   *  Refere-se aos formatos de Fontes (escopo do MD). */
  acceptedFormats: ['DOCX', 'DOC', 'PPTX', 'PPT', 'PDF', 'MP4', 'MP3'] as const,
  uploadMaxSizeMB: 50,

  // Texto exato do toast capturado live (chrome-devtools-mcp 2026-05-20):
  //   POST repo: "Repositório de conhecimento criado com sucesso"
  //   POST recurso: "Recurso de conhecimento criado com sucesso"
  // Toast desaparece em ~3s — asserção primária é redirect + linha na tabela.
  toastRepoCriado: /Repositório de conhecimento criado com sucesso/i,
  toastRecursoCriado: /Recurso de conhecimento criado com sucesso/i,

  // Situação na listagem pós-upload — começa "Em processamento", vira "Indexado".
  // Regex aceita ambos pra evitar flake por timing da indexação assíncrona.
  situacaoIndexandoOuIndexado: /Em processamento|Indexado/i,

  // Mensagem inline na dropzone quando arquivo tem extensão fora do accept
  // (validado live 2026-05-20 com .zip no sub-form de Fontes).
  erroFormatoInvalido: /Formato do arquivo não suportado\.?\s*Tente novamente/i,

  /** Alias mantido para TC4 (tentar upload acima do limite — fixme).
   *  Texto real não validado em runtime (precisa de fixture >50MB do tipo certo). */
  toastErroTamanho: /Tamanho máximo|excede o limite|50\s*MB/i,
} as const;
