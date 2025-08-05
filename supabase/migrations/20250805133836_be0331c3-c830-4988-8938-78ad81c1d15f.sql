-- FASE 1: Preparação do Banco de Dados
-- Adicionar campos opcionais na tabela transacoes sem quebrar funcionalidade atual

ALTER TABLE public.transacoes 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS cliente_id UUID REFERENCES public.clientes(id),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'fechada',
ADD COLUMN IF NOT EXISTS observacoes TEXT,
ADD COLUMN IF NOT EXISTS comanda_id UUID;

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON public.transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_transacoes_status ON public.transacoes(status);
CREATE INDEX IF NOT EXISTS idx_transacoes_cliente_id ON public.transacoes(cliente_id);

-- Comentários para documentação
COMMENT ON COLUMN public.transacoes.tipo IS 'Tipo da transação: manual (inserida diretamente) ou comanda (vinda do fechamento de comanda)';
COMMENT ON COLUMN public.transacoes.status IS 'Status da transação: aberta (comanda em andamento) ou fechada (pagamento finalizado)';
COMMENT ON COLUMN public.transacoes.cliente_id IS 'ID do cliente quando a transação vem de uma comanda';
COMMENT ON COLUMN public.transacoes.observacoes IS 'Observações adicionais da transação';
COMMENT ON COLUMN public.transacoes.comanda_id IS 'ID da comanda original quando aplicável';