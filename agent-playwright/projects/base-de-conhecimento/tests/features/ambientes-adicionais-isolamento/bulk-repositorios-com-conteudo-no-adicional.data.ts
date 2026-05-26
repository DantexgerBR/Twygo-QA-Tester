import { uploadFixtures } from '../../../../../src/utils/test-assets.js';

export const bulkRepositoriosData = {
  count: 10,
  prefix: 'Bulk TC3',
  description: 'Repositório do bulk-create TC3 — isolamento com conteúdo rico',
  sources: [
    { file: uploadFixtures.documents.pdfValidIndexable, label: 'pdf' },
    { file: uploadFixtures.documents.docxValid, label: 'docx' },
  ] as const,
  resources: [
    { file: uploadFixtures.images.jpgValidSmall, label: 'jpg' },
    { file: uploadFixtures.images.pngValidSmall, label: 'png' },
  ] as const,
} as const;
