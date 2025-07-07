import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scissors, Lock, Eye, EyeOff, AlertCircle, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { login, signUp, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) return;

    const success = isSignUp 
      ? await signUp(email.trim(), password)
      : await login(email.trim(), password);
    
    if (success) {
      // Success is handled by the auth state change
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-finance-studio via-finance-studio/80 to-finance-kam flex items-center justify-center p-4 animate-gradient">
      <div className="w-full max-w-md">
        
        {/* Logo Animado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6 hover:bg-white/20 transition-all duration-300">
            <Scissors className="w-12 h-12 text-white animate-spin-slow" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Studio Germano</h1>
          <p className="text-white/80 text-lg">Sistema Financeiro</p>
        </div>

        {/* Card de Login */}
        <div className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all duration-300 hover:scale-[1.02] ${
          error ? 'animate-shake' : ''
        }`}>
          
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta!'}
            </h2>
            <p className="text-gray-600">
              {isSignUp ? 'Crie sua conta para acessar o sistema' : 'Digite suas credenciais para acessar'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo de Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-finance-studio focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Digite seu email"
                  autoFocus
                  disabled={isLoading}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-finance-studio focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  minLength={6}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagens de Status */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 animate-slide-in" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            {/* Botão de Login/Signup */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-finance-studio focus:ring-offset-2 ${
                isLoading || !email.trim() || !password.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-finance-studio to-finance-kam text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isSignUp ? 'Criando conta...' : 'Entrando...'}</span>
                </div>
              ) : (
                isSignUp ? "Criar Conta" : "Acessar Sistema"
              )}
            </button>

            {/* Toggle entre Login e Signup */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-finance-studio hover:text-finance-kam transition-colors font-medium"
                disabled={isLoading}
              >
                {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar agora'}
              </button>
            </div>
          </form>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Transformando vidas através dos cabelos desde 2011
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}