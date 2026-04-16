/**
 * EconomyManager
 * Módulo para gestionar la economía y finanzas del jugador
 */

const EconomyManager = (() => {
  // Configuración de economía
  const BASIC_EXPENSE_RATE = 0.15; // 15% de gastos básicos para adultos

  /**
   * Procesa el año económico del jugador
   * @param {Object} player - Objeto del jugador con money, age, mainOccupation, partTimeJob
   * @returns {string} Resumen financiero del año
   */
  const processYear = (player) => {
    // Calcular ingresos totales
    let totalIncome = 0;

    if (player.mainOccupation && player.mainOccupation.salary) {
      totalIncome += player.mainOccupation.salary;
    }

    if (player.partTimeJob && player.partTimeJob.salary) {
      totalIncome += player.partTimeJob.salary;
    }

    // Calcular gastos
    let totalExpenses = 0;

    if (player.age > 18) {
      totalExpenses = Math.round(totalIncome * BASIC_EXPENSE_RATE);
    }

    // Calcular ingresos netos
    const netIncome = totalIncome - totalExpenses;

    // Actualizar dinero del jugador
    player.money += netIncome;

    // Asegurar que el dinero no sea negativo (por simplicidad)
    if (player.money < 0) {
      player.money = 0;
    }

    // Generar resumen
    const summary = `Este año ganaste €${totalIncome.toLocaleString()} y gastaste €${totalExpenses.toLocaleString()}`;

    return summary;
  };

  /**
   * Calcula el ingreso potencial de un jugador sin aplicar cambios
   * @param {Object} player - Objeto del jugador
   * @returns {Object} {totalIncome, totalExpenses, netIncome}
   */
  const calculateIncome = (player) => {
    let totalIncome = 0;

    if (player.mainOccupation && player.mainOccupation.salary) {
      totalIncome += player.mainOccupation.salary;
    }

    if (player.partTimeJob && player.partTimeJob.salary) {
      totalIncome += player.partTimeJob.salary;
    }

    let totalExpenses = 0;
    if (player.age > 18) {
      totalExpenses = Math.round(totalIncome * BASIC_EXPENSE_RATE);
    }

    const netIncome = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, netIncome };
  };

  // API pública
  return {
    processYear,
    calculateIncome,
  };
})();
