-- CORREÇÃO 1: Reduzir tempo de expiração do OTP para 5 minutos (300 segundos)
-- CORREÇÃO 2: Habilitar proteção contra senhas vazadas
-- CORREÇÃO 3: Definir política de senha forte

-- Configurar tempo de expiração do OTP para 5 minutos
UPDATE auth.config 
SET otp_exp = 300 
WHERE true;

-- Habilitar proteção contra senhas vazadas
UPDATE auth.config 
SET password_min_length = 8,
    password_leaked_password_protection = true
WHERE true;

-- Adicionar configurações de segurança adicionais
UPDATE auth.config 
SET 
  max_password_length = 128,
  password_requirements = 'lower,upper,number,special'
WHERE true;