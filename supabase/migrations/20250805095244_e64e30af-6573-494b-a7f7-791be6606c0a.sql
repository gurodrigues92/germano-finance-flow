-- Add new fields to transacoes table for professional tracking and assistant fees
ALTER TABLE public.transacoes 
ADD COLUMN profissional_id uuid REFERENCES public.profissionais(id),
ADD COLUMN tem_assistente boolean DEFAULT false,
ADD COLUMN assistente_taxa numeric DEFAULT 0;

-- Create index for better performance on professional queries
CREATE INDEX idx_transacoes_profissional_id ON public.transacoes(profissional_id);

-- Add comments for documentation
COMMENT ON COLUMN public.transacoes.profissional_id IS 'ID do profissional responsável pela transação (opcional)';
COMMENT ON COLUMN public.transacoes.tem_assistente IS 'Indica se a transação teve assistente';
COMMENT ON COLUMN public.transacoes.assistente_taxa IS 'Taxa cobrada pelo assistente (valor absoluto)';