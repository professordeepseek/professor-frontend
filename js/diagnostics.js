// ==================== ДИАГНОСТИКА ====================

// Состояние диагностики
const DiagState = {
    active: false,
    section: 'math', // math, logic, physics
    questionCount: 0,
    maxQuestions: 7, // по 7 вопросов на раздел
    answers: {
        math: { correct: 0, total: 0, wrongTopics: [] },
        logic: { correct: 0, total: 0, wrongTopics: [] },
        physics: { correct: 0, total: 0, wrongTopics: [] }
    },
    currentQuestion: null
};

// ==================== ВОПРОСЫ (база) ====================
const Questions = {
    math: [
        { text: "Сколько метров в 3.5 километрах?", topic: "units", check: (a) => parseFloat(a) === 3500 },
        { text: "Выразите скорость 72 км/ч в м/с", topic: "units", check: (a) => parseFloat(a) === 20 },
        { text: "Решите уравнение: 2x + 5 = 15", topic: "equations", check: (a) => parseFloat(a) === 5 },
        { text: "Чему равен синус 30 градусов?", topic: "trig", check: (a) => parseFloat(a) === 0.5 || a.includes('0.5') },
        { text: "Вычислите: (2³ + 4) / 3", topic: "arithmetic", check: (a) => parseFloat(a) === 4 },
        { text: "Сколько секунд в 2 часах?", topic: "time", check: (a) => parseFloat(a) === 7200 },
        { text: "Чему равно 15% от 200?", topic: "percent", check: (a) => parseFloat(a) === 30 }
    ],
    logic: [
        { text: "Если все A суть B, а некоторые B суть C, то обязательно ли некоторые A суть C?", topic: "logic", 
          check: (a) => a.toLowerCase().includes('не') || a.toLowerCase().includes('нет') },
        { text: "У трёх братьев по одной сестре. Сколько детей в семье?", topic: "family", 
          check: (a) => parseInt(a) === 4 },
        { text: "Что тяжелее: килограмм ваты или килограмм железа?", topic: "mass", 
          check: (a) => a.toLowerCase().includes('одинак') || a.toLowerCase().includes('равн') },
        { text: "Продолжите последовательность: 2, 4, 8, 16, ...", topic: "sequence", 
          check: (a) => parseInt(a) === 32 },
        { text: "В коробке 10 красных и 5 синих шаров. Сколько шаров нужно вытащить, чтобы гарантированно иметь 2 одного цвета?", 
          topic: "combinatorics", check: (a) => parseInt(a) === 3 },
        { text: "Если в 12 часов ночи идёт дождь, то можно ли ожидать, что через 72 часа будет солнечно?", 
          topic: "time", check: (a) => a.toLowerCase().includes('нет') || a.toLowerCase().includes('ночь') },
        { text: "Что больше: сумма чисел от 1 до 10 или произведение?", topic: "compare", 
          check: (a) => a.toLowerCase().includes('сумм') }
    ],
    physics: [
        { text: "Что изучает кинематика?", topic: "kinematics", 
          check: (a) => a.toLowerCase().includes('движ') && !a.toLowerCase().includes('причин') },
        { text: "В каких единицах измеряется скорость в СИ?", topic: "units", 
          check: (a) => a.includes('м/с') },
        { text: "Чем путь отличается от перемещения?", topic: "vectors", 
          check: (a) => a.toLowerCase().includes('вектор') || a.toLowerCase().includes('направл') },
        { text: "Какое ускорение свободного падения на Земле?", topic: "gravity", 
          check: (a) => a.includes('9.8') || a.includes('10') },
        { text: "Что такое инерция?", topic: "inertia", 
          check: (a) => a.toLowerCase().includes('сохран') && a.toLowerCase().includes('скорост') },
        { text: "Какая сила тяжести действует на тело массой 2 кг?", topic: "force", 
          check: (a) => parseFloat(a) === 19.6 || parseFloat(a) === 20 },
        { text: "Тело брошено вертикально вверх. Где его скорость равна нулю?", topic: "motion", 
          check: (a) => a.toLowerCase().includes('верх') || a.toLowerCase().includes('макс') }
    ]
};

