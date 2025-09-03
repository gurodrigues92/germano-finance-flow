import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface NomenclaturaConfig {
  profissional: string;
  assistente: string;
  studio: string;
}

interface FinanceConfig {
  eduShareDefault: number;
  kamShareDefault: number;
  studioShareDefault: number;
  taxaCreditoDefault: number;
  taxaDebitoDefault: number;
  assistenteTaxaDefault: number;
}

interface AppearanceConfig {
  theme: 'light' | 'dark' | 'system';
  density: 'compact' | 'comfortable';
  primaryColor: string;
}

interface EstablishmentConfig {
  nomeEmpresa: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
}

interface ConfiguracoesState {
  nomenclatura: NomenclaturaConfig;
  finance: FinanceConfig;
  appearance: AppearanceConfig;
  establishment: EstablishmentConfig;
}

interface ConfiguracoesContextData {
  config: ConfiguracoesState;
  updateNomenclatura: (data: Partial<NomenclaturaConfig>) => void;
  updateFinance: (data: Partial<FinanceConfig>) => void;
  updateAppearance: (data: Partial<AppearanceConfig>) => void;
  updateEstablishment: (data: Partial<EstablishmentConfig>) => void;
  resetSection: (section: keyof ConfiguracoesState) => void;
  isLoading: boolean;
}

const ConfiguracoesContext = createContext<ConfiguracoesContextData | undefined>(undefined);

const defaultConfig: ConfiguracoesState = {
  nomenclatura: {
    profissional: 'Profissional',
    assistente: 'Assistente',
    studio: 'Studio Germano'
  },
  finance: {
    eduShareDefault: 40,
    kamShareDefault: 10,
    studioShareDefault: 50,
    taxaCreditoDefault: 3.5,
    taxaDebitoDefault: 1.5,
    assistenteTaxaDefault: 25
  },
  appearance: {
    theme: 'system',
    density: 'comfortable',
    primaryColor: '#8B5CF6'
  },
  establishment: {
    nomeEmpresa: 'Studio Germano',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: ''
  }
};

export const ConfiguracoesProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<ConfiguracoesState>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      // Load from localStorage first
      const saved = localStorage.getItem('sistema-configuracoes');
      if (saved) {
        setConfig({ ...defaultConfig, ...JSON.parse(saved) });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = (newConfig: ConfiguracoesState) => {
    try {
      localStorage.setItem('sistema-configuracoes', JSON.stringify(newConfig));
      setConfig(newConfig);
      toast({
        title: "Configurações salvas",
        description: "As alterações foram aplicadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    }
  };

  const updateNomenclatura = (data: Partial<NomenclaturaConfig>) => {
    const newConfig = {
      ...config,
      nomenclatura: { ...config.nomenclatura, ...data }
    };
    saveConfig(newConfig);
  };

  const updateFinance = (data: Partial<FinanceConfig>) => {
    const newConfig = {
      ...config,
      finance: { ...config.finance, ...data }
    };
    saveConfig(newConfig);
  };

  const updateAppearance = (data: Partial<AppearanceConfig>) => {
    const newConfig = {
      ...config,
      appearance: { ...config.appearance, ...data }
    };
    saveConfig(newConfig);
  };

  const updateEstablishment = (data: Partial<EstablishmentConfig>) => {
    const newConfig = {
      ...config,
      establishment: { ...config.establishment, ...data }
    };
    saveConfig(newConfig);
  };

  const resetSection = (section: keyof ConfiguracoesState) => {
    const newConfig = {
      ...config,
      [section]: defaultConfig[section]
    };
    saveConfig(newConfig);
  };

  return (
    <ConfiguracoesContext.Provider
      value={{
        config,
        updateNomenclatura,
        updateFinance,
        updateAppearance,
        updateEstablishment,
        resetSection,
        isLoading,
      }}
    >
      {children}
    </ConfiguracoesContext.Provider>
  );
};

export const useConfiguracoes = () => {
  const context = useContext(ConfiguracoesContext);
  if (context === undefined) {
    throw new Error('useConfiguracoes must be used within a ConfiguracoesProvider');
  }
  return context;
};