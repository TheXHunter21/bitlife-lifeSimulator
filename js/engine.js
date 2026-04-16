/* engine.js */

// Un jugador base provisional para la Fase 1
const basePlayer = {
    name: "Crea un personaje",
    title: "Crea un personaje",
    money: 0,
    ageMonths: 0,
    happiness: 50,
    health: 50,
    intelligence: 50,
    looks: 50,
    charisma: 50
};

// Referencias a elementos del DOM
const dom = {
    lifeLog: document.getElementById('life-log'),
    playerName: document.getElementById('player-name'),
    playerTitle: document.getElementById('player-title'),
    playerMoney: document.getElementById('player-money'),
    
    // Barras de estado
    barHappiness: document.getElementById('bar-happiness'),
    barHealth: document.getElementById('bar-health'),
    barSmarts: document.getElementById('bar-smarts'),
    barLooks: document.getElementById('bar-looks'),
    barCharisma: document.getElementById('bar-charisma'),
    
    // Botones
    btnAge: document.getElementById('btn-age'),
    
    // Modal
    modalContainer: document.getElementById('modal-container'),
    modalTitle: document.getElementById('modal-title'),
    modalBody: document.getElementById('modal-body'),
    btnCloseModal: document.getElementById('btn-close-modal')
};

// Función para actualizar la UI con los datos del jugador base
function updateUI() {
    dom.playerName.textContent = basePlayer.name;
    dom.playerTitle.textContent = basePlayer.title;
    dom.playerMoney.textContent = `€${basePlayer.money.toLocaleString('es-ES')}`;
    
    updateBar(dom.barHappiness, basePlayer.happiness);
    updateBar(dom.barHealth, basePlayer.health);
    updateBar(dom.barSmarts, basePlayer.intelligence);
    updateBar(dom.barLooks, basePlayer.looks);
    updateBar(dom.barCharisma, basePlayer.charisma);
}

// Función auxiliar para actualizar una barra de estado individual
function updateBar(barElement, value) {
    barElement.style.width = `${value}%`;
    barElement.textContent = `${value}%`;
}

// Función para añadir una entrada al registro de vida
function addToLog(text, type = 'event') {
    const entry = document.createElement('div');
    entry.classList.add('log-entry');
    entry.classList.add(`log-${type}`);
    entry.innerHTML = text;
    dom.lifeLog.appendChild(entry);
    
    // Autoscroll hacia abajo
    dom.lifeLog.parentElement.scrollTop = dom.lifeLog.parentElement.scrollHeight;
}

// Lógica de "Avanzar Edad" para la Fase 1
function advanceAge() {
    // Definimos el salto de edad (12 meses por defecto para la Fase 1)
    const ageJumpMonths = 12;
    basePlayer.ageMonths += ageJumpMonths;
    const currentAgeYears = Math.floor(basePlayer.ageMonths / 12);
    
    // Añadimos el título del año al registro
    addToLog(`Age: ${currentAgeYears} years`, 'year');
    
    // Simulamos un evento simple para la Fase 1
    const dummyEvent = {
        title: "He avanzado otro año",
        description: `Tengo ${currentAgeYears} años. No ha pasado nada especial. Mis estadísticas siguen igual.`
    };
    
    addToLog(`${dummyEvent.title}. ${dummyEvent.description}`);
}

// Lógica de Modales (para submenús)
function openModal(title, content) {
    dom.modalTitle.textContent = title;
    dom.modalBody.innerHTML = content;
    dom.modalContainer.classList.remove('hidden');
}

function closeModal() {
    dom.modalContainer.classList.add('hidden');
}

// Inicialización
updateUI();

// Event Listeners
dom.btnAge.addEventListener('click', advanceAge);
dom.btnCloseModal.addEventListener('click', closeModal);

// Event Listeners para botones de menú (simulación para Fase 1)
document.getElementById('btn-occupation').addEventListener('click', () => openModal('OCCUPATION', 'Este es el menú de ocupación. JS lo llenará más adelante.'));
document.getElementById('btn-assets').addEventListener('click', () => openModal('ASSETS', 'Este es el menú de activos. JS lo llenará más adelante.'));
document.getElementById('btn-relationships').addEventListener('click', () => openModal('RELATIONSHIPS', 'Este es el menú de relaciones. JS lo llenará más adelante.'));
document.getElementById('btn-activities').addEventListener('click', () => openModal('ACTIVITIES', 'Este es el menú de actividades. JS lo llenará más adelante.'));

// Botón de perfil (simulación)
document.getElementById('btn-profile').addEventListener('click', () => openModal('MI PERFIL', 'Este es tu perfil. JS lo llenará con tus datos.'));