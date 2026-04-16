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
   * Obtiene un evento aleatorio basado en la edad del jugador
   * @param {number} currentAge - Edad actual del jugador
   * @returns {Object|null} Evento que ocurrió o null si ninguno ocurrió
   */
  const getRandomEvent = (currentAge) => {
    if (events.length === 0) {
      console.warn('No hay eventos cargados');
      return null;
    }

    // Filtrar eventos válidos para la edad actual
    const validEvents = events.filter(
      (event) => currentAge >= event.minAge && currentAge <= event.maxAge
    );

    if (validEvents.length === 0) {
      return null;
    }

    // Iterar sobre eventos válidos y evaluar probabilidad
    for (const event of validEvents) {
      const randomValue = Math.random() * 100;
      if (randomValue < event.triggerProbability) {
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
