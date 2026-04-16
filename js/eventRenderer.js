/**
 * EventRenderer
 * Módulo para renderizar y gestionar la interacción con eventos en modales
 */

const EventRenderer = (() => {
  /**
   * Selecciona un outcome basado en sus probabilidades
   * @param {Array} outcomes - Array de outcomes con probabilidades
   * @returns {Object} El outcome seleccionado
   */
  const selectOutcome = (outcomes) => {
    const randomValue = Math.random() * 100;
    let cumulativeProbability = 0;

    for (const outcome of outcomes) {
      cumulativeProbability += outcome.probability;
      if (randomValue < cumulativeProbability) {
        return outcome;
      }
    }

    // Si llegamos aquí, retornar el último outcome (fallback)
    return outcomes[outcomes.length - 1];
  };

  /**
   * Aplica los cambios de stats al jugador
   * @param {Object} statChanges - Objeto con los cambios {stat: valor}
   */
  const applyStatChanges = (statChanges) => {
    if (!statChanges || Object.keys(statChanges).length === 0) return;

    for (const [stat, value] of Object.entries(statChanges)) {
      if (basePlayer.hasOwnProperty(stat)) {
        basePlayer[stat] += value;
        
        // SOLUCIÓN: Añadimos TODAS las estadísticas que tienen barras (0 a 100)
        const cappedStats = ['happiness', 'health', 'intelligence', 'looks', 'charisma'];
        if (cappedStats.includes(stat)) {
          basePlayer[stat] = Math.max(0, Math.min(100, basePlayer[stat]));
        }
      }
    }
  };

  /**
   * Crea y retorna HTML para los botones de opciones
   * @param {Array} choices - Array de choices del evento
   * @param {Function} handleChoiceClick - Callback para el click
   * @returns {HTMLElement} Div con los botones
   */
  const createChoicesHTML = (choices, handleChoiceClick) => {
    const choicesContainer = document.createElement('div');
    choicesContainer.className = 'event-choices';

    choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      button.textContent = choice.text;
      button.addEventListener('click', () => handleChoiceClick(choice, index));
      choicesContainer.appendChild(button);
    });

    return choicesContainer;
  };

  /**
   * Renderiza un evento en un modal
   * @param {Object} eventObject - Objeto del evento a renderizar
   */
  const renderEvent = (eventObject) => {
    if (!eventObject) {
      console.warn('No hay evento para renderizar');
      return;
    }

    // Crear contenido del modal
    const content = document.createElement('div');
    content.className = 'event-content';

    // Texto del evento
    const eventText = document.createElement('p');
    eventText.className = 'event-text';
    eventText.textContent = eventObject.text;
    content.appendChild(eventText);

    // Contenedor de opciones
    const choicesContainer = createChoicesHTML(
      eventObject.choices,
      (choice, choiceIndex) => {
        handleChoiceSelection(eventObject, choice, choiceIndex);
      }
    );
    content.appendChild(choicesContainer);

    // Abrir modal
    openModal(eventObject.title, content);
  };

  /**
   * Maneja la selección de una opción (choice)
   * @param {Object} event - El evento original
   * @param {Object} choice - La opción seleccionada
   * @param {number} choiceIndex - Índice de la opción
   */
  const handleChoiceSelection = (event, choice, choiceIndex) => {
    // Seleccionar outcome basado en probabilidades
    const selectedOutcome = selectOutcome(choice.outcomes);

    // Cerrar modal
    closeModal();

    // Aplicar cambios de stats
    applyStatChanges(selectedOutcome.statChanges);

    // Actualizar la UI
    updateUI();

    // Registrar en el historial
    addToLog(selectedOutcome.resultText);

    // Opcional: Log para debug
    console.log(`Evento: ${event.id}, Opción: ${choiceIndex}, Resultado aplicado`);
  };

  // API pública
  return {
    renderEvent,
  };
})();
