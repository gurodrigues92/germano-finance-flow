-- Correção da função com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_salon()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '';