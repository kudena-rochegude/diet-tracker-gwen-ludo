// localStorage utilities for diet tracker

const STORAGE_KEYS = {
  MEASUREMENTS: 'diet_tracker_measurements',
  MENUS: 'diet_tracker_menus',
  SETTINGS: 'diet_tracker_settings'
};

export const storage = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage quota exceeded', e);
      return false;
    }
  },

  load: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Failed to parse storage', e);
      return defaultValue;
    }
  },

  clear: (key) => {
    localStorage.removeItem(key);
  },

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Export JSON data
export const exportData = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)],
    { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Import JSON data
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Fichier JSON invalide'));
      }
    };
    reader.onerror = () => reject(new Error('Erreur de lecture'));
    reader.readAsText(file);
  });
};

// Validation functions
export const validateMeasurement = (data) => {
  if (!data.person || !data.date || !data.weight) {
    return { valid: false, error: 'Personne, date et poids sont obligatoires' };
  }
  if (data.weight <= 0) {
    return { valid: false, error: 'Le poids doit être supérieur à 0' };
  }
  return { valid: true };
};

export const validateMenu = (data) => {
  if (!data.week || !data.day) {
    return { valid: false, error: 'Semaine et jour sont obligatoires' };
  }
  if (!data.breakfast && !data.lunch && !data.dinner && !data.snack) {
    return { valid: false, error: 'Au moins un repas doit être renseigné' };
  }
  return { valid: true };
};

export const validateMenuWeek = (data) => {
  if (!data.week || !Array.isArray(data.menus)) {
    return { valid: false, error: 'Structure invalide: week et menus requis' };
  }
  for (const menu of data.menus) {
    if (!menu.day) {
      return { valid: false, error: 'Chaque menu doit avoir un jour' };
    }
  }
  return { valid: true };
};

export { STORAGE_KEYS };
