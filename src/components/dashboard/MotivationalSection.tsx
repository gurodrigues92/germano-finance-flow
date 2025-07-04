import { useState, useEffect } from 'react';

const motivationalPhrases = [
  "Cada corte é uma transformação",
  "Seus sonhos merecem o melhor cuidado",
  "Beleza que transforma vidas",
  "Transformando histórias através dos cabelos",
  "Cada cliente é uma obra de arte única"
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