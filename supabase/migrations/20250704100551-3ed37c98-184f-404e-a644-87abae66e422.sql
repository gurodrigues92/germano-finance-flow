-- Inserir dados de exemplo para custos fixos dos últimos 5 meses (Agosto 2024 a Dezembro 2024)

-- Custos de Agosto 2024
INSERT INTO public.custos_fixos (categoria, subcategoria, valor, observacoes, mes_referencia) VALUES
('Infraestrutura', 'Aluguel', 2500.00, 'Aluguel mensal do salão', '2024-08-01'),
('Infraestrutura', 'Conta de Luz', 320.50, 'Energia elétrica do salão', '2024-08-01'),
('Infraestrutura', 'Conta de Água', 180.00, 'Água e esgoto', '2024-08-01'),
('Assinaturas', 'Internet', 120.00, 'Internet fibra 200MB', '2024-08-01'),
('Serviços Profissionais', 'Contabilidade', 350.00, 'Serviços contábeis mensais', '2024-08-01');

-- Custos de Setembro 2024
INSERT INTO public.custos_fixos (categoria, subcategoria, valor, observacoes, mes_referencia) VALUES
('Infraestrutura', 'Aluguel', 2500.00, 'Aluguel mensal do salão', '2024-09-01'),
('Infraestrutura', 'Conta de Luz', 340.75, 'Energia elétrica do salão', '2024-09-01'),
('Infraestrutura', 'Conta de Água', 185.30, 'Água e esgoto', '2024-09-01'),
('Assinaturas', 'Internet', 120.00, 'Internet fibra 200MB', '2024-09-01'),
('Serviços Profissionais', 'Contabilidade', 350.00, 'Serviços contábeis mensais', '2024-09-01'),
('Serviços Profissionais', 'Produtos de limpeza', 85.40, 'Produtos de higienização', '2024-09-01');

-- Custos de Outubro 2024
INSERT INTO public.custos_fixos (categoria, subcategoria, valor, observacoes, mes_referencia) VALUES
('Infraestrutura', 'Aluguel', 2500.00, 'Aluguel mensal do salão', '2024-10-01'),
('Infraestrutura', 'Conta de Luz', 365.20, 'Energia elétrica do salão', '2024-10-01'),
('Infraestrutura', 'Conta de Água', 195.80, 'Água e esgoto', '2024-10-01'),
('Assinaturas', 'Internet', 120.00, 'Internet fibra 200MB', '2024-10-01'),
('Serviços Profissionais', 'Contabilidade', 350.00, 'Serviços contábeis mensais', '2024-10-01'),
('Serviços Profissionais', 'Produtos de limpeza', 92.60, 'Produtos de higienização', '2024-10-01'),
('Assinaturas', 'Software/Apps', 89.90, 'Sistema de agendamento', '2024-10-01');

-- Custos de Novembro 2024
INSERT INTO public.custos_fixos (categoria, subcategoria, valor, observacoes, mes_referencia) VALUES
('Infraestrutura', 'Aluguel', 2500.00, 'Aluguel mensal do salão', '2024-11-01'),
('Infraestrutura', 'Conta de Luz', 410.30, 'Energia elétrica do salão - uso do ar condicionado', '2024-11-01'),
('Infraestrutura', 'Conta de Água', 205.50, 'Água e esgoto', '2024-11-01'),
('Assinaturas', 'Internet', 120.00, 'Internet fibra 200MB', '2024-11-01'),
('Serviços Profissionais', 'Contabilidade', 350.00, 'Serviços contábeis mensais', '2024-11-01'),
('Serviços Profissionais', 'Produtos de limpeza', 78.90, 'Produtos de higienização', '2024-11-01'),
('Assinaturas', 'Software/Apps', 89.90, 'Sistema de agendamento', '2024-11-01'),
('Serviços Profissionais', 'Manutenção de equipamentos', 150.00, 'Manutenção preventiva secadores', '2024-11-01');

-- Custos de Dezembro 2024
INSERT INTO public.custos_fixos (categoria, subcategoria, valor, observacoes, mes_referencia) VALUES
('Infraestrutura', 'Aluguel', 2500.00, 'Aluguel mensal do salão', '2024-12-01'),
('Infraestrutura', 'Conta de Luz', 450.80, 'Energia elétrica do salão - mês de maior movimento', '2024-12-01'),
('Infraestrutura', 'Conta de Água', 220.40, 'Água e esgoto', '2024-12-01'),
('Assinaturas', 'Internet', 120.00, 'Internet fibra 200MB', '2024-12-01'),
('Serviços Profissionais', 'Contabilidade', 350.00, 'Serviços contábeis mensais', '2024-12-01'),
('Serviços Profissionais', 'Produtos de limpeza', 95.20, 'Produtos de higienização', '2024-12-01'),
('Assinaturas', 'Software/Apps', 89.90, 'Sistema de agendamento', '2024-12-01'),
('Serviços Profissionais', 'Serviços de limpeza', 200.00, 'Limpeza profunda de fim de ano', '2024-12-01');