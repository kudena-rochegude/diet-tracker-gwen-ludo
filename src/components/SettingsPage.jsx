import { useState } from 'react';
import { Download, Upload, Trash2, BarChart3, Info } from 'lucide-react';
import { exportData, importData } from '../utils/storage';

export default function SettingsPage({
  measurements,
  menus,
  onClearAll,
  onImportMeasurements,
  onImportMenus
}) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExportMeasurements = () => {
    const filename = `measurements_${new Date().toISOString().split('T')[0]}.json`;
    exportData({ measurements }, filename);
    setSuccess('✅ Mensurations exportées avec succès !');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportMenus = () => {
    const filename = `menus_${new Date().toISOString().split('T')[0]}.json`;
    exportData({ menus }, filename);
    setSuccess('✅ Menus exportés avec succès !');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleExportAll = () => {
    const filename = `diet_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    exportData({ measurements, menus }, filename);
    setSuccess('✅ Toutes les données exportées avec succès !');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImportMeasurements = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await importData(file);

      if (!data.measurements || !Array.isArray(data.measurements)) {
        setError('Format invalide : le fichier doit contenir un tableau "measurements"');
        return;
      }

      const shouldMerge = window.confirm(
        `Importer ${data.measurements.length} mensurations.\n\nOK = Fusionner avec données existantes\nAnnuler = Abandonner`
      );

      if (shouldMerge) {
        // Merge with existing data (avoid duplicates by id)
        const existingIds = new Set(measurements.map(m => m.id));
        const newMeasurements = data.measurements.filter(m => !existingIds.has(m.id));
        onImportMeasurements([...measurements, ...newMeasurements]);
        setSuccess(`✅ ${newMeasurements.length} nouvelles mensurations importées !`);
      }
    } catch (err) {
      setError(err.message);
    }

    e.target.value = '';
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImportMenus = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await importData(file);

      if (!data.menus || !Array.isArray(data.menus)) {
        setError('Format invalide : le fichier doit contenir un tableau "menus"');
        return;
      }

      const shouldMerge = window.confirm(
        `Importer ${data.menus.length} menus.\n\nOK = Fusionner avec données existantes\nAnnuler = Abandonner`
      );

      if (shouldMerge) {
        const existingIds = new Set(menus.map(m => m.id));
        const newMenus = data.menus.filter(m => !existingIds.has(m.id));
        onImportMenus([...menus, ...newMenus]);
        setSuccess(`✅ ${newMenus.length} nouveaux menus importés !`);
      }
    } catch (err) {
      setError(err.message);
    }

    e.target.value = '';
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleClearAll = () => {
    const confirmed = window.confirm(
      '⚠️ ATTENTION ⚠️\n\nCette action supprimera TOUTES vos données (mensurations et menus).\n\nCette action est IRRÉVERSIBLE.\n\nVoulez-vous continuer ?'
    );

    if (confirmed) {
      const doubleConfirm = window.confirm('Êtes-vous VRAIMENT sûr(e) ?');
      if (doubleConfirm) {
        onClearAll();
        setSuccess('✅ Toutes les données ont été supprimées.');
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  const stats = {
    totalMeasurements: measurements.length,
    totalMenus: menus.length,
    gwenMeasurements: measurements.filter(m => m.person === 'Gwen').length,
    ludoMeasurements: measurements.filter(m => m.person === 'Ludo').length,
    firstEntry: measurements.length > 0
      ? new Date(Math.min(...measurements.map(m => new Date(m.date)))).toLocaleDateString('fr-FR')
      : 'N/A',
    lastEntry: measurements.length > 0
      ? new Date(Math.max(...measurements.map(m => new Date(m.date)))).toLocaleDateString('fr-FR')
      : 'N/A'
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">⚙️ Outils & Paramètres</h2>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="mr-2" size={24} />
          Statistiques
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total mensurations</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalMeasurements}</p>
            <div className="mt-2 text-sm text-gray-600">
              <span className="text-pink-600 font-semibold">Gwen: {stats.gwenMeasurements}</span>
              {' • '}
              <span className="text-blue-600 font-semibold">Ludo: {stats.ludoMeasurements}</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Total menus</p>
            <p className="text-3xl font-bold text-purple-600">{stats.totalMenus}</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Première entrée</p>
            <p className="text-lg font-semibold text-green-700">{stats.firstEntry}</p>
          </div>

          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Dernière entrée</p>
            <p className="text-lg font-semibold text-orange-700">{stats.lastEntry}</p>
          </div>
        </div>
      </div>

      {/* Export/Import */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          💾 Gestion des données
        </h3>

        <div className="space-y-4">
          {/* Export */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Export</h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportMeasurements}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center"
              >
                <Download size={18} className="mr-2" />
                Mensurations
              </button>

              <button
                onClick={handleExportMenus}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center"
              >
                <Download size={18} className="mr-2" />
                Menus
              </button>

              <button
                onClick={handleExportAll}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center"
              >
                <Download size={18} className="mr-2" />
                Tout exporter
              </button>
            </div>
          </div>

          {/* Import */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Import</h4>
            <div className="flex flex-wrap gap-2">
              <label className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors cursor-pointer flex items-center">
                <Upload size={18} className="mr-2" />
                Mensurations
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportMeasurements}
                  className="hidden"
                />
              </label>

              <label className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors cursor-pointer flex items-center">
                <Upload size={18} className="mr-2" />
                Menus
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportMenus}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Clear All */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-gray-700 mb-2 text-red-600">Zone dangereuse</h4>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center"
            >
              <Trash2 size={18} className="mr-2" />
              Supprimer toutes les données
            </button>
            <p className="text-sm text-gray-500 mt-2">
              ⚠️ Cette action est irréversible. Pensez à exporter vos données avant.
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Info className="mr-2" size={24} />
          À propos
        </h3>

        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Version:</strong> 1.0.0
          </p>

          <div>
            <strong>Instructions:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Utilisez l'onglet "Saisie" pour enregistrer vos mensurations hebdomadaires</li>
              <li>Consultez l'onglet "Évolution" pour voir vos progrès</li>
              <li>Planifiez vos repas dans l'onglet "Menus"</li>
              <li>Exportez régulièrement vos données pour éviter toute perte</li>
            </ul>
          </div>

          <div className="pt-3 border-t">
            <p className="text-sm text-gray-500">
              💡 <strong>Astuce:</strong> Toutes les données sont stockées localement dans votre navigateur.
              Elles ne sont jamais envoyées sur internet. Pensez à faire des backups réguliers !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
