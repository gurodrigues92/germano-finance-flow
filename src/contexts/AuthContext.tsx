import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Senha master
const MASTER_PASSWORD = "omelhorstudio";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Verificar sessão existente ao carregar
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Verificar localStorage primeiro
        const savedAuth = localStorage.getItem('studio_auth');
        if (savedAuth) {
          const authData = JSON.parse(savedAuth);
          // Verificar se a sessão não expirou (24 horas)
          const isValid = Date.now() - authData.timestamp < 24 * 60 * 60 * 1000;
          
          if (isValid) {
            setUser(authData.user);
          } else {
            localStorage.removeItem('studio_auth');
          }
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        localStorage.removeItem('studio_auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // Validar senha localmente primeiro
      if (password !== MASTER_PASSWORD) {
        setError('Senha incorreta');
        return false;
      }

      // Simular usuário autenticado (pode integrar com Supabase Auth depois)
      setUser({
        id: 'studio-admin',
        email: 'admin@studiogermano.com',
        name: 'Studio Germano'
      });
      
      // Salvar sessão no localStorage
      localStorage.setItem('studio_auth', JSON.stringify({
        user: {
          id: 'studio-admin',
          email: 'admin@studiogermano.com',
          name: 'Studio Germano'
        },
        timestamp: Date.now()
      }));

      return true;
    } catch (error) {
      setError('Erro de conexão');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('studio_auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout
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