/**
 * Registro central de data-test-ids descobertos via Playwright MCP nos planners
 * para a suíte "Configurar a utilização do indexação de conteúdo por ambiente".
 *
 * Política (CLAUDE.md §2.3): preferir getByTestId. Quando o app não expõe testid
 * próprio, fallback para role/label/text — registrar aqui também a heurística.
 */

export const TEST_IDS = {
  aiConsumptionSettings: {
    list: {
      container: 'ai-consumption-analysis-settings-list-container',
      editButton: 'ai-consumption-analysis-edit-button',
      aiAccessSwitch: (envId: string | number) =>
        `ai-consumption-analysis-settings-ai-access-switch-${envId}`,
      inheritFromPrimarySwitch: (envId: string | number) =>
        `ai-consumption-analysis-settings-inherit-from-primary-switch-${envId}`,
    },
    edit: {
      saveButton: 'ai-consumption-settings-edit-save-button',
      cancelButton: 'ai-consumption-settings-edit-cancel-button',
      contentIndexing: {
        masterSwitch: 'ai-consumption-settings-content-indexing-master-switch',
        masterSwitchInputId: 'ai-consumption-settings-content-indexing-can-ingest',
        specificPeriodSwitch:
          'ai-consumption-settings-content-indexing-specific-period-switch',
        periodStartDateInput:
          'ai-consumption-settings-content-indexing-period-start-date-input',
        periodEndDateInput:
          'ai-consumption-settings-content-indexing-period-end-date-input',
        periodConfirmation:
          'ai-consumption-settings-content-indexing-period-confirmation',
        periodLimitedAlert:
          'ai-consumption-settings-content-indexing-period-limited-alert',
        exceptionsMultiselect:
          'ai-consumption-settings-content-indexing-exceptions-multiselect',
        type: {
          course: 'ai-consumption-settings-content-indexing-type-course',
          trail: 'ai-consumption-settings-content-indexing-type-trail',
          package: 'ai-consumption-settings-content-indexing-type-package',
        },
        asset: {
          text: 'ai-consumption-settings-content-indexing-asset-text',
          page: 'ai-consumption-settings-content-indexing-asset-page',
          lesson: 'ai-consumption-settings-content-indexing-asset-lesson',
          stampedPdf: 'ai-consumption-settings-content-indexing-asset-stamped_pdf',
          video: 'ai-consumption-settings-content-indexing-asset-video',
          files: 'ai-consumption-settings-content-indexing-asset-files',
        },
        assetIneligible: {
          quiz: 'ai-consumption-settings-content-indexing-asset-assetQuiz-disabled',
          externalVideo:
            'ai-consumption-settings-content-indexing-asset-external_video-disabled',
          scorm: 'ai-consumption-settings-content-indexing-asset-scorm-disabled',
          games: 'ai-consumption-settings-content-indexing-asset-games-disabled',
        },
        status: {
          development:
            'ai-consumption-settings-content-indexing-status-development',
          released: 'ai-consumption-settings-content-indexing-status-released',
          suspended: 'ai-consumption-settings-content-indexing-status-suspended',
        },
        creditsModal: {
          container: 'ai-consumption-settings-content-indexing-credits-modal',
          confirmButton:
            'ai-consumption-settings-content-indexing-credits-modal-confirm-button',
          cancelButton:
            'ai-consumption-settings-content-indexing-credits-modal-cancel-button',
          closeButton:
            'ai-consumption-settings-content-indexing-credits-modal-close-button',
          summaryBox:
            'ai-consumption-settings-content-indexing-credits-summary-box',
          currentBalanceText:
            'ai-consumption-settings-content-indexing-current-balance-text',
        },
      },
    },
  },
} as const;

/**
 * Tooltips esperados (CLAUDE.md §5: asserção de texto).
 *
 * NOTA: alguns textos divergem do XML do TestLink (achado de produto registrado
 * nos planos). Aqui registramos o texto observado em produção em
 * stage10.stage.twygoead.com em 2026-04 — quando alinhado com produto, atualizar.
 */
export const TOOLTIP_TEXTS = {
  contentIndexingMaster:
    'Configure como a IA aprende com seus conteúdos. A indexação tem um custo inicial de créditos maior devido ao aprendizado, mas torna as operações futuras (como agente de atendimento, geração de questionários e outras funcionalidades) significativamente mais rápidas e econômicas.',
  period:
    'Caso seja habilitado, a IA irá considerar apenas o período que o usuário inserir',
  agenteAtendimento:
    'Agente de atendimento com respostas automatizadas, utilizando fontes de conhecimento configuráveis.',
  knowledgeSourceInternal:
    'Utiliza conteúdos do seu ambiente como fonte de conhecimento. Para utilizar esta fonte, é necessário habilitar a indexação de conteúdo acima.',
  knowledgeSourceExternal:
    'Utiliza conteúdos públicos da internet como fonte de conhecimento.',
} as const;

export const SYNC_ALERT_TEXT =
  'Existe uma sincronização de conteúdo em andamento. Aguarde a finalização para editar as configurações de indexação.';

export const INHERITED_EDIT_BLOCK_TOOLTIP =
  'Este ambiente está herdando configurações do ambiente principal. Desative a herança para editar.';
