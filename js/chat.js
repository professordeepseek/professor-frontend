// ==================== ЧАТ С ПРОФЕССОРОМ ====================

// URL бэкенда (ваш сервис на Render)
const BACKEND_URL = 'https://professor-backend-1.onrender.com/chat';

// Отправка сообщения
async function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    if (!text) return;

    // Добавляем сообщение пользователя в чат
    addChatMessage(text, 'user');
    input.value = '';

    // Если активна диагностика — передаём в обработчик диагностики
    if (typeof DiagState !== 'undefined' && DiagState.active) {
        if (typeof handleDiagnosticAnswer === 'function') {
            handleDiagnosticAnswer(text);
        }
        return;
    }

    // Проверка на команду начала диагностики
    if (AppState.user && !AppState.user.diagnosticsCompleted) {
        if (text.toLowerCase().includes('да') || 
            text.toLowerCase().includes('начнём') || 
            text.toLowerCase().includes('готов') ||
            text.toLowerCase().includes('поехали')) {
            
            if (typeof startDiagnostics === 'function') {
                startDiagnostics();
                return;
            }
        }
    }

    // Добавляем в историю
    AppState.messageHistory.push({ role: 'user', content: text });

    // Индикатор "думает"
    const thinkingId = 'think_' + Date.now();
    const thinkDiv = document.createElement('div');
    thinkDiv.className = 'message prof';
    thinkDiv.id = thinkingId;
    thinkDiv.innerText = '🤔 Профессор думает...';
    document.getElementById('chatWindow').appendChild(thinkDiv);

    try {
        // Отправляем запрос на бэкенд
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: AppState.messageHistory })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const reply = data.reply;

        // Убираем индикатор
        document.getElementById(thinkingId)?.remove();

        // Добавляем ответ профессора
        addChatMessage(reply, 'prof');
        AppState.messageHistory.push({ role: 'assistant', content: reply });

    } catch (error) {
        document.getElementById(thinkingId)?.remove();
        addChatMessage('Не удалось связаться с профессором. Проверьте соединение.', 'prof');
        console.error('Ошибка:', error);
    }
}

// Добавление сообщения в окно чата
function addChatMessage(text, sender) {
    const chatWindow = document.getElementById('chatWindow');
    if (!chatWindow) return;

    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Инициализация чата
function initChat() {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Приветствие если пользователь уже зарегистрирован
    if (AppState.user) {
        if (AppState.user.diagnosticsCompleted) {
            addChatMessage(`С возвращением, ${AppState.user.firstName}! Готовы продолжить?`, 'prof');
        } else {
            addChatMessage(`${AppState.user.firstName}, давайте проведём диагностику. Напишите "да" или "начнём".`, 'prof');
        }
    } else {
        addChatMessage('Здравствуйте! Заполните форму слева, чтобы я мог к вам обращаться.', 'prof');
    }
}

// Запускаем инициализацию после загрузки страницы
document.addEventListener('DOMContentLoaded', initChat);

// Экспорт
window.sendMessage = sendMessage;
window.addChatMessage = addChatMessage;
