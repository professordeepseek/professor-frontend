// ==================== РЕЗУЛЬТАТЫ ДИАГНОСТИКИ ====================

// Показываем результаты в левой панели
function showResults(diagnostics, level) {
    const leftPanel = document.getElementById('leftPanel');
    if (!leftPanel) return;

    const mathPercent = Math.round((diagnostics.math.correct / diagnostics.math.total) * 100) || 0;
    const logicPercent = Math.round((diagnostics.logic.correct / diagnostics.logic.total) * 100) || 0;
    const physicsPercent = Math.round((diagnostics.physics.correct / diagnostics.physics.total) * 100) || 0;

    let levelClass = 'level-novice';
    let levelDescription = '';
    let recommendations = '';

    switch(level) {
        case 'НОВИЧОК':
            levelClass = 'level-novice';
            levelDescription = 'Вы только начинаете знакомство с физикой. Многие темы требуют подробного разбора.';
            recommendations = 'Рекомендуем начать с самых основ: кинематика, равномерное движение, простые задачи.';
            break;
        case 'МАСТЕР':
            levelClass = 'level-master';
            levelDescription = 'У вас хорошая база. Вы уверенно решаете типовые задачи, но можете ошибаться в нестандартных ситуациях.';
            recommendations = 'Рекомендуем перейти к задачам средней сложности и обратить внимание на темы, где были ошибки.';
            break;
        case 'ИССЛЕДОВАТЕЛЬ':
            levelClass = 'level-researcher';
            levelDescription = 'Вы отлично понимаете физику. Готовы к олимпиадным задачам и нестандартным подходам.';
            recommendations = 'Рекомендуем попробовать сложные задачи и графические методы решения.';
            break;
    }

    // Формируем комментарии по разделам
    const mathComment = getSectionComment('math', mathPercent, diagnostics.math.wrongTopics);
    const logicComment = getSectionComment('logic', logicPercent, diagnostics.logic.wrongTopics);
    const physicsComment = getSectionComment('physics', physicsPercent, diagnostics.physics.wrongTopics);

    leftPanel.innerHTML = `
        <div class="reg-form">
            <h2>📊 Результаты диагностики</h2>
            
            <div class="diag-table">
                <div class="diag-row">
                    <span class="diag-label">МАТЕМАТИКА</span>
                    <div class="diag-bar"><div class="diag-fill" style="width:${mathPercent}%"></div></div>
                    ${mathPercent}%
                </div>
                <div class="diag-row">
                    <span class="diag-label">ЛОГИКА</span>
                    <div class="diag-bar"><div class="diag-fill" style="width:${logicPercent}%"></div></div>
                    ${logicPercent}%
                </div>
                <div class="diag-row">
                    <span class="diag-label">ФИЗИКА</span>
                    <div class="diag-bar"><div class="diag-fill" style="width:${physicsPercent}%"></div></div>
                    ${physicsPercent}%
                </div>
            </div>

            <div style="margin: 20px 0; text-align: center;">
                <span class="level-badge ${levelClass}">${level}</span>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #f0f7ff; border-radius: 16px;">
                <p><strong>Что это значит:</strong> ${levelDescription}</p>
            </div>

            <div style="margin: 20px 0;">
                <h3>Подробный разбор</h3>
                <p><strong>📐 Математика:</strong> ${mathComment}</p>
                <p><strong>🧠 Логика:</strong> ${logicComment}</p>
                <p><strong>⚛️ Физика:</strong> ${physicsComment}</p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background: #e2ebf5; border-radius: 16px;">
                <p><strong>🎯 Рекомендация:</strong> ${recommendations}</p>
            </div>

            <button id="nextStepBtn" class="btn-primary" style="width: 100%;">Продолжить к задачам</button>
        </div>
    `;

    document.getElementById('nextStepBtn')?.addEventListener('click', () => {
        AppState.currentBlock = 'chat';
        showProfile(); // возвращаем профиль
        addChatMessage('Отлично! Теперь можем перейти к задачам. Выберите тему или просто напишите вопрос.', 'prof');
    });
}

// Вспомогательная функция для комментариев по разделам
function getSectionComment(section, percent, wrongTopics) {
    if (percent >= 80) {
        return 'Отличный результат! Можно переходить к сложным задачам.';
    } else if (percent >= 50) {
        if (wrongTopics && wrongTopics.length > 0) {
            const topics = [...new Set(wrongTopics.map(t => t.topic))].join(', ');
            return `Хороший уровень. Обратите внимание на темы: ${topics}.`;
        }
        return 'Хороший уровень. Продолжайте практиковаться.';
    } else {
        if (wrongTopics && wrongTopics.length > 0) {
            const topics = [...new Set(wrongTopics.map(t => t.topic))].join(', ');
            return `Нужно подтянуть основы. Рекомендуем начать с тем: ${topics}.`;
        }
        return 'Нужно подтянуть основы. Начнём с простых задач.';
    }
}

// Экспорт
window.showResults = showResults;
