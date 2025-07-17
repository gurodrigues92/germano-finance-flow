-- Corrigir funções existentes adicionando search_path para segurança
-- Esta correção previne ataques de search path injection

-- Atualizar função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Atualizar função update_metas_financeiras_updated_at
CREATE OR REPLACE FUNCTION public.update_metas_financeiras_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Atualizar função update_relatorios_salvos_updated_at
CREATE OR REPLACE FUNCTION public.update_relatorios_salvos_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Atualizar função update_estoque_atual
CREATE OR REPLACE FUNCTION public.update_estoque_atual()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.tipo = 'entrada' THEN
      UPDATE public.produtos 
      SET estoque_atual = estoque_atual + NEW.quantidade 
      WHERE id = NEW.produto_id;
    ELSIF NEW.tipo = 'saida' THEN
      UPDATE public.produtos 
      SET estoque_atual = estoque_atual - NEW.quantidade 
      WHERE id = NEW.produto_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.tipo = 'entrada' THEN
      UPDATE public.produtos 
      SET estoque_atual = estoque_atual - OLD.quantidade 
      WHERE id = OLD.produto_id;
    ELSIF OLD.tipo = 'saida' THEN
      UPDATE public.produtos 
      SET estoque_atual = estoque_atual + OLD.quantidade 
      WHERE id = OLD.produto_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;