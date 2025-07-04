-- Criar tabela para metas financeiras
CREATE TABLE public.metas_financeiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- 'receita', 'economia', 'investimento', 'personalizada'
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  valor_meta DECIMAL(10,2) NOT NULL,
  valor_atual DECIMAL(10,2) DEFAULT 0,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  categoria VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ativa', -- 'ativa', 'concluida', 'cancelada'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.metas_financeiras ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS (públicas para agora, mas preparado para autenticação futura)
CREATE POLICY "Permitir todas as operações em metas_financeiras" 
ON public.metas_financeiras 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_metas_financeiras_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para updated_at
CREATE TRIGGER update_metas_financeiras_updated_at
  BEFORE UPDATE ON public.metas_financeiras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_metas_financeiras_updated_at();

-- Criar tabela para relatórios salvos
CREATE TABLE public.relatorios_salvos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'mensal', 'trimestral', 'anual', 'personalizado'
  configuracao JSONB NOT NULL, -- Configurações do relatório (filtros, período, etc.)
  data_inicio DATE,
  data_fim DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.relatorios_salvos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Permitir todas as operações em relatorios_salvos" 
ON public.relatorios_salvos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_relatorios_salvos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para updated_at
CREATE TRIGGER update_relatorios_salvos_updated_at
  BEFORE UPDATE ON public.relatorios_salvos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_relatorios_salvos_updated_at();