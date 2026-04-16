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
        
        // Limitar estadísticas entre 0 y 100
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
   * Crea y retorna HTML para un formulario de evento
   * @param {Array} inputs - Array de inputs del formulario
   * @param {Function} handleSubmit - Callback para el submit
   * @returns {HTMLElement} Div con los inputs y botón submit
   */
  const createFormHTML = (inputs, handleSubmit) => {
    const formContainer = document.createElement('div');
    formContainer.className = 'event-form';

    // Iterar sobre los inputs y crear elementos HTML
    inputs.forEach((input) => {
      if (input.type === 'select') {
        // Crear label
        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.textContent = input.label || input.id;
        formContainer.appendChild(label);

        // Crear select
        const select = document.createElement('select');
        select.id = input.id;
        select.className = 'form-select';

        // Añadir opciones
        input.options.forEach((option) => {
          const optionElement = document.createElement('option');
          optionElement.value = option.value;
          optionElement.textContent = option.label;
          select.appendChild(optionElement);
        });

        formContainer.appendChild(select);
      }
    });

    // Crear botón Submit
    const submitButton = document.createElement('button');
    submitButton.className = 'choice-btn';
    submitButton.textContent = 'Continuar';
    submitButton.addEventListener('click', () => handleSubmit(inputs));
    formContainer.appendChild(submitButton);

    return formContainer;
  };

  /**
   * Resuelve un evento encadenado o cierra el modal
   * @param {Object} outcome - El outcome resuelto
   */
  const resolveOutcome = (outcome) => {
    // Si hay un evento encadenado, renderizarlo
    if (outcome.nextEventId) {
      const nextEvent = EventManager.getEventById(outcome.nextEventId);
      if (nextEvent) {
        renderEvent(nextEvent);
        return;
      }
    }

    // Sino, cerrar modal
    closeModal();
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

    // Renderizar según el tipo de evento
    if (eventObject.type === 'form') {
      // Evento de formulario
      const formContainer = createFormHTML(
        eventObject.inputs,
        (inputs) => {
          handleFormSubmit(eventObject, inputs);
        }
      );
      content.appendChild(formContainer);
    } else {
      // Evento normal con opciones
      const choicesContainer = createChoicesHTML(
        eventObject.choices,
        (choice, choiceIndex) => {
          handleChoiceSelection(eventObject, choice, choiceIndex);
        }
      );
      content.appendChild(choicesContainer);
    }

    // Abrir modal
    openModal(eventObject.title, content);
  };

  /**
   * Maneja el envío de un formulario de evento
   * @param {Object} event - El evento original
   * @param {Array} inputs - Array de inputs del formulario
   */
  const handleFormSubmit = (event, inputs) => {
    // Obtener valores del formulario
    const formValues = {};
    inputs.forEach((input) => {
      const element = document.getElementById(input.id);
      if (element) {
        formValues[input.id] = element.value;
      }
    });

    // Obtener el valor del primer select (por ahora asumimos uno solo)
    const selectedValue = formValues[inputs[0].id];

    // Obtener outcomes para este valor
    const outcomesForValue = event.outcomes[selectedValue];
    if (!outcomesForValue) {
      console.warn(`No hay outcomes para el valor: ${selectedValue}`);
      return;
    }

    // Seleccionar outcome basado en probabilidades
    const selectedOutcome = selectOutcome(outcomesForValue);

    // Aplicar cambios de stats
    applyStatChanges(selectedOutcome.statChanges);

    // Registrar en el historial
    addToLog(selectedOutcome.resultText);

    // Resolver evento encadenado o cerrar modal
    resolveOutcome(selectedOutcome);

    // Actualizar la UI
    updateUI();

    console.log(`Evento: ${event.id}, Valor seleccionado: ${selectedValue}, Resultado aplicado`);
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

    // Aplicar cambios de stats
    applyStatChanges(selectedOutcome.statChanges);

    // Registrar en el historial
    addToLog(selectedOutcome.resultText);

    // Resolver evento encadenado o cerrar modal
    resolveOutcome(selectedOutcome);

    // Actualizar la UI
    updateUI();

    // Log para debug
    console.log(`Evento: ${event.id}, Opción: ${choiceIndex}, Resultado aplicado`);
  };

  // API pública
  return {
    renderEvent,
  };
})();
