-- Inserir perfis manualmente para usuários existentes
-- Primeiro, vamos inserir o perfil para gurodrigues92@gmail.com como admin
INSERT INTO public.profiles (user_id, name, role)
SELECT 
  au.id,
  'Gustavo Rodrigues',
  'admin'::user_role
FROM auth.users au
WHERE au.email = 'gurodrigues92@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
  );

-- Inserir perfil para eduardo.germano15@gmail.com como admin
INSERT INTO public.profiles (user_id, name, role)
SELECT 
  au.id,
  'Eduardo Germano',
  'admin'::user_role
FROM auth.users au
WHERE au.email = 'eduardo.germano15@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
  );

-- Inserir perfil para kamlley_zapata@outlook.com como assistente
INSERT INTO public.profiles (user_id, name, role)
SELECT 
  au.id,
  'Kamlley Zapata',
  'assistente'::user_role
FROM auth.users au
WHERE au.email = 'kamlley_zapata@outlook.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.user_id = au.id
  );