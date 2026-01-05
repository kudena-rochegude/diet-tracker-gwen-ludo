// Diet Tracker App
class DietTracker {
    constructor() {
        this.meals = this.loadMeals();
        this.history = this.loadHistory();
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.updateSummary();
        this.renderMeals();
        this.renderHistory();
        this.attachEventListeners();
    }

    attachEventListeners() {
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

        // Reset form
        document.getElementById('mealForm').reset();

        // Animation feedback
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

        // Sort dates in descending order
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
        // Save to history before clearing
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
        // Simple notification (you could enhance this with a toast library)
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

    // LocalStorage methods
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
}, 60000); // Check every minute
