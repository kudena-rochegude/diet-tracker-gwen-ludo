import { useState } from 'react';
import { validateMeasurement } from '../utils/storage';

export default function MeasurementForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    person: 'Gwen',
    date: new Date().toISOString().split('T')[0],
    weight: '',
    waist: '',
    hips: '',
    chest: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data for validation
    const dataToSubmit = {
      person: formData.person,
      date: formData.date,
      weight: parseFloat(formData.weight),
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      hips: formData.hips ? parseFloat(formData.hips) : undefined,
      chest: formData.chest ? parseFloat(formData.chest) : undefined
    };

    // Validate
    const validation = validateMeasurement(dataToSubmit);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Submit
    onSubmit(dataToSubmit);
    setSuccess('✅ Mensuration enregistrée avec succès !');

    // Reset form (keep person and date)
    setFormData({
      person: formData.person,
      date: new Date().toISOString().split('T')[0],
      weight: '',
      waist: '',
      hips: '',
      chest: ''
    });

    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ➕ Nouvelle Mensuration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personne *
            </label>
            <select
              name="person"
              value={formData.person}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="Gwen">Gwen</option>
              <option value="Ludo">Ludo</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poids (kg) *
            </label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="Ex: 68.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Waist */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tour de taille (cm)
            </label>
            <input
              type="number"
              name="waist"
              value={formData.waist}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="Ex: 75.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Hips */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tour de hanches (cm)
            </label>
            <input
              type="number"
              name="hips"
              value={formData.hips}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="Ex: 95.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Chest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tour de poitrine (cm)
            </label>
            <input
              type="number"
              name="chest"
              value={formData.chest}
              onChange={handleChange}
              step="0.1"
              min="0"
              placeholder="Ex: 88.0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}
