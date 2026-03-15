// ==================== РЕГИСТРАЦИЯ ====================

// Показываем форму регистрации в левой панели
function showRegistration() {
    const leftPanel = document.getElementById('leftPanel');
    if (!leftPanel) return;
    
    leftPanel.innerHTML = `
        <div class="reg-form">
            <h2>📋 Регистрация</h2>
            <p style="margin-bottom: 20px; color: #1e4660;">Заполните форму, чтобы профессор мог обращаться к вам лично.</p>
            <input type="text" id="regLastName" placeholder="Фамилия *" required>
            <input type="text" id="regFirstName" placeholder="Имя *" required>
            <input type="email" id="regEmail" placeholder="E-mail *" required>
            <select id="regCategory" required>
                <option value="" disabled selected>— Выберите категорию — *</option>
                <option value="school">Школьник</option>
                <option value="student">Студент (будущий педагог)</option>
            </select>
            <input type="text" id="regGroup" placeholder="Школа / Группа (необязательно)">
            <button id="registerBtn">Начать работу</button>
        </div>
    `;
    
    document.getElementById('registerBtn')?.addEventListener('click', registerUser);
}

// Обработка регистрации
function registerUser() {
    const firstName = document.getElementById('regFirstName')?.value.trim();
    const lastName = document.getElementById('regLastName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const category = document.getElementById('regCategory')?.value;
    const group = document.getElementById('regGroup')?.value.trim();

    if (!firstName || !lastName || !email || !category) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        alert('Пожалуйста, введите корректный e-mail');
        return;
    }

    AppState.user = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        category: category,
        group: group,
        level: 'НОВИЧОК',
        registeredAt: new Date().toISOString()
    };

    AppState.currentBlock = 'diagnostics';
    saveToStorage();
    
    // Показываем профиль
    showProfile();
    
    // Сообщение в чат
    addChatMessage(`Очень приятно, ${firstName}! Я профессор Ньютонник. Готовы начать диагностику? Просто напишите "да" или "начнём".`, 'prof');
}

// Показываем профиль пользователя
function showProfile() {
    const leftPanel = document.getElementById('leftPanel');
    if (!leftPanel || !AppState.user) return;
    
    const user = AppState.user;
    const categoryText = user.category === 'school' ? 'Школьник' : 'Студент (будущий педагог)';
    
    leftPanel.innerHTML = `
        <div class="profile-card">
            <h2>👤 Ваш профиль</h2>
            <div class="profile-info"><strong>Имя:</strong> ${user.firstName} ${user.lastName}</div>
            <div class="profile-info"><strong>E-mail:</strong> ${user.email}</div>
            <div class="profile-info"><strong>Категория:</strong> ${categoryText}</div>
            <div class="profile-info"><strong>Школа/Группа:</strong> ${user.group || 'не указано'}</div>
            <div class="profile-info"><strong>Уровень:</strong> ${user.level || 'НОВИЧОК'}</div>
            <button id="resetBtn" style="background: #6c757d; margin-top: 20px;">Начать заново</button>
        </div>
    `;
    
    document.getElementById('resetBtn')?.addEventListener('click', resetUser);
}

// Сброс пользователя
function resetUser() {
    localStorage.removeItem('professorUser');
    AppState.user = null;
    AppState.diagnostics = null;
    AppState.currentBlock = 'registration';
    AppState.messageHistory = [];
    
    // Очищаем чат
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) chatWindow.innerHTML = '';
    
    showRegistration();
    addChatMessage('Здравствуйте! Давайте познакомимся. Заполните форму слева.', 'prof');
}

// Вспомогательная функция для добавления сообщения в чат
function addChatMessage(text, sender) {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;
    
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Делаем функции глобальными
window.showRegistration = showRegistration;
window.showProfile = showProfile;
window.registerUser = registerUser;
window.resetUser = resetUser;
window.addChatMessage = addChatMessage;
