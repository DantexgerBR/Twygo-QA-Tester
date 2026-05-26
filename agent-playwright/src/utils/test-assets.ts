import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../test-assets');

/**
 * Catálogo tipado de arquivos compartilhados em `test-assets/`.
 *
 * Use sempre que um spec precisar de arquivo binário (upload, importação,
 * comparação visual). Nunca hardcodar caminho no spec — typo quebra no
 * typecheck, autocomplete no IDE, e renomear arquivo edita só este catálogo.
 *
 * Catálogo descritivo (tamanho exato, propósito, limite-alvo) em
 * `test-assets/README.md`. Adicionar entrada aqui é parte do PR que
 * deposita o binário.
 *
 * Anti-pattern H (CLAUDE.md §7.6): proibido gerar fixture em runtime
 * (`fs.writeFileSync`). Arquivos não-determinísticos sujam o working dir,
 * podem vazar pro git e quebram em CI/máquina diferente.
 *
 * Nota sobre nomes: os filenames refletem o que está depositado fisicamente
 * em `test-assets/uploads/` — nomes "humanos" (`GRAMMAR e QUICK TIPS.pdf`,
 * `anel.jpg`, etc.) em vez de canônicos (`pdf-valid-indexable.pdf`). As
 * CHAVES TS aqui permanecem descritivas (`pdfValidIndexable`, `pngValid`)
 * pra que os specs continuem legíveis. Renomear arquivos no FS é opcional
 * — quando feito, basta atualizar este arquivo.
 */
