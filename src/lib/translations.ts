// Dicionário de traduções para padronizar textos do sistema
export const translations = {
  // Ações básicas
  actions: {
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    add: "Adicionar",
    create: "Criar",
    update: "Atualizar",
    submit: "Enviar",
    clear: "Limpar",
    reset: "Resetar",
    search: "Buscar",
    filter: "Filtrar",
    loading: "Carregando...",
    saving: "Salvando...",
    deleting: "Excluindo...",
    updating: "Atualizando...",
    creating: "Criando...",
    confirm: "Confirmar",
    close: "Fechar",
    back: "Voltar",
    next: "Próximo",
    previous: "Anterior",
    refresh: "Atualizar",
    export: "Exportar",
    import: "Importar",
    download: "Baixar",
    upload: "Enviar",
    print: "Imprimir",
    share: "Compartilhar",
    copy: "Copiar",
    view: "Visualizar",
    details: "Detalhes",
    settings: "Configurações",
    help: "Ajuda"
  },

  // Placeholders comuns
  placeholders: {
    search: "Buscar...",
    searchProducts: "Buscar produtos...",
    searchClients: "Buscar clientes...",
    searchProfessionals: "Buscar profissionais...",
    searchServices: "Buscar serviços...",
    selectClient: "Selecione um cliente",
    selectProfessional: "Selecione um profissional",
    selectService: "Selecione um serviço",
    selectProduct: "Selecione um produto",
    selectCategory: "Selecione uma categoria",
    selectDate: "Selecione uma data",
    selectTime: "Selecione um horário",
    enterName: "Digite o nome",
    enterEmail: "Digite o e-mail",
    enterPhone: "Digite o telefone",
    enterAddress: "Digite o endereço",
    enterObservations: "Digite observações",
    enterDescription: "Digite uma descrição",
    enterValue: "Digite um valor",
    enterQuantity: "Digite a quantidade",
    enterPassword: "Digite a senha",
    confirmPassword: "Confirme a senha",
    optional: "(opcional)",
    required: "(obrigatório)"
  },

  // Status e estados
  status: {
    active: "Ativo",
    inactive: "Inativo",
    pending: "Pendente",
    completed: "Concluído",
    cancelled: "Cancelado",
    confirmed: "Confirmado",
    scheduled: "Agendado",
    inProgress: "Em andamento",
    finished: "Finalizado",
    open: "Aberto",
    closed: "Fechado",
    paid: "Pago",
    unpaid: "Não pago",
    available: "Disponível",
    unavailable: "Indisponível",
    online: "Online",
    offline: "Offline",
    success: "Sucesso",
    error: "Erro",
    warning: "Aviso",
    info: "Informação"
  },

  // Navegação e menu
  navigation: {
    dashboard: "Dashboard",
    agenda: "Agenda",
    clients: "Clientes",
    professionals: "Profissionais",
    services: "Serviços",
    products: "Produtos",
    stock: "Estoque",
    cashier: "Caixa",
    finance: "Financeiro",
    reports: "Relatórios",
    analysis: "Análises",
    expenses: "Despesas",
    transactions: "Transações",
    archive: "Arquivo",
    settings: "Configurações",
    profile: "Perfil",
    logout: "Sair",
    home: "Início",
    calendar: "Calendário",
    absences: "Ausências",
    holidays: "Feriados",
    notifications: "Notificações"
  },

  // Formulários
  forms: {
    personalInfo: "Informações Pessoais",
    contactInfo: "Informações de Contato",
    workSchedule: "Horários de Trabalho",
    basicInfo: "Informações Básicas",
    additionalInfo: "Informações Adicionais",
    required: "Campos obrigatórios",
    optional: "Campos opcionais",
    saveChanges: "Salvar Alterações",
    discardChanges: "Descartar Alterações",
    unsavedChanges: "Alterações não salvas",
    formValid: "Formulário válido",
    formInvalid: "Formulário inválido",
    fieldRequired: "Este campo é obrigatório",
    invalidEmail: "E-mail inválido",
    invalidPhone: "Telefone inválido",
    invalidDate: "Data inválida",
    invalidValue: "Valor inválido"
  },

  // Mensagens do sistema
  messages: {
    success: {
      created: "Criado com sucesso!",
      updated: "Atualizado com sucesso!",
      deleted: "Excluído com sucesso!",
      saved: "Salvo com sucesso!",
      sent: "Enviado com sucesso!",
      copied: "Copiado para a área de transferência!",
      exported: "Exportado com sucesso!",
      imported: "Importado com sucesso!"
    },
    error: {
      generic: "Ocorreu um erro inesperado",
      network: "Erro de conexão com o servidor",
      validation: "Erro de validação dos dados",
      permission: "Você não tem permissão para esta ação",
      notFound: "Item não encontrado",
      timeout: "Operação expirou. Tente novamente",
      fileSize: "Arquivo muito grande",
      fileType: "Tipo de arquivo não suportado"
    },
    confirmation: {
      delete: "Tem certeza que deseja excluir?",
      discard: "Tem certeza que deseja descartar as alterações?",
      logout: "Tem certeza que deseja sair?",
      cancel: "Tem certeza que deseja cancelar?",
      continue: "Deseja continuar?"
    },
    info: {
      loading: "Carregando dados...",
      noData: "Nenhum dado encontrado",
      empty: "Lista vazia",
      selectItems: "Selecione os itens",
      allSelected: "Todos os itens selecionados",
      noneSelected: "Nenhum item selecionado"
    }
  },

  // Unidades e medidas
  units: {
    currency: "R$",
    percentage: "%",
    minutes: "min",
    hours: "h",
    days: "dias",
    weeks: "semanas",
    months: "meses",
    years: "anos",
    pieces: "un",
    kilograms: "kg",
    grams: "g",
    liters: "L",
    milliliters: "ml"
  },

  // Dias da semana
  weekDays: {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
    short: {
      monday: "Seg",
      tuesday: "Ter",
      wednesday: "Qua",
      thursday: "Qui",
      friday: "Sex",
      saturday: "Sáb",
      sunday: "Dom"
    }
  },

  // Meses
  months: {
    january: "Janeiro",
    february: "Fevereiro",
    march: "Março",
    april: "Abril",
    may: "Maio",
    june: "Junho",
    july: "Julho",
    august: "Agosto",
    september: "Setembro",
    october: "Outubro",
    november: "Novembro",
    december: "Dezembro",
    short: {
      january: "Jan",
      february: "Fev",
      march: "Mar",
      april: "Abr",
      may: "Mai",
      june: "Jun",
      july: "Jul",
      august: "Ago",
      september: "Set",
      october: "Out",
      november: "Nov",
      december: "Dez"
    }
  }
};

// Hook para usar traduções
export const useTranslations = () => {
  return translations;
};