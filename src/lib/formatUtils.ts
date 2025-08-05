export const formatCompactCurrency = (value: number, isMobile: boolean = false, showSymbol: boolean = false) => {
  if (!isMobile || value < 999) {
    if (showSymbol) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    }
    return new Intl.NumberFormat('pt-BR').format(value);
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 999) {
    return `${sign}${(abs / 1_000).toFixed(1)}K`;
  }
  
  if (showSymbol) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatCurrency = (value: number, showSymbol: boolean = false) => {
  if (showSymbol) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};