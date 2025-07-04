import { useState, useEffect } from 'react';

const motivationalPhrases = [
  "Cada cliente é uma oportunidade de crescer",
  "Sucesso no salão começa com organização",
  "Seus números contam sua história de sucesso",
  "Profissionalismo gera resultados",
  "Transforme talento em prosperidade",
  "O sucesso está nos detalhes"
];

export const MotivationalSection = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % motivationalPhrases.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-2xl p-6 text-center border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">💫 Inspiração do Dia</h3>
      <p className="text-muted-foreground italic text-base">
        "{motivationalPhrases[currentPhraseIndex]}"
      </p>
    </div>
  );
};