// Mapeamento de nomenclaturas para o sistema
export const NOMENCLATURE = {
  // Nomes dos sócios/participantes
  PROFISSIONAL: 'Profissional',
  ASSISTENTE: 'Assistente',
  STUDIO: 'Studio',
  
  // Labels para interface
  PROFISSIONAL_LABEL: 'Profissional',
  ASSISTENTE_LABEL: 'Assistente',
  STUDIO_LABEL: 'Studio Germano',
  
  // Cores para gráficos (mantendo as existentes)
  COLORS: {
    PROFISSIONAL: '#3b82f6', // azul (antiga cor do Edu)
    ASSISTENTE: '#ef4444',   // vermelho (antiga cor do Kam)
    STUDIO: '#10b981',       // verde (cor do studio)
    DINHEIRO: '#10b981',
    PIX: '#3b82f6',
    DEBITO: '#8b5cf6',
    CREDITO: '#ef4444'
  }
} as const;

// Helper para obter label baseado na key
export const getShareLabel = (key: 'edu_share' | 'kam_share' | 'studio_share'): string => {
  switch (key) {
    case 'edu_share':
      return NOMENCLATURE.PROFISSIONAL_LABEL;
    case 'kam_share':
      return NOMENCLATURE.ASSISTENTE_LABEL;
    case 'studio_share':
      return NOMENCLATURE.STUDIO_LABEL;
    default:
      return key;
  }
};

// Helper para obter cor baseada na key
export const getShareColor = (key: 'edu_share' | 'kam_share' | 'studio_share'): string => {
  switch (key) {
    case 'edu_share':
      return NOMENCLATURE.COLORS.PROFISSIONAL;
    case 'kam_share':
      return NOMENCLATURE.COLORS.ASSISTENTE;
    case 'studio_share':
      return NOMENCLATURE.COLORS.STUDIO;
    default:
      return '#gray-500';
  }
};