export const uploadFixtures = {
  images: {
    /** ~199 KB — happy-path JPG dentro do limite com folga. */
    jpgValidSmall: join(ROOT, 'uploads/images/anel.jpg'),
    /** ~16 MB — JPG médio (não é "borda inferior" real do limite 50MB, mas
     * é o maior JPG válido disponível). */
    jpgValidNearLimit: join(ROOT, 'uploads/images/colibri-de-cores-vivas-na-natureza.jpg'),
    /** ~1.1 MB — happy-path PNG. */
    pngValid: join(ROOT, 'uploads/images/Cursos Udemy.png'),
    /** ~158 KB — PNG pequeno alternativo. */
    pngValidSmall: join(ROOT, 'uploads/images/playwritgh.png'),
    /**
     * Originalmente esperado: `unsupported.bmp`. Como nenhum BMP foi
     * depositado, reusa o ZIP de `documents/` — também fora da lista aceita
     * pela aba Mídia [JPG, JPEG, PNG]. Cenário "formato não suportado" segue
     * válido. Pra fidelidade total, depositar um `.bmp` real e atualizar aqui.
     */
    unsupportedBmp: join(ROOT, 'uploads/documents/Nova Pasta Compactada.zip'),
    /**
     * PLACEHOLDER — nenhum PNG >50 MB depositado. Path não existe no FS;
     * spec mídia TC4 (`tentar-upload-imagem-acima-do-limite`) segue `fixme`.
     * Depositar uma imagem real >50 MB e atualizar este path pra destravar.
     */
    pngOversized: join(ROOT, 'uploads/images/TODO-png-oversized.png'),
  },
  documents: {
    /** ~1.1 MB — PDF com texto real (`GRAMMAR e QUICK TIPS.pdf`).
     *  AT espera ~5 MB mas 1.1 MB cobre happy-path + indexação assertiva. */
    pdfValidIndexable: join(ROOT, 'uploads/documents/GRAMMAR e QUICK TIPS.pdf'),
    /** ~3-5 MB — PDF secundário (`pdf-Livro dos 8 poderes - Culture Code Twygo.pdf`).
     *  Útil para cobertura múltipla de uploads PDF na mesma suíte. */
    pdfLivro8Poderes: join(ROOT, 'uploads/documents/pdf-Livro dos 8 poderes - Culture Code Twygo.pdf'),
    /** ~41 KB — DOCX com texto real (`Músicas em Inglês.docx`).
     *  AT espera ~3 MB; 41 KB cobre happy-path com folga. */
    docxValid: join(ROOT, 'uploads/documents/Músicas em Inglês.docx'),
    /** ~2.0 MB — PPTX válido (formato aceito por Fontes). Não tem TC
     *  dedicado no AT atual; útil pra cobertura futura. */
    pptxValid: join(ROOT, 'uploads/documents/GMUD_troca_de_ambiente_chat_notificacao.pptx'),
    /** JSON fora do accept de Fontes e Recursos — cenário "formato não suportado". */
    unsupportedJson: join(ROOT, 'uploads/documents/Insomnia_api_v2.json'),
    /**
     * Originalmente esperado: `unsupported.exe`. Como nenhum binário .exe
     * foi depositado, usa-se ZIP (22 bytes) — também fora da lista aceita
     * pela aba Fontes [DOCX, PPTX, PDF, MP4, MP3]. Cenário "formato não
     * suportado" segue válido. Pra fidelidade total ao AT, depositar `.exe`.
     */
    unsupportedExe: join(ROOT, 'uploads/documents/Nova Pasta Compactada.zip'),
    /** ~24 KB — CSV (também fora da lista aceita). Alternativa pro spec
     *  de formato não suportado se preferir CSV vs ZIP. */
    unsupportedCsv: join(ROOT, 'uploads/documents/Teste - Aquivo para validar erros CSV.csv'),
    /**
     * PLACEHOLDER — nenhum PDF >50 MB depositado. Path não existe no FS;
     * spec fontes TC4 (`tentar-upload-acima-do-limite`) segue `fixme`.
     * Depositar um PDF/MP4 real >50 MB e atualizar este path pra destravar.
     * MP4 ≤100 MB serve (formato aceito por Fontes; será rejeitado por tamanho).
     */
    pdfOversized: join(ROOT, 'uploads/documents/TODO-pdf-oversized.pdf'),
  },
  /**
   * Áudio/vídeo (MP3, MP4). No Twygo, entram pela aba "Fontes de conhecimento"
   * (mesma dos PDFs/DOCX) — agrupados aqui por tipo de arquivo, não por tab.
   * Sem TC dedicado no AT atual; disponível pra cobertura futura.
   */
  media: {
    /** ~5 MB — happy-path MP4 (`Xmind - Converter arquivo.mp4`). */
    mp4Valid: join(ROOT, 'uploads/media/Xmind - Converter arquivo.mp4'),
    /** ~2.8 MB — MP4 pequeno (`GIF.mp4`). */
    mp4Small: join(ROOT, 'uploads/media/GIF.mp4'),
    /** ~28 MB — MP4 médio (`Comando ANALYZE.mp4`). */
    mp4Medium: join(ROOT, 'uploads/media/Comando ANALYZE.mp4'),
    /** MP4 adicional (`Chamada com Edu Claude.mp4`) — quarto MP4 disponível
     *  para cobertura ampla de uploads de vídeo na suíte Fontes. */
    mp4ChamadaEdu: join(ROOT, 'uploads/media/Chamada com Edu Claude.mp4'),
    /** ~10 MB — happy-path MP3 (`Gabriela Rocha - Teu Santo Nome (Ao Vivo).mp3`). */
    mp3Valid: join(ROOT, 'uploads/media/Gabriela Rocha - Teu Santo Nome (Ao Vivo).mp3'),
    /** ~17 MB — MP3 maior (`Gabriela Rocha - Atos 2.mp3`). */
    mp3Large: join(ROOT, 'uploads/media/Gabriela Rocha - Atos 2.mp3'),
    /** MKV fora do accept de Fontes (.mp4/.mp3) e de Recursos (.jpg/.jpeg/.png).
     *  Cenário "formato não suportado" para mídia. */
    unsupportedMkv: join(ROOT, 'uploads/media/video.mkv.mkv'),
  },
} as const;

export type UploadFixtureCategory = keyof typeof uploadFixtures;
export type UploadFixturePath = string;
