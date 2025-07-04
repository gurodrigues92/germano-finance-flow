-- Criar tabela de investimentos
CREATE TABLE public.investimentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria VARCHAR(50) NOT NULL,
  subcategoria VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data_compra DATE NOT NULL,
  fornecedor VARCHAR(100),
  garantia_meses INTEGER,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de reserva de emergência
CREATE TABLE public.reserva_emergencia (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valor_atual DECIMAL(10,2) NOT NULL,
  meta_valor DECIMAL(10,2) NOT NULL,
  mes_referencia DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reserva_emergencia ENABLE ROW LEVEL SECURITY;

-- Create policies for investimentos
CREATE POLICY "Allow all access to investimentos" 
ON public.investimentos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create policies for reserva_emergencia
CREATE POLICY "Allow all access to reserva_emergencia" 
ON public.reserva_emergencia 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates on investimentos
CREATE TRIGGER update_investimentos_updated_at
BEFORE UPDATE ON public.investimentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on reserva_emergencia
CREATE TRIGGER update_reserva_emergencia_updated_at
BEFORE UPDATE ON public.reserva_emergencia
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();