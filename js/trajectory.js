// ==================== ИНДИВИДУАЛЬНАЯ ТРАЕКТОРИЯ ====================

// Показываем индивидуальную траекторию в левой панели
function showTrajectory() {
    const leftPanel = document.getElementById('leftPanel');
    if (!leftPanel || !AppState.user || !AppState.diagnostics) return;

    const diagnostics = AppState.diagnostics;
    const level = AppState.user.level || 'НОВИЧОК';

    // Определяем слабые места
    const weakTopics = [];
    if (diagnostics.math.wrongTopics.length > 0) {
        weakTopics.push(...diagnostics.math.wrongTopics.map(t => t.topic));
    }
    if (diagnostics.logic.wrongTopics.length > 0) {
        weakTopics.push(...diagnostics.logic.wrongTopics.map(t => t.topic));
    }
    if (diagnostics.physics.wrongTopics.length > 0) {
        weakTopics.push(...diagnostics.physics.wrongTopics.map(t => t.topic));
    }

    // Уникальные темы
    const uniqueTopics = [...new Set(weakTopics)];

    let plan = '';

    if (level === 'НОВИЧОК') {
        plan = `
            <p>🌟 <strong>Начальный уровень</strong></p>
            <p>Рекомендуется начать с раздела <strong>«Кинематика»</strong>:</p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Равномерное движение</li>
                <li>Скорость и перемещение</li>
                <li>Простые задачи на катер и течение</li>
            </ul>
            ${uniqueTopics.length > 0 ? `<p style="margin-top: 15px;"><strong>Особое внимание:</strong> темы ${uniqueTopics.slice(0, 3).join(', ')}</p>` : ''}
        `;
    } else if (level === 'МАСТЕР') {
        plan = `
            <p>🔥 <strong>Средний уровень</strong></p>
            <p>Рекомендуется перейти к задачам средней сложности:</p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Двумерное движение (самолёт)</li>
                <li>Встречное движение (две лодки)</li>
                <li>Графические методы</li>
            </ul>
            ${uniqueTopics.length > 0 ? `<p style="margin-top: 15px;"><strong>Проработать:</strong> темы ${uniqueTopics.slice(0, 3).join(', ')}</p>` : ''}
        `;
    } else {
        plan = `
            <p>⚡ <strong>Продвинутый уровень</strong></p>
            <p>Рекомендуются сложные и олимпиадные задачи:</p>
            <ul style="margin-left: 20px; margin-top: 10px;">
                <li>Баллистика</li>
                <li>Нестандартные задачи</li>
                <li>Анализ сложных графиков</li>
            </ul>
            ${uniqueTopics.length > 0 ? `<p style="margin-top: 15px;"><strong>Обратить внимание:</strong> ${uniqueTopics.slice(0, 3).join(', ')}</p>` : ''}
        `;
    }

    leftPanel.innerHTML = `
        <div class="reg-form">
            <h2>🗺️ Индивидуальная траектория</h2>
            <div style="margin: 20px 0;">${plan}</div>
            <button id="startLearningBtn" class="btn-primary" style="width: 100%; margin-top: 20px;">Начать обучение</button>
        </div>
    `;

    document.getElementById('startLearningBtn')?.addEventListener('click', () => {
        AppState.currentBlock = 'chat';
        showProfile();
        addChatMessage(`Хорошо, ${AppState.user.firstName}. Давайте начнём с простой задачи.`, 'prof');
    });
}

// Экспорт
window.showTrajectory = showTrajectory;
