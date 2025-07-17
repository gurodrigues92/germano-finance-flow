-- Continuação das políticas RLS para as demais tabelas

-- Criar políticas específicas por usuário para PRODUTOS
CREATE POLICY "Users can view their own produtos" ON public.produtos
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own produtos" ON public.produtos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own produtos" ON public.produtos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own produtos" ON public.produtos
FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas específicas por usuário para MOVIMENTAÇÃO ESTOQUE
CREATE POLICY "Users can view their own movimentacao_estoque" ON public.movimentacao_estoque
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movimentacao_estoque" ON public.movimentacao_estoque
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movimentacao_estoque" ON public.movimentacao_estoque
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movimentacao_estoque" ON public.movimentacao_estoque
FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas específicas por usuário para RESERVA EMERGÊNCIA
CREATE POLICY "Users can view their own reserva_emergencia" ON public.reserva_emergencia
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reserva_emergencia" ON public.reserva_emergencia
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reserva_emergencia" ON public.reserva_emergencia
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reserva_emergencia" ON public.reserva_emergencia
FOR DELETE USING (auth.uid() = user_id);

-- Criar políticas específicas por usuário para RELATÓRIOS SALVOS
CREATE POLICY "Users can view their own relatorios_salvos" ON public.relatorios_salvos
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own relatorios_salvos" ON public.relatorios_salvos
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own relatorios_salvos" ON public.relatorios_salvos
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own relatorios_salvos" ON public.relatorios_salvos
FOR DELETE USING (auth.uid() = user_id);