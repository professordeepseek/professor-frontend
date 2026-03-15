// ==================== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ====================
const AppState = {
    user: null,
    diagnostics: null,
    currentBlock: 'registration', // registration, diagnostics, results, trajectory, chat
    messageHistory: []
};

// ==================== ЗАГРУЗКА ИЗ LOCALSTORAGE ====================
function loadFromStorage() {
    const saved = localStorage.getItem('professorUser');
    if (saved) {
        try {
            AppState.user = JSON.parse(saved);
            if (AppState.user.diagnosticsCompleted) {
                AppState.currentBlock = 'results';
                AppState.diagnostics = AppState.user.diagnostics;
            } else {
                AppState.currentBlock = 'registration';
            }
        } catch (e) {
            console.error('Ошибка загрузки пользователя');
        }
    }
    return AppState;
}

// ==================== СОХРАНЕНИЕ В STORAGE ====================
function saveToStorage() {
    if (AppState.user) {
        localStorage.setItem('professorUser', JSON.stringify(AppState.user));
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
function initApp() {
    loadFromStorage();
    
    // Показываем левую панель в зависимости от блока
    if (AppState.currentBlock === 'registration') {
        showRegistration();
    } else if (AppState.currentBlock === 'results') {
        showResults();
    }
}

// ==================== ЭКСПОРТ (все функции будут глобальными) ====================
window.AppState = AppState;
window.loadFromStorage = loadFromStorage;
window.saveToStorage = saveToStorage;
window.initApp = initApp;
