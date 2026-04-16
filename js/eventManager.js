/**
 * EventManager
 * Módulo para gestionar eventos aleatorios en el simulador de vida
 */

const EventManager = (() => {
  let events = [];

  /**
   * Carga los eventos desde el archivo JSON
   * @returns {Promise<void>}
   */
  const loadEvents = async () => {
    try {
      const response = await fetch('data/events.json');
      if (!response.ok) {
        throw new Error(`Error cargando eventos: ${response.status}`);
      }
      events = await response.json();
      console.log(`${events.length} eventos cargados exitosamente`);
    } catch (error) {
      console.error('Error en loadEvents:', error);
      throw error;
    }
  };

  /**
   * Verifica si un evento cumple todos sus requisitos
   * @param {Object} event - El evento a verificar
   * @param {Object} playerStats - Stats del jugador {age, money, health, happiness}
   * @returns {boolean} true si cumple todos los requisitos
   */
  const meetsRequirements = (event, playerStats) => {
    if (!event.requirements) {
      return true; // Sin requisitos, siempre válido
    }

    const req = event.requirements;

    // Mapeo de propiedades de requisitos a propiedades de playerStats
    const statMappings = {
      minAge: 'age',
      maxAge: 'age',
      minMoney: 'money',
      maxMoney: 'money',
      minHealth: 'health',
      maxHealth: 'health',
      minHappiness: 'happiness',
      maxHappiness: 'happiness'
    };

    // Iterar sobre cada requisito
    for (const [reqKey, reqValue] of Object.entries(req)) {
      const statKey = statMappings[reqKey];
      if (!statKey) {
        console.warn(`Requisito desconocido: ${reqKey}`);
        continue; // Ignorar requisitos desconocidos
      }

      const playerValue = playerStats[statKey];
      if (playerValue === undefined) {
        console.warn(`Propiedad de jugador no encontrada: ${statKey}`);
        continue;
      }

      // Verificar si es mínimo o máximo
      if (reqKey.startsWith('min') && playerValue < reqValue) {
        return false;
      }
      if (reqKey.startsWith('max') && playerValue > reqValue) {
        return false;
      }
    }

    return true;
  };

  /**
   * Obtiene la probabilidad de un evento para una edad específica
   * @param {Object} event - El evento
   * @param {number} currentAge - Edad actual del jugador
   * @returns {number} Probabilidad (0-100)
   */
  const getEventProbability = (event, currentAge) => {
    // Si el evento tiene probabilidades dinámicas por edad
    if (event.probabilityByAge && Array.isArray(event.probabilityByAge)) {
      const ageRange = event.probabilityByAge.find(
        (range) => currentAge >= range.minAge && currentAge <= range.maxAge
      );
      if (ageRange) {
        return ageRange.probability;
      }
    }

    // Fallback: usar triggerProbability si existe
    return event.triggerProbability || 0;
  };

  /**
   * Obtiene un evento aleatorio basado en stats del jugador
   * @param {Object} playerStats - {age, money, health, happiness}
   * @returns {Object|null} Evento que ocurrió o null si ninguno ocurrió
   */
  const getRandomEvent = (playerStats) => {
    if (events.length === 0) {
      console.warn('No hay eventos cargados');
      return null;
    }

    // Filtrar eventos que cumplan requisitos
    const validEvents = events.filter(
      (event) => meetsRequirements(event, playerStats)
    );

    if (validEvents.length === 0) {
      return null;
    }

    // Iterar sobre eventos válidos y evaluar probabilidad
    for (const event of validEvents) {
      const probability = getEventProbability(event, playerStats.age);
      const randomValue = Math.random() * 100;
      if (randomValue < probability) {
        return event;
      }
    }

    // Ningún evento fue activado
    return null;
  };

  /**
   * Obtiene todos los eventos cargados (útil para debug)
   * @returns {Array} Array de eventos
   */
  const getEvents = () => [...events];

  /**
   * Obtiene un evento específico por ID
   * @param {string} eventId - ID del evento
   * @returns {Object|undefined} Evento encontrado o undefined
   */
  const getEventById = (eventId) => events.find((event) => event.id === eventId);

  // API pública
  return {
    loadEvents,
    getRandomEvent,
    getEvents,
    getEventById,
  };
})();
