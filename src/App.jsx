import { useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from './utils/storage';
import Header from './components/Header';
import Navigation from './components/Navigation';
import EvolutionDashboard from './components/EvolutionDashboard';
import MeasurementForm from './components/MeasurementForm';
import MenusPage from './components/MenusPage';
import SettingsPage from './components/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('evolution');
  const [measurements, setMeasurements] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedMeasurements = storage.load(STORAGE_KEYS.MEASUREMENTS, []);
    const loadedMenus = storage.load(STORAGE_KEYS.MENUS, []);
    setMeasurements(loadedMeasurements);
    setMenus(loadedMenus);
    setLoading(false);
  }, []);

  // Save measurements to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      storage.save(STORAGE_KEYS.MEASUREMENTS, measurements);
    }
  }, [measurements, loading]);

  // Save menus to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      storage.save(STORAGE_KEYS.MENUS, menus);
    }
  }, [menus, loading]);

  const addMeasurement = (measurement) => {
    const newMeasurement = {
      id: crypto.randomUUID(),
      ...measurement,
      createdAt: new Date().toISOString()
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const deleteMeasurement = (id) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const addMenu = (menu) => {
    const newMenu = {
      id: crypto.randomUUID(),
      ...menu,
      createdAt: new Date().toISOString()
    };
    setMenus([...menus, newMenu]);
  };

  const deleteMenu = (id) => {
    setMenus(menus.filter(m => m.id !== id));
  };

  const addMenuWeek = (weekMenus) => {
    const newMenus = weekMenus.map(menu => ({
      id: crypto.randomUUID(),
      ...menu,
      createdAt: new Date().toISOString()
    }));
    setMenus([...menus, ...newMenus]);
  };

  const clearAllData = () => {
    setMeasurements([]);
    setMenus([]);
    storage.clearAll();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <Header />

      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {currentPage === 'evolution' && (
          <EvolutionDashboard
            measurements={measurements}
            onDelete={deleteMeasurement}
          />
        )}

        {currentPage === 'input' && (
          <MeasurementForm onSubmit={addMeasurement} />
        )}

        {currentPage === 'menus' && (
          <MenusPage
            menus={menus}
            onAddMenu={addMenu}
            onAddMenuWeek={addMenuWeek}
            onDelete={deleteMenu}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsPage
            measurements={measurements}
            menus={menus}
            onClearAll={clearAllData}
            onImportMeasurements={setMeasurements}
            onImportMenus={setMenus}
          />
        )}
      </main>

      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
