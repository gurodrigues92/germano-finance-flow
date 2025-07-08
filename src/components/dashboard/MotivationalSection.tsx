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
    <div className="relative bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 text-center transform -rotate-1 shadow-lg border-l-4 border-yellow-400 animate-float">
      <h3 className="text-sm font-medium text-yellow-800 mb-3">💫 Inspiração do Dia</h3>
      <p className="font-serif text-yellow-900 italic text-base font-medium leading-relaxed">
        "{motivationalPhrases[currentPhraseIndex]}"
      </p>
      {/* Post-it shadow effect */}
      <div className="absolute inset-0 bg-yellow-200 opacity-30 rounded-sm -z-10 transform translate-x-1 translate-y-1"></div>
    </div>
  );
};