import { TrendingUp, Plus, UtensilsCrossed, Settings } from 'lucide-react';

export default function Navigation({ currentPage, onNavigate }) {
  const navItems = [
    { id: 'evolution', label: 'Évolution', icon: TrendingUp },
    { id: 'input', label: 'Saisie', icon: Plus },
    { id: 'menus', label: 'Menus', icon: UtensilsCrossed },
    { id: 'settings', label: 'Outils', icon: Settings }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  currentPage === id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-green-600'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50">
        <div className="flex justify-around">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center py-3 px-4 flex-1 transition-colors ${
                currentPage === id
                  ? 'text-green-600'
                  : 'text-gray-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
