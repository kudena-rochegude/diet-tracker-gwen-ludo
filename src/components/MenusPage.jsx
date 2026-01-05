import { useState } from 'react';
import { ChevronLeft, ChevronRight, Upload, Download, Trash2 } from 'lucide-react';
import { validateMenu, validateMenuWeek, importData, exportData } from '../utils/storage';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function MenusPage({ menus, onAddMenu, onAddMenuWeek, onDelete }) {
  const [view, setView] = useState('calendar'); // 'calendar' or 'form'
  const [selectedWeek, setSelectedWeek] = useState(getWeekStart(new Date()));
  const [formData, setFormData] = useState({
    week: getWeekStart(new Date()),
    day: 'Lundi',
    breakfast: '',
    lunch: '',
    dinner: '',
    snack: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  }

  const handlePreviousWeek = () => {
    const date = new Date(selectedWeek);
    date.setDate(date.getDate() - 7);
    setSelectedWeek(getWeekStart(date));
  };

  const handleNextWeek = () => {
    const date = new Date(selectedWeek);
    date.setDate(date.getDate() + 7);
    setSelectedWeek(getWeekStart(date));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validation = validateMenu(formData);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onAddMenu(formData);
    setSuccess('✅ Menu enregistré avec succès !');

    // Reset meal fields, keep week and day
    setFormData({
      ...formData,
      breakfast: '',
      lunch: '',
      dinner: '',
      snack: ''
    });

    setTimeout(() => setSuccess(''), 3000);
  };

  const handleImportWeek = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await importData(file);
      const validation = validateMenuWeek(data);

      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      // Convert week menus to individual menu entries
      const menusToAdd = data.menus.map(menu => ({
        week: data.week,
        ...menu
      }));

      onAddMenuWeek(menusToAdd);
      setSuccess(`✅ ${menusToAdd.length} menus importés avec succès !`);
      setSelectedWeek(data.week);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }

    // Reset file input
    e.target.value = '';
  };

  const downloadTemplate = () => {
    const template = {
      week: getWeekStart(new Date()),
      menus: DAYS.map(day => ({
        day,
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: ''
      }))
    };

    exportData(template, 'menu_template.json');
  };

  // Get menus for selected week
  const weekMenus = menus.filter(m => m.week === selectedWeek);
  const menusByDay = DAYS.map(day => {
    const menu = weekMenus.find(m => m.day === day);
    return { day, menu };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">🍽️ Menus</h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setView(view === 'calendar' ? 'form' : 'calendar')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {view === 'calendar' ? '➕ Ajouter menu' : '📅 Voir calendrier'}
          </button>

          <label className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors cursor-pointer">
            <Upload size={18} className="inline mr-2" />
            Importer semaine
            <input
              type="file"
              accept=".json"
              onChange={handleImportWeek}
              className="hidden"
            />
          </label>

          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Download size={18} className="inline mr-2" />
            Template
          </button>
        </div>
      </div>

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

      {/* Form View */}
      {view === 'form' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Ajouter un menu</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semaine du *
                </label>
                <input
                  type="date"
                  name="week"
                  value={formData.week}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jour *
                </label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Petit-déjeuner
              </label>
              <textarea
                name="breakfast"
                value={formData.breakfast}
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Porridge d'avoine, fruits frais"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Déjeuner
              </label>
              <textarea
                name="lunch"
                value={formData.lunch}
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Salade composée, poulet grillé"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dîner
              </label>
              <textarea
                name="dinner"
                value={formData.dinner}
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Poisson vapeur, brocoli"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collation
              </label>
              <textarea
                name="snack"
                value={formData.snack}
                onChange={handleChange}
                rows="2"
                placeholder="Ex: Pomme, amandes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Enregistrer le menu
            </button>
          </form>
        </div>
      )}

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Week selector */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <h3 className="text-lg font-semibold text-gray-800">
              Semaine du {new Date(selectedWeek).toLocaleDateString('fr-FR')}
            </h3>

            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Menus list */}
          <div className="space-y-4">
            {menusByDay.map(({ day, menu }) => (
              <div key={day} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-800 flex items-center justify-between">
                  <span>{day}</span>
                  {menu && (
                    <button
                      onClick={() => {
                        if (window.confirm('Supprimer ce menu ?')) {
                          onDelete(menu.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {menu ? (
                  <div className="p-4 space-y-2">
                    {menu.breakfast && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Petit-déj: </span>
                        <span className="text-gray-800">{menu.breakfast}</span>
                      </div>
                    )}
                    {menu.lunch && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Déjeuner: </span>
                        <span className="text-gray-800">{menu.lunch}</span>
                      </div>
                    )}
                    {menu.dinner && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Dîner: </span>
                        <span className="text-gray-800">{menu.dinner}</span>
                      </div>
                    )}
                    {menu.snack && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">Collation: </span>
                        <span className="text-gray-800">{menu.snack}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-gray-400 italic">Aucun menu planifié</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
