-- ATUALIZAR POLÍTICAS RLS PARA ISOLAMENTO POR USUÁRIO

-- Remover políticas antigas
DROP POLICY IF EXISTS "Authenticated users can manage custos_fixos" ON public.custos_fixos;
DROP POLICY IF EXISTS "Authenticated users can manage investimentos" ON public.investimentos;
DROP POLICY IF EXISTS "Authenticated users can manage metas_financeiras" ON public.metas_financeiras;
DROP POLICY IF EXISTS "Authenticated users can manage produtos" ON public.produtos;
DROP POLICY IF EXISTS "Authenticated users can manage movimentacao_estoque" ON public.movimentacao_estoque;
DROP POLICY IF EXISTS "Authenticated users can manage reserva_emergencia" ON public.reserva_emergencia;
DROP POLICY IF EXISTS "Authenticated users can manage relatorios_salvos" ON public.relatorios_salvos;

-- Criar políticas específicas por usuário para CUSTOS FIXOS
CREATE POLICY "Users can view their own custos_fixos" ON public.custos_fixos
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own custos_fixos" ON public.custos_fixos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own custos_fixos" ON public.custos_fixos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own custos_fixos" ON public.custos_fixos
FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas específicas por usuário para INVESTIMENTOS
CREATE POLICY "Users can view their own investimentos" ON public.investimentos
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investimentos" ON public.investimentos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investimentos" ON public.investimentos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investimentos" ON public.investimentos
FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas específicas por usuário para METAS FINANCEIRAS
CREATE POLICY "Users can view their own metas_financeiras" ON public.metas_financeiras
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metas_financeiras" ON public.metas_financeiras
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metas_financeiras" ON public.metas_financeiras
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metas_financeiras" ON public.metas_financeiras
FOR DELETE USING (auth.uid() = user_id);