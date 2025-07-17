-- Adicionar colunas para custom rates nas transações
ALTER TABLE public.transacoes 
ADD COLUMN custom_rates JSONB DEFAULT NULL;

-- Adicionar comentário para documentar a estrutura esperada
COMMENT ON COLUMN public.transacoes.custom_rates IS 'JSON contendo taxas customizadas: {"studioRate": 60, "eduRate": 40, "kamRate": 10, "assistenteCalculationMode": "percentage_of_profissional"}';

-- Criar índice para busca mais eficiente quando necessário
CREATE INDEX IF NOT EXISTS idx_transacoes_custom_rates ON public.transacoes USING GIN(custom_rates) 
WHERE custom_rates IS NOT NULL;