// ==================== ЗАПУСК ДИАГНОСТИКИ ====================
function startDiagnostics() {
    if (!AppState.user) return;
    
    DiagState.active = true;
    DiagState.section = 'math';
    DiagState.questionCount = 0;
    DiagState.answers = {
        math: { correct: 0, total: 0, wrongTopics: [] },
        logic: { correct: 0, total: 0, wrongTopics: [] },
        physics: { correct: 0, total: 0, wrongTopics: [] }
    };
    
    addChatMessage('Хорошо. Начнём с математики. Ответьте на несколько вопросов.', 'prof');
    askNextQuestion();
}

// ==================== СЛЕДУЮЩИЙ ВОПРОС ====================
function askNextQuestion() {
    if (!DiagState.active) return;
    
    // Проверяем, не закончили ли раздел
    if (DiagState.questionCount >= DiagState.maxQuestions) {
        // Переходим к следующему разделу
        if (DiagState.section === 'math') {
            DiagState.section = 'logic';
            DiagState.questionCount = 0;
            addChatMessage('Хорошо. Теперь несколько вопросов по логике.', 'prof');
        } else if (DiagState.section === 'logic') {
            DiagState.section = 'physics';
            DiagState.questionCount = 0;
            addChatMessage('Отлично. Перейдём к физике.', 'prof');
        } else {
            // Все разделы пройдены
            finishDiagnostics();
            return;
        }
    }
    
    // Выбираем случайный вопрос из текущего раздела
    const sectionQuestions = Questions[DiagState.section];
    const randomIndex = Math.floor(Math.random() * sectionQuestions.length);
    const question = sectionQuestions[randomIndex];
    
    DiagState.currentQuestion = question;
    DiagState.answers[DiagState.section].total++;
    DiagState.questionCount++;
    
    addChatMessage(question.text, 'prof');
}

// ==================== ОБРАБОТКА ОТВЕТА ====================
function handleDiagnosticAnswer(text) {
    if (!DiagState.active || !DiagState.currentQuestion) return;
    
    const question = DiagState.currentQuestion;
    const section = DiagState.section;
    
    if (question.check(text)) {
        // Правильный ответ
        DiagState.answers[section].correct++;
        addChatMessage('Верно!', 'prof');
    } else {
        // Неправильный ответ
        DiagState.answers[section].wrongTopics.push({
            topic: question.topic,
            answer: text,
            question: question.text
        });
        
        // Профессор реагирует в зависимости от ошибки
        if (text.toLowerCase().includes('не знаю') || text.toLowerCase().includes('понятия не имею')) {
            addChatMessage('Ничего страшного. Это не самая простая тема. Запомним, что здесь нужно подтянуть.', 'prof');
        } else {
            addChatMessage('Хм, интересный ответ. Правильный ответ немного другой. Но мы это учтём.', 'prof');
        }
    }
    
    // Следующий вопрос через небольшую паузу
    setTimeout(askNextQuestion, 1000);
}

// ==================== ЗАВЕРШЕНИЕ ДИАГНОСТИКИ ====================
function finishDiagnostics() {
    DiagState.active = false;
    
    // Сохраняем результаты
    AppState.diagnostics = DiagState.answers;
    AppState.user.diagnostics = DiagState.answers;
    AppState.user.diagnosticsCompleted = true;
    
    // Вычисляем проценты
    const mathPercent = Math.round((DiagState.answers.math.correct / DiagState.answers.math.total) * 100) || 0;
    const logicPercent = Math.round((DiagState.answers.logic.correct / DiagState.answers.logic.total) * 100) || 0;
    const physicsPercent = Math.round((DiagState.answers.physics.correct / DiagState.answers.physics.total) * 100) || 0;
    const avg = Math.round((mathPercent + logicPercent + physicsPercent) / 3);
    
    let level = 'НОВИЧОК';
    if (avg >= 76) level = 'ИССЛЕДОВАТЕЛЬ';
    else if (avg >= 41) level = 'МАСТЕР';
    
    AppState.user.level = level;
    saveToStorage();
    
    addChatMessage(`${AppState.user.firstName}, диагностика завершена. Сейчас покажу результаты.', 'prof`);
    
    // Показываем результаты
    if (typeof window.showResults === 'function') {
        window.showResults(DiagState.answers, level);
    }
}

// ==================== ЭКСПОРТ ====================
window.DiagState = DiagState;
window.Questions = Questions;
window.startDiagnostics = startDiagnostics;
window.handleDiagnosticAnswer = handleDiagnosticAnswer;
