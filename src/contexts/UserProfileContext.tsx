import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'assistente';

export interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isAssistente: boolean;
  hasPermission: (permission: string) => boolean;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | null>(null);

const ADMIN_PERMISSIONS = [
  'view_dashboard',
  'view_transactions', 
  'view_analysis',
  'view_archive',
  'view_fixed_costs',
  'view_stock',
  'view_investments',
  'view_goals',
  'view_financial_distribution',
  'view_financial_metrics',
  'manage_all'
];

const ASSISTENTE_PERMISSIONS = [
  'view_dashboard',
  'view_transactions',
  'view_archive', 
  'view_fixed_costs',
  'view_stock'
];

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user || !isAuthenticated) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Erro ao buscar perfil:', fetchError);
        setError('Erro ao carregar perfil do usuário');
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Erro na função fetchProfile:', error);
      setError('Erro de conexão ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    setIsLoading(true);
    await fetchProfile();
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!profile || !user) return false;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        setError('Erro ao atualizar perfil');
        return false;
      }

      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Erro na função updateProfile:', error);
      setError('Erro de conexão ao atualizar perfil');
      return false;
    }
  };

  const hasPermission = (permission: string): boolean => {
    // Fallback de segurança: emails específicos sempre têm acesso admin
    const adminEmails = ['gurodrigues92@gmail.com', 'eduardo.germano15@gmail.com'];
    if (user && adminEmails.includes(user.email || '')) {
      return ADMIN_PERMISSIONS.includes(permission);
    }
    
    if (!profile) return false;
    
    if (profile.role === 'admin') {
      return ADMIN_PERMISSIONS.includes(permission);
    } else if (profile.role === 'assistente') {
      return ASSISTENTE_PERMISSIONS.includes(permission);
    }
    
    return false;
  };

  // Fallback para determinar se é admin baseado no email
  const adminEmails = ['gurodrigues92@gmail.com', 'eduardo.germano15@gmail.com'];
  const isAdminByEmail = user && adminEmails.includes(user.email || '');
  
  const isAdmin = profile?.role === 'admin' || isAdminByEmail;
  const isAssistente = profile?.role === 'assistente' && !isAdminByEmail;

  useEffect(() => {
    fetchProfile();
  }, [user, isAuthenticated]);

  return (
    <UserProfileContext.Provider value={{
      profile,
      isLoading,
      error,
      isAdmin,
      isAssistente,
      hasPermission,
      refreshProfile,
      updateProfile
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile deve ser usado dentro de UserProfileProvider');
  }
  return context;
};

export const usePermissions = () => {
  const { hasPermission, isAdmin, isAssistente } = useUserProfile();
  return { hasPermission, isAdmin, isAssistente };
};