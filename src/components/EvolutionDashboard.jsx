import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp, Minus, Trash2 } from 'lucide-react';

export default function EvolutionDashboard({ measurements, onDelete }) {
  // Sort measurements by date
  const sortedMeasurements = [...measurements].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  // Prepare data for chart
  const chartData = sortedMeasurements.reduce((acc, m) => {
    const existing = acc.find(item => item.date === m.date);
    if (existing) {
      existing[m.person] = m.weight;
    } else {
      acc.push({
        date: m.date,
        [m.person]: m.weight
      });
    }
    return acc;
  }, []);

  // Get latest measurements for each person
  const getLatestMeasurement = (person) => {
    const personMeasurements = sortedMeasurements.filter(m => m.person === person);
    return personMeasurements[personMeasurements.length - 1];
  };

  const getPreviousMeasurement = (person) => {
    const personMeasurements = sortedMeasurements.filter(m => m.person === person);
    return personMeasurements[personMeasurements.length - 2];
  };

  const calculateDiff = (person) => {
    const latest = getLatestMeasurement(person);
    const previous = getPreviousMeasurement(person);

    if (!latest || !previous) return null;

    const diff = latest.weight - previous.weight;
    return {
      value: Math.abs(diff).toFixed(1),
      trend: diff < 0 ? 'down' : diff > 0 ? 'up' : 'stable'
    };
  };

  const PersonCard = ({ person, color, colorLight }) => {
    const latest = getLatestMeasurement(person);
    const diff = calculateDiff(person);

    if (!latest) {
      return (
        <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{person}</h3>
          <p className="text-gray-500">Aucune mensuration enregistrée</p>
        </div>
      );
    }

    return (
      <div className={`bg-white rounded-lg shadow-md p-6 border-l-4`} style={{ borderColor: color }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{person}</h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600">Poids actuel</p>
            <p className="text-3xl font-bold" style={{ color }}>{latest.weight} kg</p>
          </div>

          {diff && (
            <div className="flex items-center space-x-2">
              {diff.trend === 'down' && (
                <>
                  <TrendingDown className="text-green-500" size={20} />
                  <span className="text-green-500 font-semibold">-{diff.value} kg</span>
                </>
              )}
              {diff.trend === 'up' && (
                <>
                  <TrendingUp className="text-red-500" size={20} />
                  <span className="text-red-500 font-semibold">+{diff.value} kg</span>
                </>
              )}
              {diff.trend === 'stable' && (
                <>
                  <Minus className="text-gray-500" size={20} />
                  <span className="text-gray-500 font-semibold">Stable</span>
                </>
              )}
            </div>
          )}

          {latest.waist && (
            <div>
              <p className="text-sm text-gray-600">Tour de taille</p>
              <p className="text-lg font-semibold text-gray-700">{latest.waist} cm</p>
            </div>
          )}

          {latest.hips && (
            <div>
              <p className="text-sm text-gray-600">Tour de hanches</p>
              <p className="text-lg font-semibold text-gray-700">{latest.hips} cm</p>
            </div>
          )}

          {latest.chest && (
            <div>
              <p className="text-sm text-gray-600">Tour de poitrine</p>
              <p className="text-lg font-semibold text-gray-700">{latest.chest} cm</p>
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500">
              Dernière mesure : {new Date(latest.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📊 Évolution</h2>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <PersonCard person="Gwen" color="#ec4899" colorLight="#fce7f3" />
        <PersonCard person="Ludo" color="#3b82f6" colorLight="#dbeafe" />
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Évolution du poids</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                label={{ value: 'Poids (kg)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleDateString('fr-FR')}
                formatter={(value) => [`${value} kg`, '']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Gwen"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: '#ec4899', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="Ludo"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History */}
      {sortedMeasurements.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Historique</h3>
          <div className="space-y-2">
            {[...sortedMeasurements].reverse().slice(0, 10).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span
                      className="font-semibold px-3 py-1 rounded text-white text-sm"
                      style={{ backgroundColor: m.person === 'Gwen' ? '#ec4899' : '#3b82f6' }}
                    >
                      {m.person}
                    </span>
                    <span className="text-gray-600">
                      {new Date(m.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold">{m.weight} kg</span>
                    {m.waist && <span className="ml-3">Taille: {m.waist} cm</span>}
                    {m.hips && <span className="ml-3">Hanches: {m.hips} cm</span>}
                    {m.chest && <span className="ml-3">Poitrine: {m.chest} cm</span>}
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Supprimer cette mensuration ?')) {
                      onDelete(m.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {measurements.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">
            Aucune mensuration enregistrée pour le moment.
          </p>
          <p className="text-gray-400 mt-2">
            Utilisez l'onglet "Saisie" pour ajouter votre première mensuration.
          </p>
        </div>
      )}
    </div>
  );
}
