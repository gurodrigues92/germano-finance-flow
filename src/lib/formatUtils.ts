export const formatCompactCurrency = (value: number, isMobile: boolean = false) => {
  if (!isMobile || value < 1000) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (abs >= 1_000_000_000) {
    return `${sign}R$ ${(abs / 1_000_000_000).toFixed(1)}B`;
  } else if (abs >= 1_000_000) {
    return `${sign}R$ ${(abs / 1_000_000).toFixed(1)}M`;
  } else if (abs >= 1_000) {
    return `${sign}R$ ${(abs / 1_000).toFixed(1)}K`;
  }
  
  return `${sign}R$ ${abs.toFixed(0)}`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};