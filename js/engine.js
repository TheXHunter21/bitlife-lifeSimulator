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
    charisma: 50,
    educationHistory: [], // Ej: Guardará ["Escuela Secundaria", "Universidad"]
    mainOccupation: null, // Guardará el trabajo o escuela actual
    partTimeJob: null,
    freelanceJobs: []
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

// --- SISTEMA DE ETAPAS DE VIDA ---
function checkLifeStages() {
    const age = basePlayer.age;

    // Inicial (3 años) - 80% probabilidad
    if (age === 3 && Math.random() <= 0.80) {
        basePlayer.mainOccupation = { name: "Educación Inicial", salary: 0 };
        addToLog("Tus padres te han inscrito en educación inicial.");
    }
    // Primaria (6 años)
    else if (age === 6) {
        basePlayer.mainOccupation = { name: "Escuela Primaria", salary: 0 };
        addToLog("Has empezado la escuela primaria.");
    }
    // Secundaria (12 años)
    else if (age === 12) {
        basePlayer.mainOccupation = { name: "Escuela Secundaria", salary: 0 };
        addToLog("Has empezado la escuela secundaria.");
    }
    // Graduación Secundaria (17 años)
    else if (age === 17 && basePlayer.mainOccupation && basePlayer.mainOccupation.name === "Escuela Secundaria") {
        basePlayer.mainOccupation = null; // Quedas libre para la universidad o trabajo
        // Guardamos que terminaste la secundaria para cumplir requisitos futuros
        if (!basePlayer.educationHistory.includes("Escuela Secundaria")) {
            basePlayer.educationHistory.push("Escuela Secundaria");
        }
        addToLog("¡Te has graduado de la escuela secundaria!");
    }
}

// Lógica de "Avanzar Edad" para la Fase 1
// Lógica de "Avanzar Edad" conectada al EventManager
// Lógica de "Avanzar Edad" conectada al nuevo EventManager
// Lógica de "Avanzar Edad" conectada al nuevo EventManager y EconomyManager
function advanceAge() {
    // Definimos el salto de edad (12 meses)
    const ageJumpMonths = 12;
    basePlayer.ageMonths += ageJumpMonths;
    const currentAgeYears = Math.floor(basePlayer.ageMonths / 12);
    basePlayer.age = currentAgeYears;
    
    // Añadimos el título del año al registro
    addToLog(`Age: ${currentAgeYears} years`, 'year');
    
    // COMPROBAR ETAPAS ESCOLARES (Nuevo)
    checkLifeStages();
    
    // --- 1. PROCESAR LA ECONOMÍA ---
    const economyReport = EconomyManager.processYear(basePlayer);
    if (economyReport) { // Si el Gestor devolvió texto (no fue null)
        addToLog(economyReport, 'finance');
    }
    
    // --- 2. PROCESAR EVENTOS ALEATORIOS ---
    const occurredEvent = EventManager.getRandomEvent(basePlayer);
    
    // Evaluamos qué hacer con el evento
    if (occurredEvent) {
        EventRenderer.renderEvent(occurredEvent);
    } else {
        // Solo si NO hubo evento, imprimimos año tranquilo
        addToLog(`Tienes ${currentAgeYears} años. Ha sido un año tranquilo.`);
    }
}

// Lógica de Modales (para submenús)
// Lógica de Modales (actualizada para soportar Nodos DOM y strings)
function openModal(title, content) {
    dom.modalTitle.textContent = title;
    
    // 1. Limpiamos cualquier cosa que hubiera antes en el modal
    dom.modalBody.innerHTML = '';
    
    // 2. Verificamos si nos enviaron texto o un objeto HTML
    if (typeof content === 'string') {
        dom.modalBody.innerHTML = content;
    } else {
        // Si es un objeto, lo añadimos como "hijo", conservando sus botones y clics
        dom.modalBody.appendChild(content);
    }
    
    dom.modalContainer.classList.remove('hidden');
}

function closeModal() {
    dom.modalContainer.classList.add('hidden');
}
// Event Listeners
dom.btnAge.addEventListener('click', advanceAge);
dom.btnCloseModal.addEventListener('click', closeModal);

// Event Listeners para botones de menú (simulación para Fase 1)
// --- SISTEMA DE MENÚS DINÁMICOS ---

// --- SISTEMA DE MENÚS DINÁMICOS ---

