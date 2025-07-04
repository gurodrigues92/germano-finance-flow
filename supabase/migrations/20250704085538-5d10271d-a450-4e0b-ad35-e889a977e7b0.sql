-- Criar tabela para custos fixos
CREATE TABLE public.custos_fixos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  categoria TEXT NOT NULL,
  subcategoria TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  mes_referencia DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custos_fixos ENABLE ROW LEVEL SECURITY;

-- Create policies for access (public for now, can be restricted later)
CREATE POLICY "Allow all access to custos_fixos" 
ON public.custos_fixos 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_custos_fixos_updated_at
BEFORE UPDATE ON public.custos_fixos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();