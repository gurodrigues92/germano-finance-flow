-- CORREÇÃO CRÍTICA: Adicionar user_id a todas as tabelas
-- Isso garante isolamento de dados por usuário

-- 1. Adicionar user_id às tabelas
ALTER TABLE public.custos_fixos 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.investimentos 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.metas_financeiras 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.produtos 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.movimentacao_estoque 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.reserva_emergencia 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.relatorios_salvos 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Criar índices para performance
CREATE INDEX idx_custos_fixos_user_id ON public.custos_fixos(user_id);
CREATE INDEX idx_investimentos_user_id ON public.investimentos(user_id);
CREATE INDEX idx_metas_financeiras_user_id ON public.metas_financeiras(user_id);
CREATE INDEX idx_produtos_user_id ON public.produtos(user_id);
CREATE INDEX idx_movimentacao_estoque_user_id ON public.movimentacao_estoque(user_id);
CREATE INDEX idx_reserva_emergencia_user_id ON public.reserva_emergencia(user_id);
CREATE INDEX idx_relatorios_salvos_user_id ON public.relatorios_salvos(user_id);