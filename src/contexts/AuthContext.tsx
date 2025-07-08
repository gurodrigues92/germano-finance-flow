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
      console.log('Tentativa de login:', { email: email.toLowerCase().trim(), timestamp: new Date().toISOString() });
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Erro no login Supabase:', authError);
        
        let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
        
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos. Tente novamente.';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Email ainda não confirmado. Verifique sua caixa de entrada.';
        } else if (authError.message.includes('Too many requests')) {
          errorMessage = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
        }
        
        setError(errorMessage);
        return false;
      }

      console.log('Login bem-sucedido:', { hasUser: !!data.user, hasSession: !!data.session });
      return true;
    } catch (error) {
      console.error('Erro na função login:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
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
      // Lista de emails permitidos para cadastro (todos em minúsculo)
      const allowedEmails = [
        'gurodrigues92@gmail.com',
        'eduardo.germano15@gmail.com',
        'kamlley_zapata@outlook.com'
      ];

      console.log('Tentativa de cadastro:', { email: email.toLowerCase().trim(), timestamp: new Date().toISOString() });

      // Verificar se o email está na whitelist
      if (!allowedEmails.includes(email.toLowerCase().trim())) {
        console.log('Email rejeitado - não está na whitelist:', email.toLowerCase().trim());
        setError('Este email não tem permissão para se cadastrar no sistema. Apenas emails autorizados podem criar contas.');
        return false;
      }

      console.log('Email aprovado - iniciando cadastro no Supabase');
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        console.error('Erro no cadastro Supabase:', authError);
        let errorMessage = 'Erro ao criar conta. Tente novamente.';
        
        if (authError.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (authError.message.includes('Password')) {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (authError.message.includes('Email')) {
          errorMessage = 'Por favor, digite um email válido.';
        }
        
        setError(errorMessage);
        return false;
      }

      console.log('Cadastro Supabase concluído:', { hasUser: !!data.user, hasSession: !!data.session });

      // Verificar se o usuário precisa confirmar email
      if (data.user && !data.session) {
        console.log('Usuário criado mas precisa confirmar email');
        setSuccess('Email de confirmação enviado! Verifique sua caixa de entrada e clique no link para ativar sua conta.');
      } else if (data.user && data.session) {
        console.log('Usuário criado e logado automaticamente');
        setSuccess('Conta criada com sucesso! Bem-vindo ao sistema.');
      }

      return true;
    } catch (error) {
      console.error('Erro na função signUp:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
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
      console.log('Reenviando email de confirmação para:', email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Erro ao reenviar email:', error);
        let errorMessage = 'Erro ao reenviar email. Tente novamente.';
        
        if (error.message.includes('rate limit')) {
          errorMessage = 'Aguarde alguns minutos antes de solicitar outro email de confirmação.';
        } else if (error.message.includes('not found')) {
          errorMessage = 'Email não encontrado. Verifique se o email está correto.';
        }
        
        setError(errorMessage);
        return false;
      }

      console.log('Email de confirmação reenviado com sucesso');
      setSuccess('Email de confirmação reenviado! Verifique sua caixa de entrada e spam.');
      return true;
    } catch (error) {
      console.error('Erro na função resendConfirmation:', error);
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
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