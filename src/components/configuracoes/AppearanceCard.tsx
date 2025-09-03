import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, RefreshCw, Save, Monitor, Sun, Moon } from 'lucide-react';
import { useConfiguracoes } from '@/contexts/ConfiguracoesContext';

const themeIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor
};

const colorOptions = [
  { value: '#8B5CF6', name: 'Roxo (Padrão)', preview: 'bg-violet-500' },
  { value: '#3B82F6', name: 'Azul', preview: 'bg-blue-500' },
  { value: '#10B981', name: 'Verde', preview: 'bg-emerald-500' },
  { value: '#F59E0B', name: 'Amarelo', preview: 'bg-amber-500' },
  { value: '#EF4444', name: 'Vermelho', preview: 'bg-red-500' },
  { value: '#8B5A2B', name: 'Marrom', preview: 'bg-amber-700' },
];

export const AppearanceCard = () => {
  const { config, updateAppearance, resetSection } = useConfiguracoes();
  const [formData, setFormData] = useState(config.appearance);
  const [hasChanges, setHasChanges] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setFormData(prev => ({ ...prev, theme }));
    setHasChanges(true);
  };

  const handleDensityChange = (density: 'compact' | 'comfortable') => {
    setFormData(prev => ({ ...prev, density }));
    setHasChanges(true);
  };

  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, primaryColor: color }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateAppearance(formData);
    setHasChanges(false);
  };

  const handleReset = () => {
    resetSection('appearance');
    setFormData(config.appearance);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Aparência e Tema</CardTitle>
              <CardDescription>
                Personalize a aparência visual do sistema
              </CardDescription>
            </div>
          </div>
          {hasChanges && (
            <Badge variant="secondary" className="animate-pulse">
              Não salvo
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tema */}
        <div className="space-y-4">
          <h3 className="font-semibold">Tema</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {(['light', 'dark', 'system'] as const).map((theme) => {
              const Icon = themeIcons[theme];
              const isSelected = formData.theme === theme;
              
              return (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <Icon className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                    {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Densidade */}
        <div className="space-y-4">
          <h3 className="font-semibold">Densidade da Interface</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDensityChange('compact')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                formData.density === 'compact' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="space-y-1">
                <div className="h-2 w-8 bg-muted-foreground rounded"></div>
                <div className="h-2 w-6 bg-muted-foreground rounded"></div>
              </div>
              <span className={`text-sm font-medium ${
                formData.density === 'compact' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Compacta
              </span>
            </button>

            <button
              onClick={() => handleDensityChange('comfortable')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                formData.density === 'comfortable' ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="space-y-2">
                <div className="h-2 w-8 bg-muted-foreground rounded"></div>
                <div className="h-2 w-6 bg-muted-foreground rounded"></div>
              </div>
              <span className={`text-sm font-medium ${
                formData.density === 'comfortable' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                Confortável
              </span>
            </button>
          </div>
        </div>

        {/* Cor Principal */}
        <div className="space-y-4">
          <h3 className="font-semibold">Cor Principal</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {colorOptions.map((color) => {
              const isSelected = formData.primaryColor === color.value;
              
              return (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:bg-muted/50 ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${color.preview}`}></div>
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};