function openOccupationMenu() {
    const container = document.createElement('div');
    container.className = 'occupation-menu';

    // 1. SECCIÓN: OCUPACIÓN ACTUAL ("You")
    if (basePlayer.mainOccupation) {
        const youTitle = document.createElement('div');
        youTitle.innerHTML = '<h3 style="background-color: #6c757d; color: white; padding: 5px; margin: 0; text-align: center; border-radius: 4px;">TÚ (You)</h3>';
        container.appendChild(youTitle);

        const currentOccBtn = document.createElement('button');
        currentOccBtn.className = 'choice-btn';
        currentOccBtn.style.width = '100%';
        currentOccBtn.style.marginBottom = '20px';
        currentOccBtn.style.backgroundColor = '#fff';
        currentOccBtn.style.color = 'var(--text-color)';
        currentOccBtn.style.border = '2px solid var(--primary-color)';
        currentOccBtn.innerHTML = `<strong>${basePlayer.mainOccupation.name}</strong>`;

        // Opcion de renunciar o dejar la escuela
        currentOccBtn.addEventListener('click', () => {
            if(confirm(`¿Quieres dejar tu ocupación actual: ${basePlayer.mainOccupation.name}?`)) {
                addToLog(`Has abandonado: ${basePlayer.mainOccupation.name}`);
                basePlayer.mainOccupation = null;
                closeModal();
                updateUI();
            }
        });
        container.appendChild(currentOccBtn);
    }

    // 2. SECCIÓN: OPCIONES DISPONIBLES
    const available = OccupationManager.getAvailableOccupations(basePlayer);
    const categoryNames = { education: 'Educación', fullTime: 'Trabajos', partTime: 'Medio Tiempo', freelance: 'Freelance' };

    let hasOptions = false;

    for (const [category, occupations] of Object.entries(available)) {
        if (occupations.length > 0) {
            hasOptions = true;
            
            const title = document.createElement('h3');
            title.textContent = categoryNames[category] || category;
            title.style.backgroundColor = '#f0f0f5';
            title.style.padding = '8px';
            title.style.margin = '10px 0 5px 0';
            title.style.textAlign = 'center';
            title.style.borderRadius = '4px';
            container.appendChild(title);

            occupations.forEach(occ => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.style.width = '100%';
                btn.style.marginBottom = '8px';
                btn.style.display = 'flex';
                btn.style.justifyContent = 'space-between';
                btn.style.backgroundColor = '#fff';
                btn.style.color = 'var(--text-color)';
                btn.style.border = '1px solid #e5e5ea';

                let extraText = occ.salary ? `€${occ.salary.toLocaleString('es-ES')}` : '';
                if (occ.incomePerGig) extraText = `€${occ.incomePerGig.toLocaleString('es-ES')}/vez`;
                btn.innerHTML = `<span>${occ.name}</span> <strong>${extraText}</strong>`;

                btn.addEventListener('click', () => {
                    // Si es universidad y tiene "majors" (carreras), abrimos sub-menú
                    if (occ.majors && occ.majors.length > 0) {
                        showMajorSelection(occ);
                    } else {
                        assignOccupation(occ, category);
                    }
                });

                container.appendChild(btn);
            });
        }
    }

    if (!hasOptions && !basePlayer.mainOccupation) {
        container.innerHTML += '<p style="text-align: center; color: #8e8e93; margin-top: 20px;">No hay opciones disponibles. Avanza de edad.</p>';
    }

    openModal('OCCUPATION', container);
}

// Funciones auxiliares para el menú de ocupaciones
function assignOccupation(occ, category) {
    if (category === 'partTime') {
        basePlayer.partTimeJob = occ;
        addToLog(`Trabajas a medio tiempo: ${occ.name}.`);
    } else if (category === 'freelance') {
        basePlayer.money += occ.incomePerGig;
        addToLog(`Hiciste un trabajo de ${occ.name} y ganaste €${occ.incomePerGig}.`, 'finance');
    } else {
        basePlayer.mainOccupation = occ;
        if (category === 'education' && !basePlayer.educationHistory.includes(occ.name)) {
            basePlayer.educationHistory.push(occ.name);
        }
        addToLog(`Has empezado una nueva etapa: ${occ.name}.`);
    }
    closeModal();
    updateUI();
}

function showMajorSelection(occ) {
    const container = document.createElement('div');
    container.className = 'event-form';
    
    container.innerHTML = `
        <p style="text-align: center; margin-bottom: 20px;">¡Aplica a la universidad hoy!</p>
        <label>Elige tu carrera (Major):</label>
    `;
    
    const select = document.createElement('select');
    select.className = 'form-select';
    occ.majors.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        select.appendChild(opt);
    });
    container.appendChild(select);

    const btnSubmit = document.createElement('button');
    btnSubmit.className = 'choice-btn';
    btnSubmit.textContent = 'Aplicar a la Universidad';
    btnSubmit.addEventListener('click', () => {
        const chosenMajor = select.value;
        // Creamos una nueva ocupación combinando el nombre y la carrera
        const customOcc = { ...occ, name: `${occ.name} (${chosenMajor})` };
        assignOccupation(customOcc, 'education');
    });
    container.appendChild(btnSubmit);

    openModal('UNIVERSITY', container);
}

// Conectar el botón del menú a la nueva función
document.getElementById('btn-occupation').addEventListener('click', openOccupationMenu);
document.getElementById('btn-assets').addEventListener('click', () => openModal('ASSETS', 'Este es el menú de activos. JS lo llenará más adelante.'));
document.getElementById('btn-relationships').addEventListener('click', () => openModal('RELATIONSHIPS', 'Este es el menú de relaciones. JS lo llenará más adelante.'));
document.getElementById('btn-activities').addEventListener('click', () => openModal('ACTIVITIES', 'Este es el menú de actividades. JS lo llenará más adelante.'));

// Botón de perfil (simulación)
document.getElementById('btn-profile').addEventListener('click', () => openModal('MI PERFIL', 'Este es tu perfil. JS lo llenará con tus datos.'));

// --- INICIALIZACIÓN DEL JUEGO ---
updateUI(); // Se llama una sola vez

// Cargar Eventos y Ocupaciones al iniciar
Promise.all([
    EventManager.loadEvents(),
    OccupationManager.loadOccupations()
]).then(() => {
    console.log("¡Motor de Eventos y Ocupaciones listos!");
}).catch(err => {
    console.error("Hubo un problema iniciando el motor:", err);
});
