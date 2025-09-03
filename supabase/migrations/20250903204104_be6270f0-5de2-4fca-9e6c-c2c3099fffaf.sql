-- Fix critical security vulnerability: Add user_id to transacoes table and implement proper RLS

-- Add user_id column to transacoes table
ALTER TABLE public.transacoes 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Update existing transactions to have user_id based on related comandas
-- This assumes transactions are created through comandas system
UPDATE public.transacoes t
SET user_id = c.user_id 
FROM public.comandas c 
WHERE t.comanda_id = c.id AND t.user_id IS NULL;

-- For transactions without comanda_id, we need to handle them differently
-- We'll associate them with the first admin user as a fallback
-- In a real scenario, these should be manually reviewed
DO $$
DECLARE
    first_admin_id uuid;
BEGIN
    -- Get first admin user
    SELECT p.user_id INTO first_admin_id
    FROM public.profiles p 
    WHERE p.role = 'admin' 
    LIMIT 1;
    
    -- Update orphaned transactions
    IF first_admin_id IS NOT NULL THEN
        UPDATE public.transacoes 
        SET user_id = first_admin_id 
        WHERE user_id IS NULL;
    END IF;
END $$;

-- Make user_id NOT NULL after data migration
ALTER TABLE public.transacoes 
ALTER COLUMN user_id SET NOT NULL;

-- Drop the existing insecure policy
DROP POLICY "Authenticated users can manage transacoes" ON public.transacoes;

-- Create secure user-specific RLS policies
CREATE POLICY "Users can view their own transacoes" 
ON public.transacoes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transacoes" 
ON public.transacoes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transacoes" 
ON public.transacoes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transacoes" 
ON public.transacoes 
FOR DELETE 
USING (auth.uid() = user_id);