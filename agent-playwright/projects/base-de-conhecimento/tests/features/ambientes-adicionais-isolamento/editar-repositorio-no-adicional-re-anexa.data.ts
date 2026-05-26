import { uploadFixtures } from '../../../../../src/utils/test-assets.js';

export const editarRepositorioData = {
  baseName: 'Editável TC4',
  descriptionInitial: 'Descrição inicial — TC4 (será atualizada)',
  descriptionUpdated: 'Descrição atualizada — TC4 após edição',
  firstSource: {
    name: 'Fonte inicial PDF',
    file: uploadFixtures.documents.pdfValidIndexable,
  },
  firstResource: {
    name: 'Recurso inicial JPG',
    file: uploadFixtures.images.jpgValidSmall,
  },
  secondSource: {
    name: 'Fonte adicional DOCX',
    file: uploadFixtures.documents.docxValid,
  },
  secondResource: {
    name: 'Recurso adicional PNG',
    file: uploadFixtures.images.pngValidSmall,
  },
} as const;
