import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scissors, Lock, Eye, EyeOff, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const { login, signUp, resendConfirmation, isLoading, error, success, isAuthenticated, clearMessages } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lista de emails permitidos (todos em minúsculo - mesma do AuthContext)
  const allowedEmails = [
    'gurodrigues92@gmail.com',
    'eduardo.germano15@gmail.com',
    'kamlley_zapata@outlook.com'
  ];

  // Verificar se o email está na whitelist
  const isEmailAllowed = email.trim() && allowedEmails.includes(email.toLowerCase().trim());
  const showEmailStatus = isSignUp && email.trim().length > 0;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear messages when switching between login/signup
  useEffect(() => {
    clearMessages();
  }, [isSignUp, clearMessages]);

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
            {isSignUp && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-800">Sistema Restrito</p>
                    <p className="text-xs text-blue-600">Apenas emails autorizados podem criar contas neste sistema.</p>
                  </div>
                </div>
              </div>
            )}
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
              
              {/* Status do Email na Whitelist */}
              {showEmailStatus && (
                <div className={`mt-2 p-2 rounded-lg border transition-all duration-200 ${
                  isEmailAllowed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {isEmailAllowed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className={`text-xs font-medium ${
                      isEmailAllowed ? 'text-green-700' : 'text-amber-700'
                    }`}>
                      {isEmailAllowed 
                        ? 'Email autorizado ✓' 
                        : 'Email não autorizado para cadastro'
                      }
                    </span>
                  </div>
                </div>
              )}
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

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-slide-in" role="alert">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="text-green-700 text-sm">{success}</span>
                    {success.includes('Email de confirmação') && (
                      <div className="mt-3 space-y-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <p className="text-xs text-green-800">
                            <strong>Próximos passos:</strong><br />
                            1. Verifique sua caixa de entrada (e spam)<br />
                            2. Clique no link de confirmação<br />
                            3. Retorne aqui para fazer login
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (email.trim()) {
                              await resendConfirmation(email.trim());
                            }
                          }}
                          className="text-xs text-green-600 hover:text-green-800 underline"
                          disabled={isLoading}
                        >
                          Reenviar email de confirmação
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Login/Signup */}
            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim() || (isSignUp && !isEmailAllowed)}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-finance-studio focus:ring-offset-2 ${
                isLoading || !email.trim() || !password.trim() || (isSignUp && !isEmailAllowed)
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