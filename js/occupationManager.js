/**
 * OccupationManager
 * Módulo para gestionar ocupaciones y educación en el simulador de vida
 */

const OccupationManager = (() => {
  let occupations = {};

  /**
   * Carga las ocupaciones desde el archivo JSON
   * @returns {Promise<void>}
   */
  const loadOccupations = async () => {
    try {
      const response = await fetch('data/occupations.json');
      if (!response.ok) {
        throw new Error(`Error cargando ocupaciones: ${response.status}`);
      }
      occupations = await response.json();
      console.log('Ocupaciones cargadas exitosamente');
    } catch (error) {
      console.error('Error en loadOccupations:', error);
      throw error;
    }
  };

  /**
   * Verifica si una ocupación está disponible para el jugador
   * @param {Object} occupation - La ocupación a verificar
   * @param {Object} player - Objeto del jugador con age y educationHistory
   * @returns {boolean} true si está disponible
   */
  const isOccupationAvailable = (occupation, player) => {
    // Verificar edad mínima
    if (player.age < occupation.minAge) {
      return false;
    }

    // Verificar requisito de educación si existe
    if (occupation.req && !player.educationHistory.includes(occupation.req)) {
      return false;
    }

    return true;
  };

  /**
   * Obtiene las ocupaciones disponibles para el jugador
   * @param {Object} player - Objeto del jugador con age y educationHistory
   * @returns {Object} Objeto con arrays filtrados: education, fullTime, partTime, freelance
   */
  const getAvailableOccupations = (player) => {
    if (!occupations || Object.keys(occupations).length === 0) {
      console.warn('No hay ocupaciones cargadas');
      return { education: [], fullTime: [], partTime: [], freelance: [] };
    }

    return {
      education: occupations.education.filter(occ => isOccupationAvailable(occ, player)),
      fullTime: occupations.fullTime.filter(occ => isOccupationAvailable(occ, player)),
      partTime: occupations.partTime.filter(occ => isOccupationAvailable(occ, player)),
      freelance: occupations.freelance.filter(occ => isOccupationAvailable(occ, player))
    };
  };

  /**
   * Obtiene todas las ocupaciones cargadas (útil para debug)
   * @returns {Object} Objeto con todas las ocupaciones
   */
  const getOccupations = () => ({ ...occupations });

  /**
   * Obtiene una ocupación específica por nombre y categoría
   * @param {string} category - Categoría (education, fullTime, partTime, freelance)
   * @param {string} name - Nombre de la ocupación
   * @returns {Object|undefined} Ocupación encontrada o undefined
   */
  const getOccupationByName = (category, name) => {
    if (!occupations[category]) return undefined;
    return occupations[category].find(occ => occ.name === name);
  };

  // API pública
  return {
    loadOccupations,
    getAvailableOccupations,
    getOccupations,
    getOccupationByName,
  };
})();
