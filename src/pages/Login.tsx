import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scissors, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Timer para desbloqueio
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLocked && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isLocked) {
      setIsLocked(false);
      setAttempts(0);
    }
    return () => clearTimeout(timer);
  }, [isLocked, timeLeft]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isLocked || !password.trim()) return;

    const success = await login(password.trim());
    
    if (!success) {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeLeft(30);
      }
      
      // Vibração no mobile
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } else {
      setAttempts(0);
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Bem-vindo de volta!</h2>
            <p className="text-gray-600">Digite a senha para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Campo de Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-finance-studio focus:border-transparent transition-all duration-200 ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua senha"
                  autoFocus
                  disabled={isLocked || isLoading}
                  maxLength={50}
                  autoComplete="current-password"
                  aria-describedby={error ? "password-error" : undefined}
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
              <div id="password-error" className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 animate-slide-in" role="alert">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-600 text-sm">{error}</span>
              </div>
            )}

            {isLocked && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center space-x-2 animate-slide-in" role="alert">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <span className="text-yellow-600 text-sm">
                  Muitas tentativas incorretas. Aguarde {timeLeft} segundos.
                </span>
              </div>
            )}

            {attempts > 0 && !isLocked && (
              <p className="text-sm text-gray-500 text-center">
                Tentativas restantes: {3 - attempts}
              </p>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading || isLocked || !password.trim()}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-finance-studio focus:ring-offset-2 ${
                isLoading || isLocked || !password.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-finance-studio to-finance-kam text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </div>
              ) : isLocked ? (
                `Aguarde ${timeLeft}s`
              ) : (
                "Acessar Sistema"
              )}
            </button>
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