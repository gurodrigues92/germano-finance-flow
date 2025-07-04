export const GreetingHeader = () => {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="bg-gradient-to-r from-finance-studio to-finance-edu rounded-2xl p-6 text-white">
      <h2 className="text-xl font-semibold mb-1">
        {greeting()}, Studio Germano! 👋
      </h2>
      <p className="text-white/80 text-sm">
        {currentDate} • Dashboard Financeiro
      </p>
    </div>
  );
};