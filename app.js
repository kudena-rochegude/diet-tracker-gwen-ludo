// Diet Tracker App
class DietTracker {
    constructor() {
        this.meals = this.loadMeals();
        this.history = this.loadHistory();
        this.measurements = this.loadMeasurements();
        this.weeklyMenu = this.loadWeeklyMenu();
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.updateSummary();
        this.renderMeals();
        this.renderHistory();
        this.renderCurrentMeasurements();
        this.renderMeasurementsHistory();
        this.renderWeeklyMenu();
        this.attachEventListeners();
        this.initTabs();
    }

    // Tab Navigation
    initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                // Add active class to clicked button and corresponding content
                btn.classList.add('active');
                const tabName = btn.dataset.tab;
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    attachEventListeners() {
        // Meal events
        document.getElementById('mealForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMeal();
        });

        document.getElementById('clearDay').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer tous les repas du jour ?')) {
                this.clearDay();
            }
        });

        document.getElementById('clearHistory').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
                this.clearHistory();
            }
        });

        // Measurements events
        document.getElementById('measurementsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMeasurement();
        });

        document.getElementById('clearMeasurements').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer toutes les mesures ?')) {
                this.clearMeasurements();
            }
        });

        // Menu events
        document.getElementById('menuForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMenuMeal();
        });

        document.getElementById('jsonFile').addEventListener('change', (e) => {
            this.importMenu(e.target.files[0]);
        });

        document.getElementById('exportMenu').addEventListener('click', () => {
            this.exportMenu();
        });

        document.getElementById('clearMenu').addEventListener('click', () => {
            if (confirm('Êtes-vous sûr de vouloir effacer tout le menu ?')) {
                this.clearMenu();
            }
        });
    }

    updateCurrentDate() {
        const today = new Date();
        const options = { day: 'numeric', month: 'short' };
        const dateStr = today.toLocaleDateString('fr-FR', options);
        document.getElementById('currentDate').textContent = dateStr;
    }

    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0];
    }

    // ===== MEALS FUNCTIONALITY =====
    addMeal() {
        const name = document.getElementById('mealName').value.trim();
        const description = document.getElementById('mealDescription').value.trim();
        const calories = parseInt(document.getElementById('calories').value);

        if (!name || !calories) return;

        const meal = {
            id: Date.now(),
            name,
            description,
            calories,
            timestamp: new Date().toISOString()
        };

        this.meals.push(meal);
        this.saveMeals();
        this.updateSummary();
        this.renderMeals();

        document.getElementById('mealForm').reset();
        this.showNotification('Repas ajouté avec succès !');
    }

    deleteMeal(id) {
        this.meals = this.meals.filter(meal => meal.id !== id);
        this.saveMeals();
        this.updateSummary();
        this.renderMeals();
        this.showNotification('Repas supprimé');
    }

    updateSummary() {
        const totalCalories = this.meals.reduce((sum, meal) => sum + meal.calories, 0);
        const mealCount = this.meals.length;

        document.getElementById('totalCalories').textContent = totalCalories;
        document.getElementById('mealCount').textContent = mealCount;
    }

    renderMeals() {
        const container = document.getElementById('mealsContainer');

        if (this.meals.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun repas enregistré aujourd\'hui</p>';
            return;
        }

        container.innerHTML = this.meals.map(meal => `
            <div class="meal-item">
                <div class="meal-info">
                    <h3>${meal.name}</h3>
                    <p>${meal.description || 'Pas de description'}</p>
                    <small style="color: #999;">${this.formatTime(meal.timestamp)}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div class="meal-calories">${meal.calories} kcal</div>
                    <button class="btn-delete" onclick="tracker.deleteMeal(${meal.id})">
                        Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderHistory() {
        const container = document.getElementById('historyContainer');

        if (Object.keys(this.history).length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun historique disponible</p>';
            return;
        }

        const sortedDates = Object.keys(this.history).sort((a, b) => b.localeCompare(a));

        container.innerHTML = sortedDates.slice(0, 7).map(date => {
            const dayData = this.history[date];
            const totalCalories = dayData.reduce((sum, meal) => sum + meal.calories, 0);

            return `
                <div class="history-day">
                    <h3>
                        <span>${this.formatDate(date)}</span>
                        <span class="history-total">${totalCalories} kcal</span>
                    </h3>
                    <div class="history-meals">
                        ${dayData.map(meal => `
                            <div class="history-meal">
                                <span>${meal.name}</span>
                                <span>${meal.calories} kcal</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    clearDay() {
        if (this.meals.length > 0) {
            this.saveToHistory();
        }

        this.meals = [];
        this.saveMeals();
        this.updateSummary();
        this.renderMeals();
        this.renderHistory();
        this.showNotification('Journée effacée et sauvegardée dans l\'historique');
    }

    clearHistory() {
        this.history = {};
        this.saveHistory();
        this.renderHistory();
        this.showNotification('Historique effacé');
    }

    saveToHistory() {
        const todayKey = this.getTodayKey();
        this.history[todayKey] = [...this.meals];
        this.saveHistory();
    }

    // ===== MEASUREMENTS FUNCTIONALITY =====
    addMeasurement() {
        const measurement = {
            id: Date.now(),
            date: new Date().toISOString(),
            weight: parseFloat(document.getElementById('weight').value) || null,
            waist: parseFloat(document.getElementById('waist').value) || null,
            hips: parseFloat(document.getElementById('hips').value) || null,
            chest: parseFloat(document.getElementById('chest').value) || null,
            arms: parseFloat(document.getElementById('arms').value) || null,
            thighs: parseFloat(document.getElementById('thighs').value) || null
        };

        // Check if at least one measurement was entered
        const hasData = Object.values(measurement).some((val, idx) => idx > 1 && val !== null);
        if (!hasData) {
            this.showNotification('Veuillez entrer au moins une mesure');
            return;
        }

        this.measurements.unshift(measurement);
        this.saveMeasurements();
        this.renderCurrentMeasurements();
        this.renderMeasurementsHistory();

        document.getElementById('measurementsForm').reset();
        this.showNotification('Mesures enregistrées avec succès !');
    }

    renderCurrentMeasurements() {
        const container = document.getElementById('currentMeasurements');

        if (this.measurements.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucune mesure enregistrée</p>';
            return;
        }

        const latest = this.measurements[0];
        const labels = {
            weight: 'Poids',
            waist: 'Taille',
            hips: 'Hanches',
            chest: 'Poitrine',
            arms: 'Bras',
            thighs: 'Cuisses'
        };

        const units = {
            weight: 'kg',
            waist: 'cm',
            hips: 'cm',
            chest: 'cm',
            arms: 'cm',
            thighs: 'cm'
        };

        container.innerHTML = Object.keys(labels).map(key => {
            if (latest[key] === null) return '';
            return `
                <div class="measurement-card">
                    <div class="value">${latest[key]} ${units[key]}</div>
                    <div class="label">${labels[key]}</div>
                </div>
            `;
        }).join('');
    }

    renderMeasurementsHistory() {
        const container = document.getElementById('measurementsHistory');

        if (this.measurements.length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun historique de mesures</p>';
            return;
        }

        const labels = {
            weight: 'Poids',
            waist: 'Taille',
            hips: 'Hanches',
            chest: 'Poitrine',
            arms: 'Bras',
            thighs: 'Cuisses'
        };

        const units = {
            weight: 'kg',
            waist: 'cm',
            hips: 'cm',
            chest: 'cm',
            arms: 'cm',
            thighs: 'cm'
        };

        container.innerHTML = this.measurements.slice(0, 10).map(m => {
            return `
                <div class="measurement-history-item">
                    <h4>${this.formatDate(m.date.split('T')[0])}</h4>
                    <div class="measurement-details">
                        ${Object.keys(labels).map(key => {
                            if (m[key] === null) return '';
                            return `
                                <div class="measurement-detail">
                                    ${labels[key]}: <strong>${m[key]} ${units[key]}</strong>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    clearMeasurements() {
        this.measurements = [];
        this.saveMeasurements();
        this.renderCurrentMeasurements();
        this.renderMeasurementsHistory();
        this.showNotification('Mesures effacées');
    }

    // ===== WEEKLY MENU FUNCTIONALITY =====
    addMenuMeal() {
        const day = document.getElementById('menuDay').value;
        const mealType = document.getElementById('menuMealType').value;
        const mealName = document.getElementById('menuMealName').value.trim();
        const calories = parseInt(document.getElementById('menuCalories').value) || 0;

        if (!mealName) return;

        if (!this.weeklyMenu[day]) {
            this.weeklyMenu[day] = [];
        }

        const menuMeal = {
            id: Date.now(),
            type: mealType,
            name: mealName,
            calories: calories
        };

        this.weeklyMenu[day].push(menuMeal);
        this.saveWeeklyMenu();
        this.renderWeeklyMenu();

        document.getElementById('menuForm').reset();
        this.showNotification('Repas ajouté au menu !');
    }

    deleteMenuMeal(day, mealId) {
        this.weeklyMenu[day] = this.weeklyMenu[day].filter(m => m.id !== mealId);
        if (this.weeklyMenu[day].length === 0) {
            delete this.weeklyMenu[day];
        }
        this.saveWeeklyMenu();
        this.renderWeeklyMenu();
        this.showNotification('Repas supprimé du menu');
    }

    renderWeeklyMenu() {
        const container = document.getElementById('weeklyMenu');
        const days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

        if (Object.keys(this.weeklyMenu).length === 0) {
            container.innerHTML = '<p class="empty-state">Aucun menu planifié. Ajoutez des repas ou importez un fichier JSON.</p>';
            return;
        }

        container.innerHTML = days.map(day => {
            const meals = this.weeklyMenu[day] || [];
            if (meals.length === 0) return '';

            const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

            return `
                <div class="day-card">
                    <div class="day-header">
                        <div class="day-name">${day}</div>
                        <div class="day-total">${totalCalories} kcal</div>
                    </div>
                    <div class="meals-grid">
                        ${meals.map(meal => `
                            <div class="menu-meal">
                                <div class="menu-meal-info">
                                    <div class="menu-meal-type">${meal.type}</div>
                                    <div class="menu-meal-name">${meal.name}</div>
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <span class="menu-meal-calories">${meal.calories} kcal</span>
                                    <button class="btn-delete-meal" onclick="tracker.deleteMenuMeal('${day}', ${meal.id})">
                                        ×
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    importMenu(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Validate JSON structure
                if (typeof data !== 'object') {
                    throw new Error('Format JSON invalide');
                }

                this.weeklyMenu = data;
                this.saveWeeklyMenu();
                this.renderWeeklyMenu();
                this.showNotification('Menu importé avec succès !');
            } catch (error) {
                this.showNotification('Erreur lors de l\'import: ' + error.message);
            }
        };
        reader.readAsText(file);

        // Reset file input
        document.getElementById('jsonFile').value = '';
    }

    exportMenu() {
        if (Object.keys(this.weeklyMenu).length === 0) {
            this.showNotification('Aucun menu à exporter');
            return;
        }

        const dataStr = JSON.stringify(this.weeklyMenu, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `menu-semaine-${this.getTodayKey()}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showNotification('Menu exporté avec succès !');
    }

    clearMenu() {
        this.weeklyMenu = {};
        this.saveWeeklyMenu();
        this.renderWeeklyMenu();
        this.showNotification('Menu effacé');
    }

    // ===== UTILITY FUNCTIONS =====
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const dateKey = dateStr;
        const todayKey = this.getTodayKey();
        const yesterdayKey = yesterday.toISOString().split('T')[0];

        if (dateKey === todayKey) return 'Aujourd\'hui';
        if (dateKey === yesterdayKey) return 'Hier';

        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        return date.toLocaleDateString('fr-FR', options);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // ===== LOCALSTORAGE METHODS =====
    loadMeals() {
        const todayKey = this.getTodayKey();
        const saved = localStorage.getItem(`meals_${todayKey}`);
        return saved ? JSON.parse(saved) : [];
    }

    saveMeals() {
        const todayKey = this.getTodayKey();
        localStorage.setItem(`meals_${todayKey}`, JSON.stringify(this.meals));
    }

    loadHistory() {
        const saved = localStorage.getItem('diet_history');
        return saved ? JSON.parse(saved) : {};
    }

    saveHistory() {
        localStorage.setItem('diet_history', JSON.stringify(this.history));
    }

    loadMeasurements() {
        const saved = localStorage.getItem('measurements');
        return saved ? JSON.parse(saved) : [];
    }

    saveMeasurements() {
        localStorage.setItem('measurements', JSON.stringify(this.measurements));
    }

    loadWeeklyMenu() {
        const saved = localStorage.getItem('weekly_menu');
        return saved ? JSON.parse(saved) : {};
    }

    saveWeeklyMenu() {
        localStorage.setItem('weekly_menu', JSON.stringify(this.weeklyMenu));
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app
const tracker = new DietTracker();

// Auto-save to history at end of day
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 23 && now.getMinutes() === 59 && tracker.meals.length > 0) {
        tracker.saveToHistory();
    }
}, 60000);
