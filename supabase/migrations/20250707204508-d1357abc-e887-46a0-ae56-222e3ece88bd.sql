-- Criar tabela para transações financeiras
CREATE TABLE public.transacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  dinheiro DECIMAL(10,2) NOT NULL DEFAULT 0,
  pix DECIMAL(10,2) NOT NULL DEFAULT 0,
  debito DECIMAL(10,2) NOT NULL DEFAULT 0,
  credito DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_bruto DECIMAL(10,2) NOT NULL,
  taxa_debito DECIMAL(10,2) NOT NULL DEFAULT 0,
  taxa_credito DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_liquido DECIMAL(10,2) NOT NULL,
  studio_share DECIMAL(10,2) NOT NULL,
  edu_share DECIMAL(10,2) NOT NULL,
  kam_share DECIMAL(10,2) NOT NULL,
  mes_referencia TEXT NOT NULL, -- formato YYYY-MM
  ano INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

-- Create policies for access (public for now, can be restricted later)
CREATE POLICY "Allow all access to transacoes" 
ON public.transacoes 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transacoes_updated_at
BEFORE UPDATE ON public.transacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_transacoes_mes_referencia ON public.transacoes(mes_referencia);
CREATE INDEX idx_transacoes_ano ON public.transacoes(ano);
CREATE INDEX idx_transacoes_data ON public.transacoes(data);