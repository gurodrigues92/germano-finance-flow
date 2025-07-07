import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  isEmailConfirmed: boolean;
  needsEmailConfirmation: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearMessages: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAuthenticated = !!session && !!user;
  const isEmailConfirmed = !!user?.email_confirmed_at;
  const needsEmailConfirmation = !!user && !user.email_confirmed_at;

  // Set up auth state listener and check existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return false;
      }

      return true;
    } catch (error) {
      setError('Erro de conexão');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Lista de emails permitidos para cadastro
      const allowedEmails = [
        'gurodrigues92@gmail.com',
        'Eduardo.germano15@gmail.com',
        'kamlley_zapata@outlook.com'
      ];

      // Verificar se o email está na whitelist
      if (!allowedEmails.includes(email.toLowerCase().trim())) {
        setError('Este email não tem permissão para se cadastrar no sistema.');
        return false;
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        setError(authError.message);
        return false;
      }

      // Verificar se o usuário precisa confirmar email
      if (data.user && !data.session) {
        setSuccess('Email de confirmação enviado! Verifique sua caixa de entrada e clique no link para ativar sua conta.');
      }

      return true;
    } catch (error) {
      setError('Erro de conexão');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendConfirmation = async (email: string): Promise<boolean> => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        setError(error.message);
        return false;
      }

      setSuccess('Email de confirmação reenviado! Verifique sua caixa de entrada.');
      return true;
    } catch (error) {
      setError('Erro de conexão');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      isLoading,
      error,
      success,
      isEmailConfirmed,
      needsEmailConfirmation,
      login,
      signUp,
      resendConfirmation,
      logout,
      clearMessages
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};