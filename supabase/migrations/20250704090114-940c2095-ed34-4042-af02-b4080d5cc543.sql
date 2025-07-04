-- Criar tabela de produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  unidade_medida VARCHAR(20) NOT NULL,
  estoque_minimo INTEGER NOT NULL,
  estoque_atual INTEGER DEFAULT 0,
  valor_unitario DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de movimentação de estoque
CREATE TABLE public.movimentacao_estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida')),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  motivo VARCHAR(100),
  fornecedor VARCHAR(100),
  valor_total DECIMAL(10,2),
  data_movimentacao DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movimentacao_estoque ENABLE ROW LEVEL SECURITY;

-- Create policies for produtos
CREATE POLICY "Allow all access to produtos" 
ON public.produtos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for movimentacao_estoque
CREATE POLICY "Allow all access to movimentacao_estoque" 
ON public.movimentacao_estoque 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates on produtos
CREATE TRIGGER update_produtos_updated_at
BEFORE UPDATE ON public.produtos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update estoque_atual when movimentacao happens
CREATE OR REPLACE FUNCTION public.update_estoque_atual()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update estoque_atual
CREATE TRIGGER trigger_update_estoque_atual
AFTER INSERT OR DELETE ON public.movimentacao_estoque
FOR EACH ROW
EXECUTE FUNCTION public.update_estoque_atual();