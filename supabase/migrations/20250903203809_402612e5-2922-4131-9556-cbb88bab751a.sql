-- Enable REPLICA IDENTITY FULL for complete row data in realtime updates
ALTER TABLE public.clientes REPLICA IDENTITY FULL;
ALTER TABLE public.profissionais REPLICA IDENTITY FULL;
ALTER TABLE public.agendamentos REPLICA IDENTITY FULL;
ALTER TABLE public.comandas REPLICA IDENTITY FULL;
ALTER TABLE public.comanda_itens REPLICA IDENTITY FULL;
ALTER TABLE public.servicos REPLICA IDENTITY FULL;
ALTER TABLE public.produtos REPLICA IDENTITY FULL;
ALTER TABLE public.movimentacao_estoque REPLICA IDENTITY FULL;
ALTER TABLE public.bloqueios_agenda REPLICA IDENTITY FULL;

-- Add tables to supabase_realtime publication for realtime functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.clientes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profissionais;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agendamentos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comandas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comanda_itens;
ALTER PUBLICATION supabase_realtime ADD TABLE public.servicos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.produtos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.movimentacao_estoque;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bloqueios_agenda;