-- Criar função security definer para obter role do usuário atual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Remover políticas antigas da tabela transacoes
DROP POLICY IF EXISTS "Users can view their own transacoes" ON public.transacoes;
DROP POLICY IF EXISTS "Users can insert their own transacoes" ON public.transacoes;
DROP POLICY IF EXISTS "Users can update their own transacoes" ON public.transacoes;
DROP POLICY IF EXISTS "Users can delete their own transacoes" ON public.transacoes;

-- Criar novas políticas que permitem acesso completo para admins
CREATE POLICY "Admins can view all transacoes, assistentes only their own" 
ON public.transacoes 
FOR SELECT 
USING (
  public.get_current_user_role() = 'admin' 
  OR auth.uid() = user_id
);

CREATE POLICY "Admins can insert any transacao, assistentes only their own" 
ON public.transacoes 
FOR INSERT 
WITH CHECK (
  public.get_current_user_role() = 'admin' 
  OR auth.uid() = user_id
);

CREATE POLICY "Admins can update any transacao, assistentes only their own" 
ON public.transacoes 
FOR UPDATE 
USING (
  public.get_current_user_role() = 'admin' 
  OR auth.uid() = user_id
);

CREATE POLICY "Admins can delete any transacao, assistentes only their own" 
ON public.transacoes 
FOR DELETE 
USING (
  public.get_current_user_role() = 'admin' 
  OR auth.uid() = user_id
);