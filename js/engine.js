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
    freelanceJobs: [],
    assets: {
        properties: [],
        vehicles: [],
        possessions: []
    }
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
// --- SISTEMA DE ETAPAS DE VIDA ---
function checkLifeStages() {
    const age = basePlayer.age;

    // Función auxiliar para guardar la escuela anterior antes de pasar a la siguiente
    const savePreviousEducation = () => {
        if (basePlayer.mainOccupation && !basePlayer.educationHistory.includes(basePlayer.mainOccupation.name)) {
            basePlayer.educationHistory.push(basePlayer.mainOccupation.name);
        }
    };

    // Inicial (3 años) - 80% probabilidad (Solo si no está ya inscrito)
    if (age === 3 && (!basePlayer.mainOccupation || basePlayer.mainOccupation.name !== "Educación Inicial")) {
        if (Math.random() <= 0.80) {
            basePlayer.mainOccupation = { name: "Educación Inicial", salary: 0 };
            addToLog("Tus padres te han inscrito en educación inicial.");
        }
    }
    // Primaria (6 años obligatoria)
    else if (age === 6 && (!basePlayer.mainOccupation || basePlayer.mainOccupation.name !== "Escuela Primaria")) {
        savePreviousEducation(); // Guardamos el Inicial en el historial (si lo hizo)
        basePlayer.mainOccupation = { name: "Escuela Primaria", salary: 0 };
        addToLog("Has empezado la escuela primaria.");
    }
    // Secundaria (12 años obligatoria)
    else if (age === 12 && (!basePlayer.mainOccupation || basePlayer.mainOccupation.name !== "Escuela Secundaria")) {
        savePreviousEducation(); // Guardamos la Primaria en el historial
        basePlayer.mainOccupation = { name: "Escuela Secundaria", salary: 0 };
        addToLog("Has empezado la escuela secundaria.");
    }
    // Graduación Secundaria (17 años)
    else if (age === 17 && basePlayer.mainOccupation && basePlayer.mainOccupation.name === "Escuela Secundaria") {
        savePreviousEducation(); // Guardamos la Secundaria en el historial
        basePlayer.mainOccupation = null; // Quedas libre para universidad o trabajo
        addToLog("¡Te has graduado de la escuela secundaria! Ya puedes decidir tu futuro.");
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


function openOccupationMenu() {
    const container = document.createElement('div');
    container.className = 'occupation-menu';

   // 1. SECCIÓN: OCUPACIÓN ACTUAL ("You")
    if (basePlayer.mainOccupation) {
        // Título sutil como divisor
        const youTitle = document.createElement('h3');
        youTitle.textContent = 'Tú (Ocupación Actual)';
        youTitle.style.backgroundColor = '#f0f0f5';
        youTitle.style.color = '#8e8e93';
        youTitle.style.padding = '4px 8px';
        youTitle.style.margin = '0 0 10px 0';
        youTitle.style.fontSize = '0.9em';
        youTitle.style.textAlign = 'center';
        container.appendChild(youTitle);

        // Botón de tu trabajo/escuela actual
        const currentOccBtn = document.createElement('button');
        currentOccBtn.className = 'choice-btn';
        currentOccBtn.style.width = '100%';
        currentOccBtn.style.marginBottom = '20px';
        currentOccBtn.style.backgroundColor = '#fff';
        currentOccBtn.style.color = 'var(--text-color)';
        currentOccBtn.style.border = '2px solid var(--primary-color)';
        currentOccBtn.innerHTML = `<strong>${basePlayer.mainOccupation.name}</strong>`;

        // Opción de renunciar o dejar la escuela
        currentOccBtn.addEventListener('click', () => {
            if(confirm(`¿Quieres abandonar: ${basePlayer.mainOccupation.name}?`)) {
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
        const noOptionsMsg = document.createElement('p');
        noOptionsMsg.style.cssText = 'text-align: center; color: #8e8e93; margin-top: 20px;';
        noOptionsMsg.textContent = 'No hay opciones disponibles. Avanza de edad.';
        container.appendChild(noOptionsMsg);    
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
        <p style="text-align: center; margin-bottom: 20px;">Estás aplicando a la Universidad. Tu inteligencia actual influirá en la decisión.</p>
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
    btnSubmit.textContent = 'Enviar Solicitud';
    
    btnSubmit.addEventListener('click', () => {
        const chosenMajor = select.value;
        const intelligence = basePlayer.intelligence;
        let accepted = true;

        // Lógica de probabilidad de ingreso basada en inteligencia
        if (intelligence < 30) {
            accepted = Math.random() < 0.1; // 10% de probabilidad
        } else if (intelligence < 50) {
            accepted = Math.random() < 0.4; // 40% de probabilidad
        } else if (intelligence < 70) {
            accepted = Math.random() < 0.8; // 80% de probabilidad
        }

        if (accepted) {
            const customOcc = { ...occ, name: `${occ.name} (${chosenMajor})` };
            addToLog(`¡Tu solicitud ha sido ACEPTADA! Has empezado a estudiar ${chosenMajor}.`, 'event');
            assignOccupation(customOcc, 'education');
        } else {
            addToLog(`Tu solicitud a la universidad ha sido RECHAZADA. No cumples con los estándares académicos.`, 'event');
            closeModal();
        }
    });
    
    container.appendChild(btnSubmit);
    openModal('SOLICITUD UNIVERSITARIA', container);
}

// Conectar el botón del menú a la nueva función
document.getElementById('btn-occupation').addEventListener('click', openOccupationMenu);
// --- SISTEMA DE ASSETS (POSESIONES Y COMPRAS) ---

function openAssetsMenu() {
    const container = document.createElement('div');
    
    // 1. Finanzas (Botón para ver el resumen)
    const finTitle = document.createElement('div');
    finTitle.className = 'asset-category';
    finTitle.textContent = 'Finances';
    container.appendChild(finTitle);
    
    const btnFinances = document.createElement('button');
    btnFinances.className = 'choice-btn';
    btnFinances.style.backgroundColor = '#fff';
    btnFinances.style.color = 'var(--text-color)';
    btnFinances.innerHTML = `<strong>💰 Finanzas</strong> <br><span style="font-size:0.8em; color:#8e8e93;">Mira tus finanzas</span>`;
    btnFinances.addEventListener('click', showFinancesPopup);
    container.appendChild(btnFinances);

    // 2. Inventario (Propiedades, Vehículos, etc)
    const belongTitle = document.createElement('div');
    belongTitle.className = 'asset-category';
    belongTitle.textContent = 'Belongings';
    container.appendChild(belongTitle);

    const categories = [
        { id: 'properties', name: '🏠 Propiedades', desc: 'Gestiona tus inmuebles' },
        { id: 'vehicles', name: '🚗 Vehículos', desc: 'Mira tus coches' },
        { id: 'possessions', name: '🎒 Posesiones', desc: 'Joyas, instrumentos...' }
    ];

    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.backgroundColor = '#fff';
        btn.style.color = 'var(--text-color)';
        btn.style.marginBottom = '5px';
        const itemCount = basePlayer.assets[cat.id].length;
        btn.innerHTML = `<strong>${cat.name} (${itemCount})</strong> <br><span style="font-size:0.8em; color:#8e8e93;">${cat.desc}</span>`;
        container.appendChild(btn);
    });

    // 3. Botón Gigante de Shopping
    const shopBtn = document.createElement('button');
    shopBtn.className = 'shopping-btn';
    shopBtn.textContent = '🛍️ Go Shopping...';
    shopBtn.addEventListener('click', openShoppingMenu);
    container.appendChild(shopBtn);

    openModal('ASSETS', container);
}

function showFinancesPopup() {
    let totalAssetsValue = 0;
    const allAssets = [...basePlayer.assets.properties, ...basePlayer.assets.vehicles, ...basePlayer.assets.possessions];
    allAssets.forEach(item => totalAssetsValue += item.price);
    
    let netWorth = basePlayer.money + totalAssetsValue;

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="item-detail-row"><span>Bank Balance:</span> <strong>€${basePlayer.money.toLocaleString('es-ES')}</strong></div>
        <div class="item-detail-row"><span>Valor de Activos:</span> <strong>€${totalAssetsValue.toLocaleString('es-ES')}</strong></div>
        <div class="item-detail-row" style="border-bottom:none; margin-top:10px; font-size:1.1em;">
            <span>Net Worth (Patrimonio):</span> <strong style="color:var(--money-color);">€${netWorth.toLocaleString('es-ES')}</strong>
        </div>
    `;
    openModal('FINANCES', container);
}

function openShoppingMenu() {
    const shops = AssetManager.getShops();
    const container = document.createElement('div');
    
    const categories = [
        { key: 'carDealers', title: 'Car Dealers' },
        { key: 'realEstate', title: 'Real Estate Brokers' },
        { key: 'jewelers', title: 'Jewelers' },
        { key: 'musicStores', title: 'Music Stores' }
    ];

    categories.forEach(cat => {
        if (shops[cat.key]) {
            const title = document.createElement('div');
            title.className = 'asset-category';
            title.textContent = cat.title;
            container.appendChild(title);

            shops[cat.key].forEach(shop => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.style.backgroundColor = '#fff';
                btn.style.color = 'var(--text-color)';
                btn.style.marginBottom = '5px';
                btn.innerHTML = `<strong>${shop.name}</strong> <br><span style="font-size:0.8em; color:#8e8e93;">${shop.description}</span>`;
                btn.addEventListener('click', () => openStoreInventory(shop));
                container.appendChild(btn);
            });
        }
    });

    openModal('SHOPPING', container);
}

function openStoreInventory(shop) {
    const container = document.createElement('div');
    container.innerHTML = `<p style="text-align:center; color:#8e8e93;">Bienvenido a ${shop.name}</p>`;

    shop.inventory.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.style.backgroundColor = '#fff';
        btn.style.color = 'var(--text-color)';
        btn.style.marginBottom = '8px';
        btn.style.display = 'flex';
        btn.style.justifyContent = 'space-between';
        btn.innerHTML = `<span>${item.name}</span> <strong>€${item.price.toLocaleString('es-ES')}</strong>`;
        
        btn.addEventListener('click', () => showItemPurchasePopup(item));
        container.appendChild(btn);
    });

    openModal(shop.name.toUpperCase(), container);
}

function showItemPurchasePopup(item) {
    const container = document.createElement('div');
    
    // Imagen del producto usando URL
    container.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}" class="item-image">
        <h3 style="text-align:center; margin-top:0;">${item.name}</h3>
        <div class="item-detail-row"><span>Precio:</span> <strong>€${item.price.toLocaleString('es-ES')}</strong></div>
        <div class="item-detail-row"><span>Condición:</span> <strong>${item.condition}</strong></div>
        <div class="item-detail-row"><span>Tipo:</span> <strong>${item.type}</strong></div>
        <div class="item-detail-row"><span>Gasto Mensual (Mantenimiento):</span> <strong>€${item.monthlyMaintenance.toLocaleString('es-ES')}</strong></div>
    `;

    const buyBtn = document.createElement('button');
    buyBtn.className = 'choice-btn';
    buyBtn.style.marginTop = '20px';
    buyBtn.textContent = 'Comprar con Efectivo (Cash)';
    
    buyBtn.addEventListener('click', () => {
        const success = AssetManager.buyItem(basePlayer, item);
        if (success) {
            addToLog(`Has comprado un(a) ${item.name} por €${item.price.toLocaleString('es-ES')}.`, 'finance');
            updateUI();
            closeModal();
            // Truco para volver al menú de assets principal tras comprar
            setTimeout(openAssetsMenu, 300); 
        } else {
            alert("¡No tienes suficiente dinero en el banco para comprar esto!");
        }
    });

    container.appendChild(buyBtn);
    openModal('CAR', container); // El título superior
}

// Conectar el botón físico de ASSETS
document.getElementById('btn-assets').addEventListener('click', openAssetsMenu);
document.getElementById('btn-relationships').addEventListener('click', () => openModal('RELATIONSHIPS', 'Este es el menú de relaciones. JS lo llenará más adelante.'));
document.getElementById('btn-activities').addEventListener('click', () => openModal('ACTIVITIES', 'Este es el menú de actividades. JS lo llenará más adelante.'));

// Botón de perfil (simulación)
document.getElementById('btn-profile').addEventListener('click', () => openModal('MI PERFIL', 'Este es tu perfil. JS lo llenará con tus datos.'));

// --- INICIALIZACIÓN DEL JUEGO ---
updateUI(); // Se llama una sola vez

// Cargar Eventos y Ocupaciones al iniciar
Promise.all([
    EventManager.loadEvents(),
    OccupationManager.loadOccupations(),
    AssetManager.loadShops()
]).then(() => {
    console.log("¡Motor de Eventos y Ocupaciones listos!");
}).catch(err => {
    console.error("Hubo un problema iniciando el motor:", err);
});
