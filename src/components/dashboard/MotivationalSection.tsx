import React from 'react';

const motivationalPhrases = [
  "Cada cliente é uma oportunidade de crescer",
  "Sucesso no salão começa com organização",
  "Seus números contam sua história de sucesso",
  "Profissionalismo gera resultados",
  "Transforme talento em prosperidade",
  "O sucesso está nos detalhes"
];

export const MotivationalSection = () => {
  // Generate phrase index based on current date for consistency throughout the day
  const getCurrentPhraseIndex = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return dayOfYear % motivationalPhrases.length;
  };

  const currentPhraseIndex = getCurrentPhraseIndex();

  return (
    <div className="bg-card rounded-2xl p-6 text-center border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-2">💫 Inspiração do Dia</h3>
      <p className="text-muted-foreground italic text-base">
        "{motivationalPhrases[currentPhraseIndex]}"
      </p>
    </div>
  );
};