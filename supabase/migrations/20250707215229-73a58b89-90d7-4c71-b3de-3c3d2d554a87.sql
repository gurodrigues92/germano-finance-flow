-- Remove insecure "allow all access" policies and implement proper RLS
-- This migration secures all tables to require authentication

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Allow all access to transacoes" ON public.transacoes;
DROP POLICY IF EXISTS "Allow all access to custos_fixos" ON public.custos_fixos;
DROP POLICY IF EXISTS "Allow all access to investimentos" ON public.investimentos;
DROP POLICY IF EXISTS "Allow all access to produtos" ON public.produtos;
DROP POLICY IF EXISTS "Allow all access to movimentacao_estoque" ON public.movimentacao_estoque;
DROP POLICY IF EXISTS "Allow all access to reserva_emergencia" ON public.reserva_emergencia;
DROP POLICY IF EXISTS "Permitir todas as operações em metas_financeiras" ON public.metas_financeiras;
DROP POLICY IF EXISTS "Permitir todas as operações em relatorios_salvos" ON public.relatorios_salvos;

-- Create secure policies that require authentication for transacoes
CREATE POLICY "Authenticated users can manage transacoes" 
ON public.transacoes 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for custos_fixos
CREATE POLICY "Authenticated users can manage custos_fixos" 
ON public.custos_fixos 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for investimentos
CREATE POLICY "Authenticated users can manage investimentos" 
ON public.investimentos 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for produtos
CREATE POLICY "Authenticated users can manage produtos" 
ON public.produtos 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for movimentacao_estoque
CREATE POLICY "Authenticated users can manage movimentacao_estoque" 
ON public.movimentacao_estoque 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for reserva_emergencia
CREATE POLICY "Authenticated users can manage reserva_emergencia" 
ON public.reserva_emergencia 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for metas_financeiras
CREATE POLICY "Authenticated users can manage metas_financeiras" 
ON public.metas_financeiras 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies that require authentication for relatorios_salvos
CREATE POLICY "Authenticated users can manage relatorios_salvos" 
ON public.relatorios_salvos 
FOR ALL 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);