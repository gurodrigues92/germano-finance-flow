-- Habilitar realtime para a tabela transacoes
-- Configurar REPLICA IDENTITY para capturar dados completos durante updates
ALTER TABLE public.transacoes REPLICA IDENTITY FULL;

-- Adicionar a tabela à publicação do realtime
-- Isso permite que o frontend receba notificações em tempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.transacoes;