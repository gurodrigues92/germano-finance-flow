-- Criar enum para roles de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'assistente');

-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'assistente',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfis
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  user_role public.user_role;
BEGIN
  -- Obter email do usuário
  user_email := NEW.email;
  
  -- Determinar role baseado no email
  IF user_email IN ('gurodrigues92@gmail.com', 'eduardo.germano15@gmail.com') THEN
    user_role := 'admin';
    -- Definir nome baseado no email
    IF user_email = 'gurodrigues92@gmail.com' THEN
      user_name := 'Gustavo Rodrigues';
    ELSE
      user_name := 'Eduardo Germano';
    END IF;
  ELSIF user_email = 'kamlley_zapata@outlook.com' THEN
    user_role := 'assistente';
    user_name := 'Kamlley Zapata';
  ELSE
    user_role := 'assistente';
    user_name := COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário');
  END IF;

  -- Inserir perfil
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (NEW.id, user_name, user_role);
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil quando usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();