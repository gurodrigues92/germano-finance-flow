-- FASE 1: Criação das tabelas base para gestão de salão
-- ⚠️ CRÍTICO: Preservar completamente todas as tabelas existentes

-- Tabela de Clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  foto_url TEXT,
  data_nascimento DATE,
  endereco TEXT,
  saldo DECIMAL(10,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Tabela de Profissionais
CREATE TABLE public.profissionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100),
  foto_url TEXT,
  tipo VARCHAR(50) NOT NULL, -- 'cabeleireiro', 'assistente', 'recepcionista'
  percentual_comissao DECIMAL(5,2) NOT NULL DEFAULT 40.00,
  horario_trabalho JSONB, -- horários de trabalho por dia da semana
  cor_agenda VARCHAR(7) DEFAULT '#8B5CF6', -- cor para identificação na agenda
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Tabela de Serviços
CREATE TABLE public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  categoria VARCHAR(100) NOT NULL, -- 'Corte', 'Coloração', 'Tratamentos', etc.
  preco DECIMAL(10,2) NOT NULL,
  duracao_minutos INTEGER NOT NULL DEFAULT 60,
  descricao TEXT,
  cor_categoria VARCHAR(7) DEFAULT '#8B5CF6', -- cor para identificação
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Tabela de Agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'agendado', -- 'agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado'
  observacoes TEXT,
  valor DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Tabela de Comandas (Sistema de Caixa)
CREATE TABLE public.comandas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_comanda SERIAL, -- número sequencial para identificação
  cliente_id UUID REFERENCES public.clientes(id),
  profissional_principal_id UUID REFERENCES public.profissionais(id),
  data_abertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_fechamento TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) NOT NULL DEFAULT 'aberta', -- 'aberta', 'fechada', 'cancelada'
  total_bruto DECIMAL(10,2) NOT NULL DEFAULT 0,
  desconto DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_liquido DECIMAL(10,2) NOT NULL DEFAULT 0,
  observacoes TEXT,
  -- Métodos de pagamento (para integração com transações)
  dinheiro DECIMAL(10,2) NOT NULL DEFAULT 0,
  pix DECIMAL(10,2) NOT NULL DEFAULT 0,
  debito DECIMAL(10,2) NOT NULL DEFAULT 0,
  credito DECIMAL(10,2) NOT NULL DEFAULT 0,
  -- Referência para transação criada automaticamente
  transacao_id UUID REFERENCES public.transacoes(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Tabela de Itens da Comanda
CREATE TABLE public.comanda_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comanda_id UUID NOT NULL REFERENCES public.comandas(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL, -- 'servico' ou 'produto'
  item_id UUID NOT NULL, -- ID do serviço ou produto
  nome_item VARCHAR(200) NOT NULL, -- nome do item no momento da venda
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10,2) NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  profissional_id UUID REFERENCES public.profissionais(id), -- profissional que realizou o serviço
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de associação Profissionais x Serviços
CREATE TABLE public.profissional_servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profissional_id, servico_id)
);

-- Tabela de Bloqueios de Agenda
CREATE TABLE public.bloqueios_agenda (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- 'almoco', 'falta', 'indisponivel', 'folga'
  motivo TEXT,
  cor VARCHAR(7) DEFAULT '#6B7280', -- cor para exibição na agenda
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comanda_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissional_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloqueios_agenda ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Clientes
CREATE POLICY "Users can view their own clientes" ON public.clientes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own clientes" ON public.clientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clientes" ON public.clientes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clientes" ON public.clientes
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Profissionais
CREATE POLICY "Users can view their own profissionais" ON public.profissionais
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profissionais" ON public.profissionais
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profissionais" ON public.profissionais
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profissionais" ON public.profissionais
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Serviços
CREATE POLICY "Users can view their own servicos" ON public.servicos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own servicos" ON public.servicos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own servicos" ON public.servicos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own servicos" ON public.servicos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Agendamentos
CREATE POLICY "Users can view their own agendamentos" ON public.agendamentos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own agendamentos" ON public.agendamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own agendamentos" ON public.agendamentos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own agendamentos" ON public.agendamentos
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Comandas
CREATE POLICY "Users can view their own comandas" ON public.comandas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own comandas" ON public.comandas
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comandas" ON public.comandas
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comandas" ON public.comandas
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para Comanda Itens
CREATE POLICY "Users can view comanda_itens through comandas" ON public.comanda_itens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.comandas 
      WHERE comandas.id = comanda_itens.comanda_id 
      AND comandas.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert comanda_itens through comandas" ON public.comanda_itens
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.comandas 
      WHERE comandas.id = comanda_itens.comanda_id 
      AND comandas.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update comanda_itens through comandas" ON public.comanda_itens
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.comandas 
      WHERE comandas.id = comanda_itens.comanda_id 
      AND comandas.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete comanda_itens through comandas" ON public.comanda_itens
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.comandas 
      WHERE comandas.id = comanda_itens.comanda_id 
      AND comandas.user_id = auth.uid()
    )
  );

-- Políticas RLS para Profissional Serviços
CREATE POLICY "Users can view profissional_servicos through profissionais" ON public.profissional_servicos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profissionais 
      WHERE profissionais.id = profissional_servicos.profissional_id 
      AND profissionais.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert profissional_servicos through profissionais" ON public.profissional_servicos
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profissionais 
      WHERE profissionais.id = profissional_servicos.profissional_id 
      AND profissionais.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete profissional_servicos through profissionais" ON public.profissional_servicos
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profissionais 
      WHERE profissionais.id = profissional_servicos.profissional_id 
      AND profissionais.user_id = auth.uid()
    )
  );

-- Políticas RLS para Bloqueios de Agenda
CREATE POLICY "Users can view their own bloqueios_agenda" ON public.bloqueios_agenda
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bloqueios_agenda" ON public.bloqueios_agenda
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bloqueios_agenda" ON public.bloqueios_agenda
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own bloqueios_agenda" ON public.bloqueios_agenda
  FOR DELETE USING (auth.uid() = user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_salon()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_salon();

CREATE TRIGGER update_profissionais_updated_at
  BEFORE UPDATE ON public.profissionais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_salon();

CREATE TRIGGER update_servicos_updated_at
  BEFORE UPDATE ON public.servicos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_salon();

CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_salon();

CREATE TRIGGER update_comandas_updated_at
  BEFORE UPDATE ON public.comandas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_salon();

-- Índices para performance
CREATE INDEX idx_clientes_nome ON public.clientes(nome);
CREATE INDEX idx_clientes_telefone ON public.clientes(telefone);
CREATE INDEX idx_clientes_ativo ON public.clientes(ativo);

CREATE INDEX idx_profissionais_tipo ON public.profissionais(tipo);
CREATE INDEX idx_profissionais_ativo ON public.profissionais(ativo);

CREATE INDEX idx_servicos_categoria ON public.servicos(categoria);
CREATE INDEX idx_servicos_ativo ON public.servicos(ativo);

CREATE INDEX idx_agendamentos_data ON public.agendamentos(data);
CREATE INDEX idx_agendamentos_status ON public.agendamentos(status);
CREATE INDEX idx_agendamentos_profissional ON public.agendamentos(profissional_id);

CREATE INDEX idx_comandas_status ON public.comandas(status);
CREATE INDEX idx_comandas_data_abertura ON public.comandas(data_abertura);

CREATE INDEX idx_bloqueios_data ON public.bloqueios_agenda(data);
CREATE INDEX idx_bloqueios_profissional ON public.bloqueios_agenda(profissional_id);